"use strict";

const ping = msg => {
	msg.channel.send("Pong!");
};

module.exports = {
	execute: ping,
	args: [],
	description: "Make sure the bot's online."
};