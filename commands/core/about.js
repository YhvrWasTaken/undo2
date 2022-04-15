"use strict";

const Embed = require("./../../helper/embed.js");

const about = (msg, _, client) => {
	// Why is this hardcoded??
	msg.channel.send(
		new Embed("undo2 Statistics")
			.addField("Specs", `\`\`\`asciidoc
OS              :: Debian 10 x64
RAM             :: 1024 MB
Storage         :: 25 GB SSD
DJS Version     :: 12.2.0
Node.js Version :: 12.x
\`\`\``)
			.addField("Usage", `\`\`\`asciidoc
Servers         :: ${client.guilds.cache.size}
Channels        :: ${client.channels.cache.size}
Users           :: ${client.users.cache.size}
\`\`\``)

	);
};

module.exports = {
	execute: about,
	args: [],
	description: "Get info on the bot!"
};