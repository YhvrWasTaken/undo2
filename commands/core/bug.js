"use strict";

const bug = async(msg, args, client) => {
	const { keyv } = client;
	const banned = await keyv.get(`intercom.banned.${msg.author.id}`) || false;
	if (banned) {
		msg.channel.send("You can't give feedback while banned from intercom!");
	} else {
		client.channels.cache.get(process.env.CONSOLE_CHANNEL)
			.send(`<@!255757013122809856> Bug report from <@!${msg.author.id}>: ${args}`);
		msg.channel.send("Thanks for reporting!");
	}
};

module.exports = {
	execute: bug,
	args: ["bug"],
	description: "Report a bug in undo2. You can't report if you're banned from intercom, and you can't upload images."
};