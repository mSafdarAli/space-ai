const puppeteer = require('puppeteer');
const { MongoClient, ObjectId } = require("mongodb");
const helper = require('./helper')
const ne = require('node-each');
// const client = new MongoClient('mongodb://admin:test123@localhost:27017/');
const client = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false');


(async () => {

	await client.connect();
	const db = client.db('spaceLocator');
	const spaces = await db.collection('properties').find({ scrap_done: false, website: "loopnet" }).project({ link: 1 }).limit(5).toArray();
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
		await page.screenshot({ path: "detail.png" })
		const title = await page.evaluate(() => {
			return document.querySelector('.profile-hero__segment')?.textContent.trim()
		})
		const address = await page.evaluate(() => {
			return document.querySelector('.profile-hero-sub-title')?.textContent.trim()
		})
		const images = await page.evaluate(() => {
			const image = Array.from(document.querySelectorAll(".mosaic-tile.photo-landscape")).map(el => {
				return {
					name: el.getAttribute("data-src")
				}
			})
			return image
		})
		// const images = await page.$$eval('.mosaic-tile.photo-landscape', images => images.map(img => {
		// 	return {
		// 		name: img.getAttribute('data-src'),
		// 	}
		// }))
		const newImagePath = helper.downloadImages(images, 'loopnet')
		const overview = await page.evaluate(() => {
			return document.querySelector('.pre-wrap')?.textContent.trim()
		})
		const spaceDetails = await page.evaluate(() => {
			const fact = Array.from(document.querySelectorAll(".property-fact-value-container")).map(el => {
				return {
					name: el.querySelector('.fact-name')?.textContent.trim(),
					value: el.querySelector('.property-facts__data-item-text ')?.textContent.trim()
				}
			});
			return fact
		})
		const availableSpaces = await page.evaluate(() => {
			const availableSpace = Array.from(document.querySelectorAll(".available-spaces__accordion.no-init-expand")).map(el => {
				return {
					space: el.querySelector('ul > li.available-spaces__data-item.available-spaces__one > span > span')?.textContent.trim(),
					size: el.querySelector('ul > li.available-spaces__data-item.available-spaces__two > span > span')?.textContent.trim(),
					term: el.querySelector('ul > li.available-spaces__data-item.available-spaces__three > span > span')?.textContent.trim(),
					rental_rate: el.querySelector('ul > li.available-spaces__data-item.available-spaces__four > span > span')?.textContent.trim(),
					space_use: el.querySelector('ul > li.available-spaces__data-item.available-spaces__five > span > span')?.textContent.trim(),
					condition: el.querySelector('ul > li.available-spaces__data-item.available-spaces__six > span > span')?.textContent.trim(),
					available: el.querySelector('ul > li.available-spaces__data-item.available-spaces__seven > span > span')?.textContent.trim(),
				}
			});
			return availableSpace
		})
		const transportation = await page.evaluate(() => {
			const tableDetails = [];
			const transport = Array.from(document.querySelectorAll(".highlights.include-in-page.public-transportation.transit"));
			transport.forEach(el => {
				const content = []
				const title = el.querySelector('table>thead>tr>th:nth-child(1)>h3')?.textContent.trim();
				const trs = Array.from(el.querySelectorAll("tbody>tr"));
				for (const tr of trs) {
					const tds = Array.from(tr.querySelectorAll("td"));
					const data = tds.map((td) => td.innerText);
					if (tds.length > 0) {
						content.push({
							title: data[0].trim(),
							time: data[1].trim(),
							distance: data[2].trim(),
						});
					}
				}
				tableDetails.push({
					title: title,
					content: content
				})
			});
			return tableDetails
		})
		const amenities = await page.evaluate(() => {
			const tableDetails = [];
			const amenity = Array.from(document.querySelectorAll(".highlights.include-in-page.poi.poi--restaurants"));
			amenity.forEach(el => {
				const content = []
				const title = el.querySelector('table>thead>tr>th:nth-child(1)>h3')?.textContent.trim();
				const trs = Array.from(el.querySelectorAll("tbody>tr"));
				for (const tr of trs) {
					const tds = Array.from(tr.querySelectorAll("td"));
					const data = tds.map((td) => td.innerText);
					if (tds.length > 0) {
						content.push({
							name: data[0].trim(),
							cusine: data[1].trim(),
							expensive: data[2].trim(),
							time: data[3].trim(),
						});
					}
				}
				tableDetails.push({
					title: title,
					content: content
				})
			});
			return tableDetails
		})
		const retails = await page.evaluate(() => {
			const tableDetails = [];
			const retail = Array.from(document.querySelectorAll(".highlights.include-in-page.poi.poi--retail"));
			retail.forEach(el => {
				const content = []
				const title = el.querySelector('table>thead>tr>th:nth-child(1)>h3')?.textContent.trim();
				const trs = Array.from(el.querySelectorAll("tbody>tr"));
				for (const tr of trs) {
					const tds = Array.from(tr.querySelectorAll("td"));
					const data = tds.map((td) => td.innerText);
					if (tds.length > 0) {
						content.push({
							name: data[0].trim(),
							type: data[1].trim(),
							time: data[2].trim(),
						});
					}
				}
				tableDetails.push({
					title: title,
					content: content
				})
			});
			return tableDetails
		})
		const teams = await page.evaluate(() => {
			const team = Array.from(document.querySelectorAll(".broker-bio")).map(el => {
				return {
					name: el.querySelector('span.header-text > span.broker-bio__text-block__header__line.broker-bio__text-block__header__name')?.textContent.trim(),
					designation: el.querySelector('span.header-text > span.broker-bio__text-block__header__line.broker-bio__text-block__header__title')?.textContent.trim(),
					contact: el.querySelector('.broker-phone')?.textContent.trim(),
					image: el.querySelector('.broker-bio__info.broker-bio__info--bio-available>a.avatar-container > div > picture > img')?.getAttribute('src'),
				}
			});
			return team
		})
		const details = {
			title: title,
			address: address,
			images: newImagePath,
			overview: overview,
			spaceDetails: spaceDetails,
			availableSpaces: availableSpaces,
			transportation: transportation,
			amenities: amenities,
			retails: retails,
			team: teams

		}
		await client.connect();
		const db = client.db('spaceLocator');
		const updated = await db.collection('properties').updateOne({ _id: el._id }, { $set: { scrap_done: true, details } })
		console.log('updated documents =>', updated);
		await client.close();


		await browser.close();
	})

})();