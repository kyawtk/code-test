import { extractFields } from "@/lib/utils";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToFetch = searchParams.get("url") as string;

  let executablePath =
    process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/chromium-browser"; // Linux

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
  });

  let hotelData = null;
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
      const jsonResponse = await response.json();
      hotelData = jsonResponse;
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

  const content =
    hotelData?.data?.propertyDetailsSearch?.propertyDetails[0]?.contentDetail;
  //   const hotelDescription = content?.contentInformation?.description?.short;
  //  const facilities = content?.contentFeatures?.facilityHighlights
  const descriptionFromLIb = extractFields(hotelData, ["short"]);
  await browser.close();
  return Response.json({ hotelDescription: descriptionFromLIb, secondaryData });
}
