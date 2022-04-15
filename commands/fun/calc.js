"use strict";

const Embed = require("./../../helper/embed.js");

// I think I remember seeing something about this being insecure, but IDR, lol
// TODO if you're selfhosting undo2, check this out!
const math = require("mathjs");

const calc = (msg, args) => {
	try {
		msg.channel.send(new Embed("Calc - Result", `\`${args}\` = \`${math.evaluate(args, {})}\``));
	} catch (e) {
		msg.channel.send(new Embed("Calc - Error", `There was an error in your expression.`, 0xbc4949)
			.addField("Debug Info", `\`\`\`${e}\`\`\``));
	}
};

module.exports = {
	execute: calc,
	args: ["equation"],
	description: "Calculate `<equation>`. You can do conversions, arithmetic, and more!"
};