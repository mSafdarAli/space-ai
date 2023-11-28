const config = {
	secret: "some-secret-shit-goes-here",
	refreshTokenSecret: "some-secret-refresh-token-shit",
	port: 3000,
	host: "0.0.0.0",
	allowedDomains: ["http://localhost:4200"],
	tokenLife: 9999999,
	refreshTokenLife: 9999999,
	sendEmails: true,
	db: {
		username: "root",
		password: "root",
		host: "localhost",
		database: "spaceLocator"
	},
	pagination: {
		"page_size": 25,
		"offset": 0,
		"maxLimit": 10000
	},
	uploads: {
		path: "/files/",
	},
	commonRules: {
		email: 'required|email|max:150',
		name: 'required|max:200',
		url: ['required', 'regex:/^(www\\.)[a-z0-9-]+\\.[a-z]{2,}(\\.[a-z]{2,3})?/'],
		address: 'required|max:250',
		dob: 'date',
		date: 'required|date',
		gender: 'required|max:60',
		phone: 'required|max:18',
		password: ['required', 'min:8', 'max:24', 'regex:/^(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s)/'],
		username: ['required', 'min:4', 'max:24', 'regex:/^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.].*$/'],
	},
	syncDb: false,
};
export default config;