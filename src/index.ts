import cheerio from 'cheerio';
import axios from 'axios';


const exampleAddresses = [
    '3950 CALLAHAN DR, Memphis, TN 38127',
    '17421 Deforest Ave, Cleveland, OH 44128',
    '1226 DIVISION AVENUE, San Antonio, TX 78225'
];

(async () => {

    for (let i = 0; i < exampleAddresses.length; i++) {
        const path = await getPath(exampleAddresses[i]);

        console.log('path', path);

        const price = await getPrice(path);

        console.log('price', price);

        await timeout(2000);
    }
})();

async function getPath(address: string) {
    // Location and v are required query parameters
    const url = `https://www.redfin.com/stingray/do/location-autocomplete?location=${address}&v=2`;

    const axiosResponse = await axios.get(url);

    const parsedData = JSON.parse(axiosResponse.data?.replace('{}&&', ''));

    return parsedData.payload.exactMatch.url;
}

async function getPrice(path: string) {
    const url = `https://redfin.com${path}`;

    const axiosResponse = await axios.get(url);

    const $ = cheerio.load(axiosResponse.data);

    let price = $('[data-rf-test-id="avm-price"] .statsValue').text();

    if (!price) {
        price = $('[data-rf-test-id="avmLdpPrice"] .value').text();
    }

    return price;
}

function timeout(ms: number) {
	return new Promise(res => setTimeout(res, ms));
}