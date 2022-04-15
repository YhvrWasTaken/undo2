"use strict";

const Embed = require("./../../helper/embed.js");

const tags = async (msg, args, client) => {
	if (!msg.member.hasPermission("ADMINISTRATOR")) {
		msg.channel.send(
			new Embed(
				"Tags - Error",
				"You must have the permission `ADMINISTRATOR` to modify tags.",
				0xbc4949
			)
		);
		return;
	}

	const { keyv } = client;
	const tags = (await keyv.get(`${msg.guild.id}.tags`)) || [];
	let info = args.split(" ").slice(1);
	switch (args.split(" ")[0]) {
		case "add":
			if (info.length < 2) {
				msg.channel.send(
					new Embed(
						"Tags - Error",
						"You can't make a tag without content!",
						0xbc4949
					)
				);
				return;
			}
			tags.push(info[0]);
			await keyv.set(`${msg.guild.id}.tags`, tags);
			await keyv.set(
				`${msg.guild.id}.tags.${info[0]}`,
				info.slice(1).join(" ")
			);
			msg.channel.send(
				new Embed(
					"Tags",
					`Set tag \`${info[0]}\` to "${info.slice(1).join(" ")}"`
				)
			);
			break;
		case "remove":
			if (info.length < 1) {
				msg.channel.send(
					new Embed(
						"Tags - Error",
						"You can't remove nothing!",
						0xbc4949
					)
				);
				return;
			}
			info = info[0];
			tags.splice(tags.indexOf(info), 1);
			await keyv.set(`${msg.guild.id}.tags`, tags);
			await keyv.delete(`${msg.guild.id}.tags.${info}`);
			msg.channel.send(new Embed("Tags", `Removed tag \`${info}\`.`));
			break;
		case "list":
			msg.channel.send(
				`\`\`\`asciidoc
=== Tags ===
${tags ? tags.join("\n") : "No tags yet!"}\`\`\``,
				{ disableMentions: "all" }
			);
			break;
		case "clear":
			msg.channel.send("TODO");
			break;
		default:
			msg.channel.send("Is that a command? See `^help tags`.");
			break;
	}
};

module.exports = {
	execute: tags,
	args: ["add|remove|list|", "val", "val2"],
	description: "Give or remove custom commands to your server.",
};
