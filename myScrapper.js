const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const fs = require("fs");
const { resolve } = require('path');

const homepageLink = 'https://leetcode.com/problemset/all/';

async function scrapeLeetCodeQuestions(pageNumber,browser) {
  const pageLink = homepageLink + `?page=${pageNumber}`;
  // await page.goto(pageLink);  
  console.log(`Scrapping from : ${pageLink}`);
  const page = await browser.newPage();
  await page.goto(pageLink);

  await page.waitForFunction(() => {
    // Check if the desired element is present or any specific condition is met
    return document.querySelector('.h-5.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s') !== null;
  });

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
  fs.writeFileSync(`links${pageNumber}.txt`, linksArray.join('\n'));

  await page.close();
}
  

  // const html = await page.content();
  // fs.writeFileSync("index.html", html);
  // console.log(html)
  // Wait for the page to load the questions
  // await page.waitFor(".mb-6 md:mb-0 flex flex-nowrap items-center space-x-2");



function getNumberOfPages(){
  return new Promise(async(resolve,reject)=> {
    const browser = await puppeteer.launch('headless:false');
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
    let numPages = 1;
    buttons.forEach((button) => {
      let newStr = button.textContent.trim();
      if(newStr!=""){
        const pgN = parseInt(newStr);
        if(!isNaN(pgN)){
          numPages = Math.max(numPages,pgN);
        }
      }
    });
    resolve(numPages);
    await browser.close();
  });
}

getNumberOfPages()
.then(async(result)=>{
  const browser = await puppeteer.launch({ headless: false });
  for(let i=1;i<=result;i++){
    await scrapeLeetCodeQuestions(i,browser);
  }
  await browser.close();
})
