"use strict";

const Embed = require("./../../helper/embed.js");
const server = "https://discord.gg/khJUFRu";

const help = async(msg, args, client, spoonfeddata) => {
	const { keyv } = client;
	const { moduleMeta, commands } = spoonfeddata;
	const prefix = await keyv.get(`${msg.guild.id}.prefix`) || "^";
	if (args === "") {
		let body = new Embed(
			`undo2 Module page`,
			`All commands start with the prefix \`${
				prefix
			}\`. Say \`${
				prefix
			}help <module>\` for info on a module. Join the undo discord server at ${server} for more help.`
		);
		for (const key in moduleMeta) {
			const chunk = moduleMeta[key];
			if (!chunk.sub)
				body = body.addField(
					`:${chunk.emote}: ${chunk.name}`,
					chunk.description, true
				);
		}
		msg.channel.send(body);
	} else if (moduleMeta[args.toLowerCase()] || moduleMeta[moduleMeta[args.toLowerCase()]]) {
		const meta = moduleMeta[moduleMeta[args.toLowerCase()]] || moduleMeta[args.toLowerCase()];
		let emb = new Embed(`undo2 ${args} page`, `${args === "intercom" ? "" : `Use \`${prefix}help <command>\` where \`<command>\` is one of:`}\n${meta.details}`);
		if ((meta.submodules || []).length > 0) emb = emb.addField(
			"Submodules",
			meta.submodules.map(m => `:${
				moduleMeta[m].emote
			}: ${moduleMeta[m].name} - ${moduleMeta[m].description}`).join("\n")
		);
		msg.channel.send(emb);
	} else if (commands[args.toLowerCase()]) {
		const meta = commands[args.toLowerCase()];
		let emb = new Embed(`undo2 ${args} page`, meta.description);
		if (meta.args.length > 0) emb = emb.addField(
			"Arguments",
			meta.args.map(m => `\`<${m}>\``).join(" ")
		);
		msg.channel.send(emb);
	} else {
		msg.channel.send(new Embed("Help - Error", "I don't think that's a module or command."));
	}
};

module.exports = {
	execute: help,
	args: ["module|command?"],
	description: "Get info on a module or a command."
};