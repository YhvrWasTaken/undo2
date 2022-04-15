"use strict";

const Embed = require("./../../helper/embed.js");

const reactHandler = (reacts, msg2, index) => {
	if (reacts[index]) msg2.react(reacts[index]);
};

const cpoll = (msg, args) => {
	let question = args.split(/(?<!\\), /gmu);
	let reacts = question[1] ? question[1] : "👍 👎";
	question = question[0];
	// Reacts prep
	reacts = reacts.split(" ");
	msg.channel.send(new Embed(
	`Poll: ${question}`.length <= 256
	? `Poll: ${question}` : `Poll`,

	`Simply react to the message to vote!`
	)).then(msg2 => {
		msg2.react(reacts[0])
		.then(() => reactHandler(reacts, msg2, 1))
		.then(() => reactHandler(reacts, msg2, 2))
		.then(() => reactHandler(reacts, msg2, 3))
		.then(() => reactHandler(reacts, msg2, 4))
		.then(() => reactHandler(reacts, msg2, 5))
		.then(() => reactHandler(reacts, msg2, 6))
		.then(() => reactHandler(reacts, msg2, 7))
		.catch(() => msg.channel.send("Pssst- Either I don't have react perms, or you used an emote I don't have access to!"));
	});
};

module.exports = {
	execute: cpoll,
	args: ["sub", "emote1", "emote2", "..."],
	description: "Make a poll with custom reactions. A complete command" +
	" looks like this: `^cpoll Which is better?, :eggplant: :cucumber:`"
};