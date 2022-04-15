"use strict";

const https = require("https");

const Embed = require("./../../helper/embed.js");

const covidCountry = async(msg, args, client) => {
	const { keyv } = client;
	const cache = await keyv.get(`covid.${args.toLowerCase()}`);
	if (cache) {
		const value = JSON.parse(cache);
			msg.channel.send(
				new Embed(`COVID-19 Info for ${args}`,
				`Confirmed: **${value.confirmed.value.toLocaleString()}**
Recovered: **${value.recovered.value.toLocaleString()}**
Dead: **${value.deaths.value.toLocaleString()}**`));
		return;
	}

	const request = https.request({ host: "covid19.mathdro.id", path: `/api/countries/${args}` }, res => {
		let value = "";
		res.on("data", chunk => {
			value += chunk;
		});
		res.on("end", async() => {
			// 10 Minutes
			await keyv.set(`covid.${args.toLowerCase()}`, value, 1000 * 60 * 10);
			value = JSON.parse(value);
			if (value.error) {
				msg.reply("I don't think that's a country.");
				return;
			}
			msg.channel.send(new Embed(
				`COVID-19 Info for ${args}`,
				`Confirmed: **${value.confirmed.value.toLocaleString()}**
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
	execute: covidCountry,
	args: ["country"],
	description: "Get info about COVID-19 on `<country>`."
};