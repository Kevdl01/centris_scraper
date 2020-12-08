const rp = require('request-promise')
const $ = require('cheerio')
const fs = require('fs-extra')
var json2csv = require('json2csv').parse;
//url = 'https://www.centris.ca/en/houses~for-sale~montreal-saint-laurent/24079715?view=Summary'
const hinfo1 = function(url) {

    rp(url).then(function(html) {
        const address = $('article#overview.content-views .address h2', html).html()
        const price = $('article#overview.content-views .price #BuyPrice', html).html()
        const rooms = $('article#overview.content-views .piece', html).html().trim()
        const bedrooms = $('article#overview.content-views .cac', html).html().trim()
        const bathrooms = $('article#overview.content-views .sdb', html).html().trim()
        let lotArea = $('article#overview .carac-container', html).next().next().html()
        lotArea = $(lotArea).children().html()
        let year = $('article#overview .carac-container', html).next().html()
        year = $(year).children().html()
        const lat = $('meta[itemprop="latitude"]', html).attr('content')
        const long = $('meta[itemprop="longitude"]', html).attr('content')
        const uuid = $('.sharethis', html).attr('data-mlsnumber')

        var data = [address, price, rooms, bedrooms, bathrooms, lotArea, year, lat, long, uuid]


        const json = {
            address: address,
            price: price,
            rooms: (rooms == null) ? 0 : rooms,
            bedrooms: (bedrooms === null) ? 0 : bedrooms,
            bathrooms: (bathrooms === null) ? 0 : bathrooms,
            lotArea: lotArea,
            year: year,
            location: {
                lat: lat,
                long: long
            }}

        
        try {
            const filename = 'listinginfo.csv'
            if (!fs.existsSync(filename)) {
                rows = json2csv(json, { header: true });
                fs.appendFileSync('listinginfo.csv', rows + '\n')
            } else {
                // Rows without headers if file exists.
                rows = json2csv(json, { header: false });
                fs.appendFileSync('listinginfo.csv', rows + '\n')
            }
            }
            catch (err)
            {console.log(err)} 
}
    )}
module.exports = hinfo1