const puppeteer = require('puppeteer');
const fs = require('fs');

const homepageLink = 'https://leetcode.com/problemset/all/';

async function scrapeLeetCodeQuestions(page,qset) {
  const anchorTags = await page.$$eval('a', (anchors) => anchors.map((a) => a.getAttribute('href')));

  console.log(anchorTags.length);

  const regex = /^\/problems\/[^\/]+\/$/;
  const matches = anchorTags.filter((str) => regex.test(str));
  matches.forEach((value) => {
    qset.add(value);
  });
//   fs.writeFileSync(`links${page.index}.txt`, anchorTags.join('\n'));
}

async function getNumberOfPages(page) {
  await page.waitForSelector('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s');

  const buttons = await page.$$eval('.mb-6.md\\:mb-0.flex.flex-nowrap.items-center.space-x-2 button', (btns) =>
    btns.map((btn) => btn.textContent.trim())
  );

  return buttons;
}

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(homepageLink);

  const buttons = await getNumberOfPages(page);
  const maxPages = parseInt(buttons[buttons.length - 2]);

  const qset = new Set();

  for (let i = 1; i <= maxPages; i++) {
    await scrapeLeetCodeQuestions(page,qset);

    await page.waitForSelector('.flex.items-center.justify-center.px-3.h-8.rounded.select-none.focus\\:outline-none.bg-fill-3.dark\\:bg-dark-fill-3.text-label-2.dark\\:text-dark-label-2.hover\\:bg-fill-2.dark\\:hover\\:bg-dark-fill-2');

    const nextPageButton = await page.$('.flex.items-center.justify-center.px-3.h-8.rounded.select-none.focus\\:outline-none.bg-fill-3.dark\\:bg-dark-fill-3.text-label-2.dark\\:text-dark-label-2.hover\\:bg-fill-2.dark\\:hover\\:bg-dark-fill-2:last-child');
    await nextPageButton.evaluate((btn) => btn.style.backgroundColor = 'yellow');
    await nextPageButton.click();

    await page.waitForTimeout(4000);
    console.log(`Page number: ${i}`);
  }

  await browser.close();

  fs.writeFileSync(`links.txt`, Array.from(qset).join('\n'));

}

run();
