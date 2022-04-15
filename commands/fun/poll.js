"use strict";

const Embed = require("./../../helper/embed.js");

const poll = (msg, args) => {
    msg.channel.send(new Embed(`Poll: ${args}`, `Simply react with 👍 or 👎!`)).then(msg2 => {
        msg2.react("👍")
		.then(() => msg2.react("👎"))
		.catch(() => console.log("POLL: Error!"));
    });
};

module.exports = {
	execute: poll,
	args: ["sub"],
	description: `Make a poll about \`sub\`.`
};