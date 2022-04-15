"use strict";

// This is by far the ugliest file in the bot.
// Not sure how, but it works.

/* eslint-disable no-redeclare */
const { PerformanceObserver, performance } = require("perf_hooks");
/* eslint-enable no-redeclare */
const util = require("util");

module.exports = async(msg, args, client) => {
	if (msg.author.id !== "255757013122809856") {
		msg.channel.send("https://tenor.com/view/not-my-dad-you-mydad-gif-5537054");
		return;
	}
	let x = args;
	let arg;
	if (/-d\d$/gmiu.test(x)) {
		arg = x[x.length - 1];
		x = x.slice(0, -3);
	}
	let promise = false, out, y, z;
	try {
		y = performance.now();
		/* eslint-disable no-eval */
		// Well, only I can use it!
		out = eval(x);
		/* eslint-enable no-eval */
		z = performance.now();
	} catch (e) {
		msg.channel.send(`There's an error in the code. ${e}`);
		return;
	}
	if (out instanceof Promise) {
		out = await out;
		promise = true;
	}
	let time = z - y;
	if (time < 1) time = `${(time * 1000).toFixed(2)} µs`;
	if (typeof time === "number") time = `${time.toFixed(2)} ms`;
	if (out === undefined) {
		msg.channel.send(`**Output**:\`\`\`js\nundefined\`\`\`\n:stopwatch: ${time}`);
		return;
	}
	msg.channel.send(`**Output**:\`\`\`js
${util.inspect(out, { depth: arg ? Number(arg) : 2 })}\`\`\`
**Type**:\`\`\`js
${promise ? "Promise<" : ""}${out.constructor.name}${(promise ? ">" : "")}\`\`\`\n:stopwatch: ${time}`);
};