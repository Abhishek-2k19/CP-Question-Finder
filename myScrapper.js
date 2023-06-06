const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const fs = require("fs");

const homepageLink = 'https://leetcode.com/problemset/all/';

async function scrapeLeetCodeQuestions() {
  const browser = await puppeteer.launch('headless:false');
  const page = await browser.newPage();
  await page.goto(homepageLink);

  // await page.waitForSelector('.h-5 hover:text-blue-s dark:hover:text-dark-blue-s',{ timeout: 120000 });

  // waiting for page to load the dynamic part
  await page.waitForFunction(() => {
    // Check if the desired element is present or any specific condition is met
    return document.querySelector('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s') !== null;
  });


  // taking page data for dom manipulation
  const pageData = await page.content()
  const dom = new JSDOM(pageData);
  const document = dom.window.document;


  // finding the total number of pages

  const container = document.getElementsByClassName("mb-6 md:mb-0 flex flex-nowrap items-center space-x-2");
  // console.log(container);
  // const array = Array.from(container);
  // console.log(array[0].innerHTML);
  
  const buttons = container[0].querySelectorAll("button");
  // console.log(buttons.length);
  let numPages = 1;
  buttons.forEach((button) => {
    // Perform actions on each button
    // console.log(button.textContent); // Example action: Print button text
    // console.log(typeof button.textContent); // Example action: Print button text
    let newStr = button.textContent.trim();
    if(newStr!=""){
      const pgN = parseInt(newStr);
      if(!isNaN(pgN)){
        numPages = Math.max(numPages,pgN);
      }
    }
  });

  console.log(numPages);


  for(let i=1;i<=numPages;i++){
    const pageLink = homepageLink + `?page=${i}`;
    await page.goto(pageLink);
  }

  // const anchorTags = document.getElementsByTagName('a');

  // const linksArray = [];
  // for (let i = 0; i < anchorTags.length; i++) {
  //   // console.log(anchorTags[i].getAttribute('href'));
  //   linksArray.push(anchorTags[i].getAttribute('href'));
  // }

  // console.log(linksArray.length);
  // fs.writeFileSync("links.txt", linksArray.join('\n'));

  // const html = await page.content();
  // fs.writeFileSync("index.html", html);
  // console.log(html)
  // Wait for the page to load the questions
  // await page.waitFor(".mb-6 md:mb-0 flex flex-nowrap items-center space-x-2");

  



  await browser.close();
}

scrapeLeetCodeQuestions();
