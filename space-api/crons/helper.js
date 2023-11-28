const fs = require('fs');
const https = require('https');
exports.downloadImages = (images, website) => {
	const newImagePath = [];
	images.forEach((url, index) => {
		let ext = url.name.split(".");
		let path = `files/scrapImages/${website}/${index}-${Date.now()}.${ext[(ext.length - 1)]}`;
		newImagePath.push({ image: `/${path}` });
		https.get(url.name, res => {
			const dir = 'files/scrapImages/' + website;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			const stream = fs.createWriteStream(`./${path}`);
			res.pipe(stream);
			stream.on('finish', () => {
				stream.close();
			})
		})
	});
	return newImagePath;
}