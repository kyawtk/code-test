import { HotelData, HotelDataSchema } from "@/lib/schemas";
import chromium from "@sparticuz/chromium-min";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { z } from "zod";

chromium.setGraphicsMode = false;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
const GRAPHQL_ENDPOINT = "/graphql/property";
const SECONDARY_DATA_ENDPOINT =
  "/api/cronos/property/BelowFoldParams/GetSecondaryData";

const launchBrowser = async () => {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  chromium.setGraphicsMode = false;

  return puppeteer.launch({
    executablePath: isLocal
      ? process.env.CHROME_EXECUTABLE_PATH
      : await chromium.executablePath(process.env.BROWSER_EXECUTABLE_PATH),
    headless: chromium.headless,
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
  });
};

const extractHotelData = async (
  url: string
): Promise<HotelData | undefined> => {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  let hotelData: HotelData | undefined;

  try {
    await page.setUserAgent(USER_AGENT);

    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (
        ["image", "stylesheet", "font", "media"].includes(req.resourceType())
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    page.on("response", async (response) => {
      const method = response.request().method();
      const requestUrl = response.url();

      if (requestUrl.includes(GRAPHQL_ENDPOINT) && method === "POST") {
        try {
          const jsonResponse = await response.json();
          hotelData = HotelDataSchema.parse(jsonResponse);
        } catch (err) {
          console.error("Error parsing hotel data:", err);
        }
      }

      if (requestUrl.includes(SECONDARY_DATA_ENDPOINT) && method === "GET") {
        const jsonResponse = await response.json();
        console.log("Captured Secondary Data:", jsonResponse);
      }
    });

    await page.goto(url);
    // await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  } catch (err) {
    console.error("Error navigating page:", err);
  } finally {
    await browser.close();
  }

  return hotelData;
};

const transformHotelData = (hotelData?: HotelData) => {
  if (!hotelData) {
    return { success: false };
  }
  const content =
    hotelData.data.propertyDetailsSearch.propertyDetails[0]?.contentDetail;

  return {
    success: true,
    name: content?.contentSummary.displayName,
    hotelDescription: content?.contentInformation.description.short,
    facilityHighlights: content?.contentFeatures.facilityHighlights,
    featureGroups: content?.contentFeatures.featureGroups,
  };
};

export async function GET(request: NextRequest): Promise<Response> {
  let searchParams = request.nextUrl.searchParams;
  const querySchema = z.object({
    url: z.string().url(),
  });
  let url = searchParams.get("url");
  const result = querySchema.safeParse({ url });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing URL" },
      { status: 400 }
    );
  }

  url = result.data.url;
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid or missing URL" },
      { status: 400 }
    );
  }

  try {
    const hotelData = await extractHotelData(url);
    const responseData = transformHotelData(hotelData);
    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
