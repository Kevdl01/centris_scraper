const pup = require('puppeteer');
const $ = require('cheerio')
const fs = require('fs-extra')
const detailinfo = require('./hinfo1')

//create a function and then launch a browser when pup connects to a chromium instance via pup.launch
async function getlinks (){
    const browser = await pup.launch({headless:true, slowMo: 100, devtools: true})
    const page = await browser.newPage();
    await page.goto('https://www.centris.ca/en/houses~for-sale~montreal-island?view=Thumbnail');
    await page.waitForSelector('li.next > a');
    const pg = await page.content()

//gets the number of pages of results
    const str = $('li.pager-current', pg).text()
    const pages = parseInt(str.substring(
        str.lastIndexOf("/")+1, 
        str.lastIndexOf(" ")
    ));

//for each page, get links and click on next and get links  
    var prop = [] //pages
    for (let k =0; k<=0; k++){
        const render = await page.content()
        const links = $('div.description > a.a-more-detail', render) 
        for (i=0; i<links.length; i++){
            const link = $(links[i]).attr('href')
            prop.push(link)
        }
        await page.click('li.next')
        await page.waitForSelector('div.location-container');
    }
    await browser.close();
    console.log(prop.length)
    // console.log(prop)
    return (prop)
}

// call the function and pass each link to the detailinfo module which opens the link gets the listings into json and writes into a csv file

getlinks().then(prop => test(prop))

function test (prop)
{  
    for (p of prop){
        try {
        detailinfo('https://www.centris.ca' + p)
        }
        catch (err)
        {console.log(err)
        }
    } 
    console.log('done')
}  
   

