const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractPTags(page) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
  
//   await page.goto('https://leetcode.com/problems/two-sum/');
  


  const pTags = await page.$$eval('div._1l1MA > p', (elements) => {
    const pTags = [];
    let foundEmptyPTag = false;
    // console.log("Hello");
    
    for (const element of elements) {
      if (!foundEmptyPTag) {
        const text = element.textContent.trim();
        // console.log("text " + text);
        pTags.push(text);
        // pTags.push(element)
        
        if (element.innerHTML.trim() === '&nbsp;') {
          foundEmptyPTag = true;
        }
      }
    }
    
    return pTags;
  });

  

  return pTags;
//   console.log(pTags);
// pTags.forEach((pTag)=>{
//     console.log(pTag);
// });
  
//   await browser.close();
}

// extractPTags();


async function scrapeData() {
  // Read the contents of the "links.txt" file
  const links = fs.readFileSync('links.txt', 'utf8').split('\n');

  // Initialize an empty object to store the mapping
  const dataMapping = {};

  const browser = await puppeteer.launch();

  /*
  const page = await browser.newPage();
//   await page.goto("https://leetcode.com/problems/two-sum/");
  await page.goto("https://leetcode.com/problems/minimum-operations-to-make-numbers-non-positive/");
  const scrapedData = await extractPTags(page);
  console.log(scrapedData);
  await page.close();
  */
  
 
  for (const link of links) {
    console.log("Entered for loop");
    if (link.trim() !== '') {
      const page = await browser.newPage();
    /*
      // Navigate to the current link
      await page.goto("https://leetcode.com"+link);
      console.log("navigating to : " + "https://leetcode.com"+link );

      // Scraping the desired data using page.$eval() or page.$$eval()
//     //   const scrapedData = await page.$eval('selector', (element) => {
//     //     // Extract and return the desired data
//     //     return element.textContent.trim();
//     //   });
    // console.log(await extractPTags(page));
      const scrapedData = await extractPTags(page);

      // Store the scraped data in the object
      dataMapping[link] = scrapedData;

      // Close the page after scraping
      await page.close();
      */

      try {
        await page.goto("https://leetcode.com" + link, { timeout: 60000 });
        console.log("navigating to : " + "https://leetcode.com"+link );
        const scrapedData = await extractPTags(page);
        dataMapping[link] = scrapedData;

        await page.close();
      } catch (error) {
        console.error(`Error navigating to ${link}:`, error);
        await page.close();
      }

    }
    // break;
  }

  // Close the browser after scraping all links
  await browser.close();

  // Print the data mapping
  console.log(dataMapping);

  return dataMapping;
}

// data =  scrapeData();
// const jsonString = JSON.stringify(data);
// fs.writeFileSync('data.json', jsonString, 'utf8');

(async () => {
    const data = await scrapeData();
    const jsonString = JSON.stringify(data);
    fs.writeFileSync('data.json', jsonString, 'utf8');
    console.log('Data saved successfully.');
  })();