const puppeteer = require('puppeteer');
const { MongoClient, ObjectId } = require("mongodb");
const helper = require('./helper')
const ne = require('node-each');
// const client = new MongoClient('mongodb://admin:test123@localhost:27017/');
const client = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false');

(async () => {

	await client.connect();
	const db = client.db('spaceLocator');
	const spaces = await db.collection('properties').find({ scrap_done: false, website: "craigslist" }).project({ link: 1 }).limit(10).toArray();
	await client.close();
	// console.log(spaces)
	await ne.each(spaces, async (el, i) => {
		let browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		const ua =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
		await page.setUserAgent(ua);
		console.log(el);
		await page.goto(el.link, {
			waitUntil: 'load',
			// Remove the timeout
			timeout: 0
		});
		// await page.screenshot({ path: "detail.png" })
		const title = await page.evaluate(() => {
			return document.querySelector('.postingtitletext #titletextonly')?.textContent.trim()
		})
		const price = await page.evaluate(() => {
			return document.querySelector('.postingtitletext .price')?.textContent.trim()
		})
		const images = await page.evaluate(() => {
			const image = Array.from(document.querySelectorAll("#thumbs a")).map(el => {
				return {
					name: el.getAttribute("href"),
				}
			})
			return image
		})
		const newImagePath = helper.downloadImages(images, 'craigslist')
		console.log("newPath", newImagePath)
		const overview = await page.evaluate(() => {
			return document.querySelector('#postingbody')?.textContent.trim()
		})

		const details = {
			title: title,
			price: price,
			images: newImagePath,
			overview: overview,

		}
		await client.connect();
		const db = client.db('spaceLocator');
		const updated = await db.collection('properties').updateOne({ _id: el._id }, { $set: { scrap_done: true, details } })
		console.log('updated documents =>', updated);
		await client.close();


		await browser.close();
	})

})();