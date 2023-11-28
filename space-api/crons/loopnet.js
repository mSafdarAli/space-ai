const puppeteer = require('puppeteer');
const { MongoClient } = require("mongodb");

// const client = new MongoClient('mongodb://admin:test123@localhost:27017/');
const client = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false');


const spaceLinks = [];

(async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	const ua =
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
	await page.setUserAgent(ua);
	await page.goto('https://www.loopnet.com/search/commercial-real-estate/usa/for-lease/?sk=8d9cedd4ed7b7b24b2db10f8ccd8b996', {
		waitUntil: 'load',
		timeout: 0
	});
	let index = 0;
	while (index < 2) {
		await page.waitForSelector(".placard.tier1");
		await page.screenshot({ path: index + '.png' })
		const spaces = await page.$$(".placard.tier1");
		for (const space of spaces) {
			let link = "Null";
			let excerpt = ""
			try {
				link = await page.evaluate(
					(el) => el.querySelector(".placard-pseudo a").getAttribute('href'), space);
			} catch (error) {
				console.log(error)
			}

			try {
				excerpt = await page.evaluate(
					(el) => el.querySelector(".placard-content > div.placard-info > div > ul.data-points-b > li").textContent.toString().trim(), space);
			} catch (error) {
				console.log(error)
			}

			if (link != 'Null') {
				spaceLinks.push({ link, excerpt, scrap_done: false, website: "loopnet" })
			}
		}
		await page.waitForSelector('li.beforeellipsisli.caret-right-large', { hidden: true })
		const is_disabled = (await page.$("li.beforeellipsisli.caret-right-large") != null)
		if (!is_disabled) {
			await page.click("#placardSec > div:nth-child(3) > div > ol > li:nth-child(10) > a")
			await page.waitForNavigation({ waitUntil: 'networkidle2' })
		}
		index++
	}
	console.log(spaceLinks.length);
	await client.connect();
	const db = client.db('spaceLocator');
	const addedSpaces = await db.collection('properties').insertMany(spaceLinks);
	console.log('Inserted document =>', addedSpaces); 
	await client.close();
	await browser.close()
})();