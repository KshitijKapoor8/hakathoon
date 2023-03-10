const ingredients = [];
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');  
const fs = require('fs');
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
    
    
      names.forEach((name, index) => {
        
        name = name.trim();
        name = name.replace(",", "");

        if (name.includes("*")) {
            var x = name.indexOf('*');

            name = name.substring(0, x - 1);
        }
        console.log(name);

        
        cD[name] = codes[index];
      });

    

    await browser.close();
    // var ss = "";

    
    var Ll = JSON.stringify(cD);
    fs.writeFile('output.json', Ll, (err) => {});

    // fs.writeFile('output.csv', String(csv), (err) => {
    //     if (err) throw err;
    //     console.log('CSV file has been created!');
    // });

    module.exports = {cD};

  })();


