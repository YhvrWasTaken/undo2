"use strict";

const { asyncMap, asyncForEach } = require("./asyncArray.js");
const asyncMap2 = require("./asyncArray.js").asyncMap;
const Embed = require("./embed.js");
const purify = require("./purify.js");
const mods = require("./intercomMods.js");
const rules = `**Intercom is a privilege, not a right.**
1. No NSFW, NSFL, Borderline Sexual, Racist, etc.
2. No advertising. Intercom join exists for a reason!
3. No spam. "Spam" includes: Messages that are only emotes, 1 letter messages, and empty messages.`;

const bulkSend = async (msg, keyv, client) => {
	if (msg.content.length < 2 && !msg.attachments.first()) {
		if (msg.content !== "")
			msg.reply(
				`Please send actual messages in intercom, not just stuff like "k".`
			);
		return;
	}
	if (
		msg.content.includes("discord.gg") ||
		msg.content.includes("discordapp.com/invite")
	) {
		msg.reply("Don't post invite links in intercom!");
		return;
	}
	const banned =
		(await keyv.get(`intercom.banned.${msg.author.id}`)) || false;
	const sent = (await keyv.get(`intercom.sent.${msg.author.id}`)) || false;
	if (banned) return;
	if (sent === false) {
		const dm = await msg.author.createDM();
		dm.send(`Welcome to Intercom!
Intercom is a feature of mine that allows you to send messages between servers.

To start, just send a message in your servers intercom channel! It seems you already found this, though.
You can send text and images, but not files or videos.

While you're here, why don't you check out **the rules**?
${rules}`);
		await keyv.set(`intercom.sent.${msg.author.id}`, true);
	}
	let guilds = (await keyv.get(`intercom`)) || "";
	guilds = guilds.split(",");
	const channels = await asyncMap(
		guilds,
		async g => (await keyv.get(`${g}.intercom.channel`)) || false
	);
	const styles = await asyncMap2(
		guilds,
		async g => (await keyv.get(`${g}.intercom.style`)) || "embed"
	);
	const join = (await keyv.get(`${msg.guild.id}.intercom.join`)) || false;
	const text = purify(msg.content);
	let send = true;
	if (text === "[REDACTED]") {
		msg.reply("Don't say that! Your message was not sent.");
		send = false;
	}
	const author = purify(
		mods.includes(msg.author.id)
			? `${msg.author.tag} (Mod)`
			: msg.author.tag
	);
	const from = purify(msg.guild.name);
	let color =
		(await keyv.get(`${msg.guild.id}.intercom.color`)) || "114,137,218";
	color = color.split(",").map(n => Number(n));
	let embed = new Embed(`Intercom - ${from}`, text, color)
		.setAuthor(author, msg.author.displayAvatarURL())
		.setFooter(
			`UID - ${msg.author.id} | GID - ${msg.guild.id}${
				join ? " (!)" : ""
			}`
		);
	const simple = `📞 **${author} >>** ${text}`;
	const complex = `📞 **${author}**
${text}
Sent from **${from}** (ID ${msg.guild.id})`;
	if (msg.attachments.first())
		embed = embed.setImage(msg.attachments.first().url);
	let msgs = [];
	await asyncForEach(channels, async (c, i) => {
		if ([msg.channel.id, undefined, null, false, "no"].includes(c)) return;
		const channel = client.channels.cache.get(c);
		if (channel === undefined || send === false) return;
		let toSend;
		switch (styles[i]) {
			case "simple":
				toSend = simple;
				break;
			case "complex":
				toSend = complex;
				break;
			default:
				toSend = embed;
				break;
		}
		let out;
		try {
			if (toSend === embed) {
				out = await channel.send(toSend);
			} else {
				out = await channel.send(toSend, { disableMentions: "all" });
			}
		} catch (e) {
			client.channels.cache
				.get(process.env.CONSOLE_CHANNEL)
				.send(`Should probably remove intercom channel ${c}`);
		}
		msgs.push(out);
	});
	msgs = msgs.map(n => `${n.id}|${n.channel.id}`).join(",");
	// Mod channel
	let modEmbed = new Embed(
		`Intercom - ${msg.author.id} - ${msg.guild.id}`,
		msg.content
	).setFooter(`${msg.author.tag} - ${msg.guild.name}`);
	if (msg.attachments.first())
		modEmbed = modEmbed.setImage(msg.attachments.first().url);
	const modMsg = await client.channels.cache
		.get(process.env.MOD_INTERCOM)
		.send(modEmbed);
	await keyv.set(`intercom.delete.${modMsg.id}`, msgs, 1000 * 60 * 60 * 12);
};

module.exports = bulkSend;
