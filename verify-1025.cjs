const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1025, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file:///C:/Users/wasab/Desktop/Project/awai/SCS/index.html');
  await page.waitForTimeout(300);
  const result = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    storyPanelPosition: getComputedStyle(document.querySelector('.story-sequence__panel')).position,
    storyStickyPosition: getComputedStyle(document.querySelector('.story-sequence__sticky')).position,
  }));
  console.log(JSON.stringify({ errors, ...result }));
  await browser.close();
})();
