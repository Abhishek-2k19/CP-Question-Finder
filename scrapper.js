const puppeteer = require('puppeteer');

async function scrapeLeetCodeQuestions() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://leetcode.com/problemset/all/');

  // Wait for the page to load the questions
  await page.waitForSelector('.reactable-data');

  // Extract the question details
  const questions = await page.evaluate(() => {
    const questionElements = document.querySelectorAll('.reactable-data tr');

    // Map each question element to extract necessary information
    const questionData = Array.from(questionElements).map((element) => {
      const questionId = element.querySelector('.text-xs').innerText.trim();
      const title = element.querySelector('.question-title a').innerText.trim();
      const difficulty = element.querySelector('.difficulty-label').innerText.trim();
      const url = element.querySelector('.question-title a').href;
      return { questionId, title, difficulty, url };
    });

    return questionData;
  });

  // Print the scraped questions
  console.log(questions);

  await browser.close();
}

scrapeLeetCodeQuestions();
