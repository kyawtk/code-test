import chromium from "@sparticuz/chromium-min";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { z } from "zod";

const FacilityHighlightSchema = z.object({
  facilityName: z.string(),
  facilityId: z.number(),
});

const FeatureGroupFeatureSchema = z.object({
  available: z.boolean(),
  featureName: z.string(),
});
const FeatureGroupSchema = z.object({
  name: z.string(),
  id: z.number(),
  features: z.array(FeatureGroupFeatureSchema),
});

const DescriptionSchema = z.object({
  short: z.string(),
});

const ContentInformationSchema = z.object({
  description: DescriptionSchema,
});

const ContentFeaturesSchema = z.object({
  facilityHighlights: z.array(FacilityHighlightSchema),
  featureGroups: z.array(FeatureGroupSchema),
});

const ContentSummarySchema = z.object({
  displayName: z.string(),
});

const ContentDetailSchema = z.object({
  contentSummary: ContentSummarySchema,
  contentInformation: ContentInformationSchema,
  contentFeatures: ContentFeaturesSchema,
});

const PropertyDetailSchema = z.object({
  contentDetail: ContentDetailSchema,
});

const PropertyDetailsSearchSchema = z.object({
  propertyDetails: z.array(PropertyDetailSchema),
});

const HotelDataSchema = z.object({
  data: z.object({
    propertyDetailsSearch: PropertyDetailsSearchSchema,
  }),
});
type HotelData = z.infer<typeof HotelDataSchema>;

const ApiResponseSchema = z.object({
  name: z.string(),
  hotelDescription: z.string(),
  facilityHighlights: z.array(z.any()),
  featureGroups: z.array(z.any()),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;

chromium.setGraphicsMode = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToFetch = searchParams.get("url") as string;

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    executablePath: isLocal
      ? process.env.CHROME_EXECUTABLE_PATH
      : await chromium.executablePath(),
    headless: chromium.headless,
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
  });

  let hotelData: HotelData | undefined;
  let secondaryData = null;

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    const resourceType = request.resourceType();
    const url = request.url();
    request.continue();
  });

  page.on("response", async (response) => {
    const method = response.request().method();
    const requestUrl = response.url();

    if (requestUrl.includes("/graphql/property") && method === "POST") {
      try {
        const jsonResponse = await response.json();
        hotelData = HotelDataSchema.parse(jsonResponse);
      } catch (err) {
        console.error("Error parsing hotelData with Zod:", err);
      }
    }

    if (
      requestUrl.includes(
        "/api/cronos/property/BelowFoldParams/GetSecondaryData"
      ) &&
      method === "GET"
    ) {
      const jsonResponse = await response.json();
      secondaryData = jsonResponse;
      console.log("Captured Secondary Data:", jsonResponse);
    }
  });

  try {
    await page.goto(urlToFetch, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  } catch (err) {
    console.error("Error navigating to page:", err);
    await browser.close();
    return NextResponse.json(
      { success: false, error: "Failed to load page" },
      { status: 500 }
    );
  }

  let content, hotelDescription, facilityHighlights, featureGroups, displayName;

  if (hotelData) {
    content =
      hotelData?.data.propertyDetailsSearch?.propertyDetails[0]?.contentDetail;
    hotelDescription = content?.contentInformation?.description?.short;
    facilityHighlights = content?.contentFeatures?.facilityHighlights;
    featureGroups = content?.contentFeatures?.featureGroups;
    displayName = content?.contentSummary?.displayName;
  }

  await browser.close();

  return NextResponse.json({
    name: displayName,
    hotelDescription,
    facilityHighlights,
    featureGroups,
  });
}
