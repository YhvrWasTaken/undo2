"use strict";

const Embed = require("./../../helper/embed.js");

const prefix = async(msg, args, client) => {
	const { keyv } = client;
	if (!msg.member.hasPermission("ADMINISTRATOR")) {
		msg.channel.send(new Embed("Error", "Missing the permission `ADMINISTRATOR`.", 0xbc4949));
		return;
	}

	const pre = args;
	if (pre.includes("@")) {
		msg.channel.send(new Embed("Error", "The prefix can't include the character `@`.", 0xbc4949));
		return;
	}

	if (!pre) {
		msg.channel.send(new Embed("Error", "Did you specify a prefix?", 0xbc4949));
		return;
	}

	await keyv.set(`${msg.guild.id}.prefix`, pre);

	msg.channel.send(new Embed("Success", `Set the prefix to \`${pre}\`.`, 0x5da271));
};

module.exports = {
	execute: prefix,
	args: ["\"prefix\""],
	description: "Set the bot's prefix to `<prefix>`. It can't include `@`."
};