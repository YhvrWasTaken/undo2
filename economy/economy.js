"use strict";

const Embed = require("./../../helper/embed.js");
const constants = {
	MILLISECOND: 1,
	SECOND: 1000,
	MINUTE: 60 * 1000,
	HOUR: (60 ** 2) * 1000,
	DAY: 24 * (60 ** 2) * 1000
}
const err = "Economy - Error";
const succ = "Economy";
const ach = "Achievement Get!";

const economy = async(msg, input, client) => {
	const { keyv } = client;
	const args = input.split(" ");
	switch (args[0]) {
		case "farm": {
			let potatoes = await keyv.get(`eco.${msg.guild.id}.potatoes`) || 0;
			const nextFarm = await keyv.get(`eco.${msg.guild.id}.nextFarm`) || 0;
			const farmed = await keyv.get(`eco.${msg.guild.id}.ach.farmed`) || false;
			if (nextFarm > Date.now()) {
				msg.channel.send(
					new Embed(err,
					`Please wait **${Math.floor((nextFarm - Date.now()) / 1000)} seconds** before farming again!`)
				);
			} else {
				// 1 to 5
				const gain = Math.ceil(Math.random() * 5);
				let out = new Embed(succ,
				`You farmed and got **${gain}** potato${gain > 1 ? "es" : ""}. Please wait 60 seconds before farming again.`);
				potatoes += gain;
				if (farmed === false) {
					await keyv.set(`eco.${msg.guild.id}.ach.farmed`, true);
					out = out.addField(ach, "You just got the achievement **First Blood**!", true);
				}
				if (gain === 5) {
					const lucky = await keyv.get(`eco.${msg.guild.id}.ach.lucky`) || false;
					if (lucky === false) {
						await keyv.set(`eco.${msg.guild.id}.ach.lucky`, true);
						out = out.addField(ach, "You just got the achievement **Lucky**!", true);
					}
				}
				await keyv.set(`eco.${msg.guild.id}.potatoes`, potatoes);
				await keyv.set(`eco.${msg.guild.id}.nextFarm`, Date.now() + constants.MINUTE);
				msg.channel.send(out);
			}
			break;
		}
		case "list": {
			const potatoes = await keyv.get(`eco.${msg.guild.id}.potatoes`) || 0;
			msg.reply(`This server has ${potatoes} potato${potatoes === 1 ? "" : "es"}.`);
			break;
		}
		case "simp": {
			let potatoes = await keyv.get(`eco.${msg.guild.id}.potatoes`) || 0;
			const nextSimp = await keyv.get(`eco.${msg.guild.id}.nextSimp`) || 0;
			const simped = await keyv.get(`eco.${msg.guild.id}.ach.simped`) || false;
			if (nextSimp > Date.now()) {
				msg.channel.send(
					new Embed(err,
					`Please wait **${Math.floor((nextSimp - Date.now()) / 1000)} seconds** before simping again!`)
				);
			} else {
				let out = new Embed(succ,
				`You simped **5** potatoes. Please wait 5 minutes before simping again.`);
				potatoes += 5;
				if (simped === false) {
					await keyv.set(`eco.${msg.guild.id}.ach.simped`, true);
					out = out.addField(ach, "You just got the achievement **New Low**!", true);
				}
				await keyv.set(`eco.${msg.guild.id}.potatoes`, potatoes);
				await keyv.set(`eco.${msg.guild.id}.nextSimp`, Date.now() + (constants.MINUTE * 5));
				msg.channel.send(out);
			}
			break;
		}
		default:
			break;
	}
};

module.exports = {
	execute: economy,
	description: "TODO",
	args: ["command", "args"]
};