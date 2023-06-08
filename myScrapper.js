const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const fs = require("fs");
const { resolve } = require('path');

const homepageLink = 'https://leetcode.com/problemset/all/';

async function scrapeLeetCodeQuestions(pageButton,browser,index,page) {
  // await page.goto(pageLink);  
  console.log(`Scrapping from : ${index}`);

  // await pageButton.click();
  // await page.waitForNavigation();
  await Promise.all([
    pageButton.click(), // Click the button
    // page.waitForNavigation({ waitUntil: 'networkidle0' , timeout: 60000}), // Wait for navigation to complete
    page.waitForSelector('div.-mx-4.transition-opacity.md\\:mx-0'),
  ]);

  // await page.waitForFunction(() => {
  //   // Check if the desired element is present or any specific condition is met
  //   return document.querySelector('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s') !== null;
  // });

  // taking page data for dom manipulation
  const pageData = await page.content()
  const dom = new JSDOM(pageData);
  const document = dom.window.document;

  const anchorTags = document.getElementsByTagName('a');

  const linksArray = [];
  for (let i = 0; i < anchorTags.length; i++) {
    // console.log(anchorTags[i].getAttribute('href'));
    linksArray.push(anchorTags[i].getAttribute('href'));
  }

  console.log(linksArray.length);
  fs.writeFileSync(`links${index}.txt`, linksArray.join('\n'));
}
  

  // const html = await page.content();
  // fs.writeFileSync("index.html", html);
  // console.log(html)
  // Wait for the page to load the questions
  // await page.waitFor(".mb-6 md:mb-0 flex flex-nowrap items-center space-x-2");



function getNumberOfPages(){
  return new Promise(async(resolve,reject)=> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(homepageLink);

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
    if (container.length==0){
      reject(new Error('Error1: Failed to scrap the page button container!'));
    }

    const buttons = container[0].querySelectorAll("button");
    if(buttons.length==0){
      reject(new Error('Error2: Failed to scrap the page button container!'));
    }

    resolve(buttons);
    await browser.close();
  });
}

getNumberOfPages()
.then(async(result)=>{
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(homepageLink);
  // waiting for page to load the dynamic part
  await page.waitForFunction(() => {
    // Check if the desired element is present or any specific condition is met
    return document.querySelector('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s') !== null;
  });

  for (let i = 1; i < result.length - 1; i++) {
    await scrapeLeetCodeQuestions(result[result.length - 1],browser,i,page);
  }
  // await browser.close();
})
