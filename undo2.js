// UNDO2 By Yhvr
// A multipurpose discord bot.
// Website: http://undo2.glitch.me
// My Website: https://yhvr.me
// Email: hello@yhvr.me
// Discord: Yhvr#0001

"use strict";

// TODO streamline modules
// so that there's no need
// for all the help.txt,
// thus making the bot simpler
// and reducing the amount
// of read operations

// Core
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

// Database
const Keyv = require("keyv");
// You may be confused as to why it
// doesn't require a password, but
// don't worry! The database should
// only accept connections from
// localhost. You did that, right?
client.keyv = new Keyv("redis://undobot@localhost:6379");

// Init KSoft.Si API Wrapper
const { KSoftClient } = require("@ksoft/api");
client.ksoft = new KSoftClient(process.env.KSOFT);

// Responses
const responses = {};
const modules = {};
const fs = require("fs");

// It scrapes the command subfolder's
// data.json file for the list of
// commands, and goes from there.
function addResponseGroup(name, sub = false) {
	let json = fs.readFileSync(`commands/${name}/data.json`, "utf8");
	json = JSON.parse(json);
	json.commands.forEach(command => {
		addResponse(name, command);
	});
	json.submodules.forEach(mod => {
		addResponseGroup(mod, true);
	});
	json.details = fs.readFileSync(`commands/${name}/help.txt`, "utf8");
	json.sub = sub;
	modules[name] = json;
}

function addResponse(group, command) {
	responses[command] = require(`./commands/${group}/${command}.js`);
	// Legacy
	if (typeof responses[command] === "function") {
		console.warn(
			`WARN: Command ${command} has a deprecated module.exports.`
		);
		responses[command] = { execute: responses[command] };
	}

	if (typeof responses[command].description !== "string") {
		console.warn(`WARN: Command ${command} lacks a description.`);
		responses[command].description = "No documentation found.";
	}

	if (typeof responses[command].args !== "object") {
		console.warn(`WARN: Command ${command} lacks arguments.`);
		responses[command].args = ["null"];
	}

	responses[command].group = group;
}

function bindResponseGroup(to, linkfrom) {
	modules[linkfrom] = to;
}

const meta = JSON.parse(fs.readFileSync("data.json", "utf8"));
meta.modules.forEach(n => addResponseGroup(n));
// For (const to in meta.binds) {
//	meta.binds[to].forEach(n => bindResponseGroup(to, n));
// }

client.on("message", async msg => {
	if (msg.author.bot) return;
	if (!msg.guild) return;
	const prefix = (await client.keyv.get(`${msg.guild.id}.prefix`)) || "^";
	if (
		msg.content === `<@${client.user.id}>` ||
		msg.content === `<@!${client.user.id}>`
	) {
		msg.channel.send(`My prefix is \`${prefix}\``);
	}
	const intercomChannel =
		(await client.keyv.get(`${msg.guild.id}.intercom.channel`)) || false;
	if (!(msg.content.startsWith(prefix) || msg.channel.id === intercomChannel))
		return;
	const command = msg.content.substring(prefix.length).trim();
	const cmd = command.split(" ")[0];
	const tag = (await client.keyv.get(`${msg.guild.id}.tags.${cmd}`)) || false;
	if (msg.content.startsWith(prefix) && (responses[cmd] || responses[meta.binds[cmd]])) {
		try {
			// Normal Command
			const execute = responses[cmd] || responses[meta.binds[cmd]];
			await execute.execute(
				msg,
				command.substring(cmd.length + 1),
				client,
				{
					moduleMeta: modules,
					commands: responses,
				}
			);
		} catch (e) {
			try {
				msg.channel.send(
					"An unknown error occured when running the command. This has been logged."
				);
				// eslint-disable-next-line no-empty
			} catch (f) {}
			client.channels.cache
				.get(process.env.CONSOLE_CHANNEL)
				.send(`ERROR while running command ${cmd}\n${e}`);
		}
	} else if (tag) {
		msg.channel.send(tag, { disableMentions: "all" });
	} else if (msg.channel.id === intercomChannel) {
		// Intercom
		await bulkSend(msg, client.keyv, client);
	}
});

// Still intercom
let bulkSend = require("./helper/bulkSend.js");

// For react :x: to delete from intercom
const mods = require("./helper/intercomMods.js");
const { asyncMap, asyncForEach } = require("./helper/asyncArray.js");

client.on("messageReactionAdd", async (react, user) => {
	if (react.emoji.name === "❌" && mods.includes(user.id)) {
		let children = await client.keyv.get(
			`intercom.delete.${react.message.id}`
		);
		if (children === undefined) {
			client.channels.cache
				.get(process.env.CONSOLE_CHANNEL)
				.send(
					`Intercom mod tried to :x: a message, but it wasn't found in the database!`
				);
			return;
		}
		children = children.split(",").map(n => n.split("|"));
		const channels = await asyncMap(children, n => [
			n[0],
			client.channels.cache.get(n[1]),
		]);
		const messages = [];
		await asyncForEach(channels, async n => {
			const out = await n[1].messages.fetch(n[0]);
			messages.push(out);
		});
		await asyncForEach(messages, async msg => {
			if (msg)
				await msg.delete(
					{},
					0,
					"Message deleted by an intercom moderator"
				);
		});
	}
});

client.setInterval(() => {
	const amount = client.sweepMessages(1000 * 60 * 60 * 24);
	client.channels.cache
		.get(process.env.CONSOLE_CHANNEL)
		.send(
			`:white_check_mark: Removed ${amount} messages older than 30 minutes from cache`
		);
}, 1000 * 60 * 60 * 24);

process
	.on("unhandledRejection", (reason, p) => {
		client.channels.cache
			.get(process.env.CONSOLE_CHANNEL)
			.send([reason, "Unhandled Rejection at Promise", p]);
	})
	.on("uncaughtException", err => {
		client.channels.cache
			.get(process.env.CONSOLE_CHANNEL)
			.send([err, "Uncaught Exception thrown"]);
	});

responses.ev = { execute: require("./helper/eval.js") };

// Database fetches on bot init
client.on("ready", async () => {
	const intercom = await client.keyv.get("intercom.on");
	if (intercom === false) bulkSend = () => ({});
	const bio = (await client.keyv.get(`bio`)) || "for ^help";
	client.user.setActivity(bio, { type: "WATCHING" });
	console.log("The bot is running!");
});

// Where the magic happens
client.login(process.env.SECRET);
