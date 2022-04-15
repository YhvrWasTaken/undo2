"use strict";

const suggest = async(msg, args, client) => {
	const { keyv } = client;
	const banned = await keyv.get(`intercom.banned.${msg.author.id}`) || false;
	if (banned) {
		msg.channel.send("You can't give feedback while banned from intercom!");
	} else {
		client.channels.cache.get(process.env.CONSOLE_CHANNEL)
			.send(`<@!255757013122809856> Suggestion from <@!${msg.author.id}>: ${args}`);
		msg.channel.send("Your suggestion has been logged!");
	}
};

module.exports = {
	execute: suggest,
	args: ["suggestion"],
	description: "Suggest a feature for undo2. You can't if you're banned from intercom, and you can't upload images."
};