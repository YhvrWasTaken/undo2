"use strict";

const { MessageEmbed } = require("discord.js");

const imgEmbed = meme =>
    new MessageEmbed()
		.setTitle(meme.post.title.length > 256 ? "Title too long to display." : meme.post.title)
		.setURL(meme.post.link)
		.setImage(meme.url)
		.setColor(0x7289da)
		.setFooter(`${meme.post.upvotes - meme.post.downvotes} 👍 ${meme.post.comments} 💬`);

module.exports = imgEmbed;