const ingredients = [];
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');  
var dict = {};
var codes = [];
var names = []; 

var cD = {};
    
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://www.epa.gov/saferchoice/safer-ingredients#searchList');

    const openListSelector = 'text/All Functional Use Classes'
    await page.click(openListSelector);

    const expandValues = 'div.dataTables_length > label > select'
    await page.select(expandValues, '-1');
  
    // Wait for the JavaScript on the page to finish executing
    await page.waitForSelector('.col-0');
  
    // Get the updated HTML
    const html = await page.content();
    const $ = cheerio.load(html);
    $('.col-0').each((index, element) => {
        if(index != 0) {
            var code = $(element).html();
            if(code.includes('#greencircle')) {
                code = 4;
            } else if (code.includes('#greenhalfcircle')) {
                code = 3;
            } else if (code.includes('#yellowtriangle')) {
                 code = 2;
            } else {
                code = 1;
            }
            codes.push(code);
        }

    });

    $('.col-1').each((index, element) => {
        if(index != 0) {
            names.push($(element).text());
        }
      });
    
    
    names.forEach((key, i) => {
        let s = "";
        var subReq;
        let lst = [];
        // whole string
        if (key.includes("*")) {
            key = key.substring(0, key.indexOf("*"));
        }
        key = key.trim().split(",");

        
        cD[key] = codes[i];
    });

    

    await browser.close();

    module.exports = {cD};

  })();


