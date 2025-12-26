const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://news.ycombinator.com/newest");

  let timestamps = [];

  // Loop until we have 100 timestamps
  while (timestamps.length < 100) {

    await page.waitForSelector('.age');
    const ageElements = page.locator('.age');
    const count = await ageElements.count();

    for (let i = 0; i < count; i++) {
      if (timestamps.length >= 100) break;

      const titleAttr = await ageElements.nth(i).getAttribute('title');

      // titleAttr example: "2025-12-25T01:00:00 1735088400"
      // We grab the Unix timestamp (the second part) for precise sorting
      const unixTimestamp = parseInt(titleAttr.split(' ')[1]);
      timestamps.push(unixTimestamp);
    }

    // 4. Click 'More' if we haven't reached 100 yet
    if (timestamps.length < 100) {
      const moreLink = page.locator('.morelink');
      if (await moreLink.isVisible()) {
        await moreLink.click();
        await page.waitForLoadState('networkidle');
      } else {
        break;
      }
    }
  }

  let isSorted = true;
  for (let i = 0; i < timestamps.length - 1; i++) {
    // Current timestamp must be GREATER (newer) than or EQUAL to the next one
    if (timestamps[i] < timestamps[i + 1]) {
      isSorted = false;
      console.error(`Sort Error at index ${i}: ${timestamps[i]} is older than ${timestamps[i + 1]}`);
      break;
    }
  }

  if (!isSorted) {
    await browser.close();
    throw new Error("Validation Failed: Articles are not correctly sorted.");
  }

  await browser.close();
}

// Execute the function
sortHackerNewsArticles().catch(err => {
  console.error("An error occurred during execution:");
  console.error(err);
  process.exit(1);
});