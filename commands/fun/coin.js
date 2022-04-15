"use strict";

const Embed = require("./../../helper/embed.js");

// Nothin' like a good one-liner, amirite?
const coin = msg =>
	msg.channel.send(new Embed("Coin flip", `The coin landed ${Math.round(Math.random()) ? "Heads!" : "Tails!"}`));

module.exports = {
	execute: coin,
	args: [],
	description: "Flip a coin!"
};