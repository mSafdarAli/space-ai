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
	await page.goto('https://newyork.craigslist.org/search/off?maxSqft=4000#search=1~gallery~0~0', {
		waitUntil: 'load',
		timeout: 0
	});
	let index = 0;
	while (index < 1) {
		await page.waitForSelector(".cl-search-result.cl-search-view-mode-gallery");
		await page.screenshot({ path: index + '.png' })
		const spaces = await page.$$(".cl-search-result.cl-search-view-mode-gallery");
		for (const space of spaces) {
			let link = "Null";
			let excerpt = ""
			try {
				link = await page.evaluate(
					(el) => el.querySelector(".gallery-card a").getAttribute('href'), space);
			} catch (error) {
				console.log(error)
			}
			try {
				excerpt = await page.evaluate(
					(el) => el.querySelector(".gallery-card a.titlestring").innerText, space);
			} catch (error) {
				console.log(error)
			}
			if (link != 'Null') {
				spaceLinks.push({ link, excerpt, scrap_done: false, website: "craigslist" })
			}
		}
		await page.waitForSelector('#search-toolbars-2 div.cl-search-paginator > button.bd-button.cl-next-page.icon-only', { visible: true })
		const is_disabled = (await page.$("#search-toolbars-2 > div.cl-search-paginator > button.bd-button.cl-next-page.icon-only.bd-disabled") != null)
		if (!is_disabled) {
			await page.click("#search-toolbars-2 div.cl-search-paginator > button.bd-button.cl-next-page.icon-only")
			//await page.waitForNavigation({ waitUntil: 'networkidle2' })
		}
		index++
	}
	await browser.close()
	console.log(spaceLinks.length);

	console.time('Execution Time');
	await client.connect();
	const db = client.db('spaceLocator');
	const addedSpaces = await db.collection('properties').insertMany(spaceLinks);
	console.log('Inserted document =>', addedSpaces);
	await client.close();
	console.timeEnd('Execution Time');
})();