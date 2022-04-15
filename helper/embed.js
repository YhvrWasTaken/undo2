"use strict";

const { MessageEmbed } = require("discord.js");

class Embed {
	constructor(title, content, color) {
		let out = new MessageEmbed().setColor(color ? color : 0x7289da);
		if (title) if (title.length < 256) out = out.setTitle(title);
		if (content) out = out.setDescription(content.length < 1024 ? content : "<Response too big :(>");
		return out;
	}
}

module.exports = Embed;