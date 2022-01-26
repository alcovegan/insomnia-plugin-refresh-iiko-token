const https = require("https");
const path = require("path");
const url = require("url");
const axios = require("axios");
const fs = require("fs");

module.exports.requestHooks = [
	async context => {
		const request = context.request;

		let [
			login,
			secret
		] = [
			request.getEnvironmentVariable("IIKO_LOGIN"),
			request.getEnvironmentVariable("IIKO_SECRET")
		];

		const requestOptions = {
			hostname: "card.iiko.co.uk",
			pathname: "/api/0/auth/access_token",
			protocol: "https",
			query: {
				user_id: login,
				user_secret: secret
			}
		}

		const requestURL = url.parse(url.format(requestOptions));

		const isUseIikoPlugin = request.getEnvironmentVariable("USE_IIKO_PLUGIN");
		const isAccessTokenRequest = request.getUrl().indexOf("/auth/access_token") !== -1;

		// token expires in 15 minutes,
		const TOKEN_EXPIRY_TIME = 15 * 60 * 1000;

		if(isUseIikoPlugin) {
			try {
				const { token, lastUpdated } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json")));
				const TIME_NOW = Date.now();
				const isTokenExpired = (TIME_NOW - lastUpdated) > TOKEN_EXPIRY_TIME;

				if(!isTokenExpired) {
					console.log("token is NOT expired, so using existing");

					setAccessTokenParam(request, token);
				} else {
					console.log("token IS expired, so getting new and using it");

					let tokenData = await getToken(requestURL.href);
					writeLastRequestDate("token.json", tokenData);
					setAccessTokenParam(request, tokenData.data);
				}

			} catch (err) {
				console.log("last request data file: read error (deleted or non-existing), so getting new token and using it", err);

				let tokenData = await getToken(requestURL.href);
				writeLastRequestDate("token.json", tokenData);
				setAccessTokenParam(request, tokenData.data);
			}
		}

		async function getToken(requestURL) {
			return await axios.get(requestURL)
		}

		function writeLastRequestDate(filename, response) {
			fs.writeFileSync(path.resolve(__dirname, filename), JSON.stringify({
				"token": response.data,
				"lastUpdated": Date.now()
			}));
		}

		function setAccessTokenParam(contextRequest, token) {
			contextRequest.setParameter("access_token", token);
		}
	}
]