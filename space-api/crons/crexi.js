const puppeteer = require('puppeteer');
const { MongoClient } = require("mongodb");
// Replace the placeholders with your credentials and hostname

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient('mongodb://root:root@localhost:27017/');

const spaceLinks = [];

(async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	const ua =
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
	await page.setUserAgent(ua);
	await page.goto('https://www.crexi.com/lease/properties?types%5B%5D=Retail&types%5B%5D=Industrial&types%5B%5D=Restaurant&subtypes%5B%5D=Flex', {
		waitUntil: 'load',
		timeout: 0
	});
	let index = 0;
	await getLinks(page, index);
	console.log(spaceLinks);
	console.log(spaceLinks.length);
	await client.connect();
	const db = client.db('spaceLocator');
	for (const space of spaceLinks) {
		const findSpace = await db.collection('properties').findOne({ link: space.link, website: "crexi" });
		if (!findSpace) {
			const addedSpace = await db.collection('properties').insertOne(space);
			console.log('Inserted document =>', addedSpace);
		} else {
			console.log("not found")
		}
	}
	await client.close();
	await browser.close()
})();

async function getLinks(page, index) {
	if(index < 2){
		await page.waitForSelector("crx-property-tile-aggregate");
		await page.waitForSelector(".content");
		await page.screenshot({ path: index + '_cr.png' })
		const spaces = await page.$$("crx-property-tile-aggregate");
		for (const space of spaces) {
			let link = "Null"
			try {
				link = await page.evaluate(
					(el) => el.querySelector("crx-property-tile-new>div>div>a.cover-link").getAttribute('href'), space);
			} catch (error) {
				console.log(error)
			}
	
			if (link != 'Null') {
				spaceLinks.push({ link: "https://crexi.com" + link, scrap_done: false, website: "crexi" })
			}
		}
		const is_disabled = (await page.$("#pagination-container > div > ul > li.next.ng-star-inserted > a") != null)
		console.log(is_disabled);
		if (is_disabled) {
			await page.click("#pagination-container > div > ul > li.next.ng-star-inserted > a")
			await delay(1500);
			index++
			await getLinks(page, index)
		}
	}
}

async function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time)
	});
}