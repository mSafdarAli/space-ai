const puppeteer = require('puppeteer');
const { MongoClient, ObjectId } = require("mongodb");
const helper = require('./helper')

const client = new MongoClient('mongodb://root:root@localhost:27017/');

let description = '';
let imgs = [];
let spacesDetail= {};

(async () => {
	await client.connect();
	const db = client.db('spaceLocator');
	const spaces = await db.collection('properties').find({ scrap_done: false, website: "crexi" }).project({ link: 1 }).limit(1).toArray();
	await client.close();

	spaces.forEach(async el => {
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
		await page.waitForSelector(".has-nav-toolbar.ng-star-inserted")
		await page.screenshot({ path: "crexiDetail.png" })
		const title = await page.evaluate(() => {
			return document.querySelector('crx-lease-pdp-media-header > div > h1').textContent.trim();
		})
		const address = await page.evaluate(() => {
			return document.querySelector('crx-pdp-addresses > div > div > div > h2').textContent.trim();
		})


		const overview = await page.evaluate(() => {
			const des = Array.from(document.querySelectorAll("div#buildingHighlightsCollapsable > ul > li")).map(el => el.textContent.trim());
			return des
		})
		overview.forEach(el => {
			description += el + ' ';
		})

		const buildingDescription = await page.evaluate(() => {
			return document.querySelector('#descriptionCollapsable > p').textContent.trim();
		})

		const spaceDetails = await page.evaluate(() => {
			const detail = Array.from(document.querySelectorAll(".property-details-item ")).map(el => {
				return {
					name: el.querySelector('.detail-name').textContent.trim(),
					value: el.querySelector('.detail-value').textContent.trim()
				}
			});
			return detail
		})
		const isExist = (await page.$("#mat-tab-label-2-1") != null)
		if (isExist) {
			await page.click("#mat-tab-label-2-1");
			await page.click(".pdp_suites_table-header_expander");
			const header = await page.evaluate(() => {
				return {
					"header_name": document.querySelector('.pdp_suites_table-header .pdp_suites_table-header_name').textContent.trim(),
					"header_use": document.querySelector('.pdp_suites_table-header .pdp_suites_table-header_use').textContent.trim(),
					"header_size": document.querySelector('.pdp_suites_table-header .pdp_suites_table-header_size').textContent.trim(),
					"header_rate": document.querySelector('.pdp_suites_table-header .pdp_suites_table-header_rate').textContent.trim(),
				}
			})
			const availableSpaces = await page.evaluate(() => {
				const availableSpace = Array.from(document.querySelectorAll("crx-suite-details")).map(el => {
					return {
						item_name: el.querySelector('.pdp_suites_table-item_name')?.textContent.trim(),
						item_use: el.querySelector('.pdp_suites_table-item_use')?.textContent.trim(),
						item_size: el.querySelector('.pdp_suites_table-item_size')?.textContent.trim(),
						item_rate: el.querySelector('.pdp_suites_table-item_rate')?.textContent.trim(),
						item_detail: Array.from(document.querySelectorAll(".pdp_suites_table-item_details_info")).map(ele => {
							return {
								name: ele.querySelector('.pdp_suites_table-item_details_info_name')?.textContent.trim(),
								value: ele.querySelector('.pdp_suites_table-item_details_info_value')?.textContent.trim(),
							}
						})

					}
				});
				return availableSpace
			})
			spacesDetail['header'] = header;
			spacesDetail['details'] = availableSpaces;
		}
		await page.click(".gallery-container .ui-carousel")
		const images = await page.evaluate(() => {
			const image = Array.from(document.querySelectorAll(".dots img")).map(el => el.getAttribute("src"));
			return image
		})
		images.forEach(el => {
			const img = el.split('_');
			imgs.push({ name: img[0] + '.' + img[1].split('.')[1] })
		})
		const newImagePath = helper.downloadImages(imgs, 'crexi')
	
		const details = {
			title: title,
			address: address,
		  overview: description,
			buildingDescription: buildingDescription,
			spaceDetails: spaceDetails,
			availableSpaces: spacesDetail,
			images: newImagePath,
		}

		await client.connect();
		const db = client.db('spaceLocator');
		const updated = await db.collection('properties').updateOne({ _id: el._id }, { $set: { scrap_done: true, details } })
		console.log('updated documents =>', updated);
		await client.close();

		await browser.close();
	})

})();
