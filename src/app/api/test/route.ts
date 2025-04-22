import chromium from "@sparticuz/chromium-min";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

const launchBrowser = async () => {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  try {
    return await puppeteer.launch({
      executablePath: isLocal
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(process.env.BROWSER_EXECUTABLE_PATH),
      args: puppeteer.defaultArgs(),
    });
  } catch (error) {
    console.error("Error launching browser:", error);
    throw error;
  }
};

export async function GET(request: Request) {
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto("https://agoda.com", { waitUntil: "networkidle2" });

    await page.waitForSelector("#tab-activities-tab");
    await page.click("#tab-activities-tab");
    await page.waitForSelector("#activities-search-input");
    await page.focus("#activities-search-input");
    await page.type("#activities-search-input", "dubai");
    await page.waitForSelector('.AutocompleteList .Suggestion');
    await page.click('.AutocompleteList .Suggestion');

    await page.keyboard.press("Enter");
    await page.screenshot({ path: "debug.png" });
    return NextResponse.json({
      success: true,
      message: "Operation completed.",
    });
  } catch (error) {
    console.error("Error during Puppeteer operations:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
