"use strict";

const Embed = require("./../../helper/embed.js");

const invite = msg => {
	msg.channel.send(new Embed(
		"undo2 Invite Link",
		"https://discordapp.com/oauth2/authorize?client_id=695747561193078785&scope=bot&permissions=268463174"
	));
};

module.exports = {
	execute: invite,
	args: [],
	description: "Get a link to invite undo2 to your server!"
};