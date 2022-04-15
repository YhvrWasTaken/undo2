"use strict";

const https = require("https");

const Embed = require("./../../helper/embed.js");

/* eslint-disable no-unused-vars */
const covid = async(msg, args, client) => {
/* eslint-enable no-unused-vars */
	const { keyv } = client;
	const cache = await keyv.get("covid");
	if (cache) {
		const value = JSON.parse(cache);
			msg.channel.send(new Embed("COVID-19 Info", `Confirmed: **${value.confirmed.value.toLocaleString()}**
Recovered: **${value.recovered.value.toLocaleString()}**
Dead: **${value.deaths.value.toLocaleString()}**`));
		return;
	}
	const request = https.request({ host: "covid19.mathdro.id", path: "/api" }, res => {
		let value = "";
		res.on("data", chunk => {
			value += chunk;
		});
		res.on("end", async() => {
			// 10 Minutes
			await keyv.set("covid", value, 1000 * 60 * 10);
			value = JSON.parse(value);
			msg.channel.send(new Embed("COVID-19 Info", `Confirmed: **${value.confirmed.value.toLocaleString()}**
Recovered: **${value.recovered.value.toLocaleString()}**
Dead: **${value.deaths.value.toLocaleString()}**`));
			});
		});
		request.on("error", e => {
			msg.channel.send(
				new Embed("COVID-19: Error", `There was an error in the request to the API.`)
					.addField("Debug Info", `\`\`\`${e.message}\`\`\``)
			);
		});
		request.end();
};

module.exports = {
	execute: covid,
	args: [],
	description: "Get global info on COVID-19."
};