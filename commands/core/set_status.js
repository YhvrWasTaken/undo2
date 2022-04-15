"use strict";

/* eslint-disable no-unused-vars */
const setStatus = async(msg, args, client) => {
/* eslint-enable no-unused-vars */
	if (msg.author.id !== "255757013122809856") return;
	await client.keyv.set(`bio`, args);
	client.user.setActivity(args, { type: "WATCHING" });
};

module.exports = {
	execute: setStatus,
	args: ["status"],
	description: "Set the bot's status. You can only use this if you are me."
};