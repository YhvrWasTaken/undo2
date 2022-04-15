"use strict";

// All of intercom, in one file.
// God damn it this was a mistake.
// But the memes... they beckon.

const Embed = require("./../../helper/embed.js");
const guide = new Embed(
	"Intercom - Guide",
	"Don't know how this works? Need help? Come here!"
)
	.addField(
		"What is this?",
		"Intercom is a way to chat between servers. If anything is unclear, feel" +
			" free to join the undo Discord Server (see `^help`).",
		true
	)
	.addField(
		"Joining via Intercom Join",
		"Copy the field 'GID' from the footer of a message sent from the server you want to join.",
		true
	)
	.addField(
		"Setting up Intercom",
		"To set up intercom, run `intercom enable` then `intercom set` in the desired intercom channel.",
		true
	)
	.addField(
		"Shutting down Intercom",
		"To stop intercom, run `intercom disable`. It's that simple!",
		true
	)
	.addField(
		"Opting into Intercom Join",
		"To let others join your server, run `intercom opt in`.",
		true
	)
	.addField(
		"Opting out of Intercom Join",
		"To stop others from joinin your server, run `intercom opt out`.",
		true
	);
const rules = `**Intercom is a privilege, not a right.**
1. No NSFW, NSFL, Borderline Sexual, Racist, etc.
2. No advertising. Intercom join exists for a reason!
3. No spam. "Spam" includes: Messages that are only emotes, 1 letter messages, and empty messages.`;
const invite = {
	temporary: false,
	maxAge: 60,
	maxUses: 1,
	unique: true,
	reason: "Join via intercom- See 'intercom opt out' to disable.",
};
const err = "Intercom - Error";
const succ = "Intercom - Success";

const mods = require("./../../helper/intercomMods.js");
const hexToRgb = require("./../../helper/hexToRGB.js");

async function enableIntercom(msg, keyv) {
	let intercom = (await keyv.get("intercom")) || "";
	intercom = intercom.split(",");
	if (msg.member.hasPermission("ADMINISTRATOR")) {
		if (intercom.includes(msg.guild.id)) {
			msg.channel.send(
				new Embed(err, "Intercom is already on!", 0xbc4949)
			);
		} else {
			intercom.push(msg.guild.id);
			await keyv.set("intercom", intercom.join(","));
			msg.channel.send(
				new Embed(
					succ,
					"Enabled Intercom. Don't forget to run `intercom set`!",
					0x5da271
				)
			);
		}
	} else {
		msg.channel.send(
			new Embed(
				err,
				"You must have the permission `ADMINISTRATOR` to enable the intercom.",
				0xbc4949
			)
		);
	}
}

async function disableIntercom(msg, keyv) {
	let intercom = (await keyv.get("intercom")) || "";
	intercom = intercom.split(",");
	if (msg.member.hasPermission("ADMINISTRATOR")) {
		if (intercom.includes(msg.guild.id) === false) {
			msg.channel.send(
				new Embed(err, "Intercom is already off!", 0xbc4949)
			);
		} else {
			intercom = intercom.filter(id => id !== msg.guild.id);
			await keyv.set("intercom", intercom.join(","));
			msg.channel.send(new Embed(succ, "Disabled Intercom.", 0x5da271));
		}
	} else {
		msg.channel.send(
			new Embed(
				err,
				"You must have the permission `ADMINISTRATOR` to disable the intercom.",
				0xbc4949
			)
		);
	}
}

async function setIntercom(msg, keyv) {
	if (msg.member.hasPermission("MANAGE_CHANNELS")) {
		const channel =
			(await keyv.get(`${msg.guild.id}.intercom.channel`)) || false;
		if (channel === "no") {
			msg.channel.send(
				new Embed(
					err,
					"This server has been banned from intercom." +
						" Please join the official undo server if you would like to request an unban.",
					0xbc4949
				)
			);
		} else if (msg.channel.id === channel) {
			msg.channel.send(
				new Embed(
					err,
					"Intercom is already set to that channel!",
					0xbc4949
				)
			);
		} else {
			await keyv.set(`${msg.guild.id}.intercom.channel`, msg.channel.id);
			msg.channel.send(
				new Embed(succ, "Changed Intercom channel.", 0x5da271)
			);
		}
	} else {
		msg.channel.send(
			new Embed(
				err,
				"You must have the permission `MANAGE_CHANNELS` to set the intercom channel.",
				0xbc4949
			)
		);
	}
}

async function muteServer(msg, keyv, args) {
	if (mods.includes(msg.author.id)) {
		await keyv.set(`${args}.intercom.channel`, "no");
		msg.channel.send(new Embed(succ, "pog", 0x5da271));
		return;
	}
	msg.channel.send(new Embed(err, "you ≠ intercom mod", 0xbc4949));
}

async function muteUser(msg, keyv, args) {
	if (mods.includes(msg.author.id)) {
		await keyv.set(`intercom.banned.${args}`, true);
		msg.channel.send(new Embed(succ, "Banned that user LOL", 0x5da271));
		return;
	}
	msg.channel.send(new Embed(err, "you ain't a mod lmao", 0xbc4949));
}

async function unmuteServer(msg, keyv, args) {
	if (mods.includes(msg.author.id)) {
		await keyv.set(`${args}.intercom.channel`, false);
		msg.channel.send(new Embed(succ, "pog", 0x5da271));
		return;
	}
	msg.channel.send(new Embed(err, "you ≠ mod", 0xbc4949));
}

async function unmuteUser(msg, keyv, args) {
	const banned = (await keyv.get(`intercom.banned.${args}`)) || false;
	if (mods.includes(msg.author.id) && banned) {
		await keyv.set(`intercom.banned.${args}`, false);
		msg.channel.send(
			new Embed(
				succ,
				"either you fucked up big time or a tempmute expired lmfao",
				0x5da271
			)
		);
	} else if (banned === false) {
		msg.channel.send(new Embed(err, "not banned xdd", 0xbc4949));
	} else {
		msg.channel.send(new Embed(err, "you ain't a mod lmao", 0xbc4949));
	}
}

async function unkill(msg, keyv) {
	if (mods.includes(msg.author.id)) {
		await keyv.set(`intercom.on`, true);
		await msg.channel.send(
			new Embed(
				succ,
				"Intercom has been enabled. Please wait for it to reboot.",
				0x5da271
			)
		);
		process.exit();
	} else {
		msg.channel.send(new Embed(err, "you ain't a mod lmao", 0xbc4949));
	}
}

async function kill(msg, keyv) {
	if (mods.includes(msg.author.id)) {
		await keyv.set(`intercom.on`, false);
		await msg.channel.send(
			new Embed(
				succ,
				"intercom ≠ on. Please wait for undo2 to reboot.",
				0x5da271
			)
		);
		process.exit();
	} else {
		msg.channel.send(new Embed(err, "you ain't a mod lmao", 0xbc4949));
	}
}

async function opt(msg, keyv, args) {
	const current = (await keyv.get(`${msg.guild.id}.intercom.join`)) || false;
	if (msg.member.hasPermission("ADMINISTRATOR")) {
		if (args[0] === "in") {
			if (msg.channel.id === current) {
				msg.channel.send(
					new Embed(err, "You're already opted in!", 0xbc4949)
				);
			} else {
				await keyv.set(`${msg.guild.id}.intercom.join`, msg.channel.id);
				msg.channel.send(new Embed(succ, "Opted in.", 0x5da271));
			}
		} else if (args[0] === "out") {
			if (current === false) {
				msg.channel.send(
					new Embed(
						err,
						"You can't opt out what you're not in!",
						0xbc4949
					)
				);
			} else {
				await keyv.set(`${msg.guild.id}.intercom.join`, false);
				msg.channel.send(new Embed(succ, "Opted out.", 0x5da271));
			}
		} else {
			msg.channel.send(
				new Embed(
					err,
					"You didn't specify whether you want to opt in or out.",
					0xbc4949
				)
			);
		}
	} else {
		msg.channel.send(
			new Embed(
				err,
				"You must have the permission `ADMINISTRATOR` to opt in or out of joining.",
				0xbc4949
			)
		);
	}
}

async function join(msg, keyv, client, args) {
	const id = await keyv.get(`${args[1]}.intercom.join`);
	if (id === undefined) {
		if (client.guilds.cache.get(id)) {
			msg.channel.send(
				new Embed(
					err,
					"They haven't opted in to joining via intercom.",
					0xbc4949
				)
			);
			return;
		}
		msg.channel.send(
			new Embed(
				err,
				"They haven't opted in to joining via intercom.",
				0xbc4949
			).addField(
				"Pro Tip",
				'The server\'s ID is listed as "Guild ID" in the footer of a message sent by that server.'
			)
		);
	} else if (id) {
		const dm = await msg.author.createDM();
		const inv = await client.channels.cache
			.get(id)
			.createInvite(invite)
			// eslint-disable-next-line no-unused-vars
			.catch(async e => {
				await client.channels.cache
					.get(id)
					.send(
						"Someone tried to join via intercom, but I" +
							" don't have permission to create invites for this channel!"
					)
					// eslint-disable-next-line no-unused-vars
					.catch(er => {
						"no";
					});
			});
		try {
			dm.send(`Here is your invite! ${inv.url}`);
		} catch (e) {
			msg.channel.send(
				new Embed(
					err,
					"You need to have DMs enabled to join via intercom! You can disable them afterwards.",
					0xbc4949
				)
			);
		}
	} else {
		msg.channel.send(
			new Embed(
				err,
				"They haven't opted in to joining via intercom.",
				0xbc4949
			)
		);
	}
}

async function color(msg, keyv, args) {
	if (msg.member.hasPermission("ADMINISTRATOR")) {
		const col = (await keyv.get(`${msg.guild.id}.intercom.color`)) || false;
		const to = args;
		if (col === to) {
			msg.channel.send(
				new Embed(
					err,
					"Intercom is already set to that color!",
					0xbc4949
				)
			);
		} else if (hexToRgb(to) === null) {
			msg.channel.send(
				new Embed(err, "That's not a valid hex color.", 0xbc4949)
			);
		} else {
			await keyv.set(
				`${msg.guild.id}.intercom.color`,
				hexToRgb(to).join(",")
			);
			msg.channel.send(
				new Embed(succ, "Changed Intercom color.", hexToRgb(to))
			);
		}
	} else {
		msg.channel.send(
			new Embed(
				err,
				"You must have the permission `ADMINISTRATOR` to set the intercom color.",
				0xbc4949
			)
		);
	}
}

async function modping(msg, keyv, client) {
	const banned =
		(await keyv.get(`intercom.banned.${msg.author.id}`)) || false;
	if (banned) {
		msg.channel.send(
			new Embed(
				err,
				"You can't modping while banned from intercom!",
				0xbc4949
			)
		);
	} else {
		client.channels.cache
			.get(process.env.MOD_INTERCOM)
			.send(
				`${mods
					.map(n => `<@!${n}>`)
					.join(", ")} - New modping from <@!${msg.author.id}>`
			);
	}
}

async function style(msg, keyv, args) {
	if (!msg.member.hasPermission("ADMINISTRATOR")) {
		msg.channel.send(
			new Embed(
				err,
				"You must have the permission `ADMINISTRATOR` to set the intercom style.",
				0xbc4949
			)
		);
		return;
	}
	if (!["embed", "simple", "complex"].includes(args)) {
		msg.channel.send(
			new Embed(
				err,
				"That's not a valid style. Valid styles include: `embed`, `simple`, `complex`",
				0xbc4949
			)
		);
		return;
	}
	await keyv.set(`${msg.guild.id}.intercom.style`, args);
	msg.channel.send(
		new Embed(succ, `Set the intercom style to \`${args}\`.`).addField(
			"Warning",
			"Styles are in beta. Your server may be susceptible to pings."
		)
	);
}

const it = async (msg, inp, client) => {
	const { keyv } = client;
	const args = inp.split(" ");
	switch (args[0]) {
		case "enable":
			await enableIntercom(msg, keyv, args);
			break;
		case "disable":
			await disableIntercom(msg, keyv, args);
			break;
		case "set":
			await setIntercom(msg, keyv, args);
			break;
		case "rules":
			msg.channel.send(new Embed("Intercom - Rules", rules));
			break;
		case "muteServer":
			await muteServer(msg, keyv, args.slice(1).join(" "));
			break;
		case "muteUser":
			await muteUser(msg, keyv, args.slice(1).join(" "));
			break;
		case "unmuteServer":
			await unmuteServer(msg, keyv, args.slice(1).join(" "));
			break;
		case "unmuteUser":
			await unmuteUser(msg, keyv, args.slice(1).join(" "));
			break;
		case "unkill":
			await unkill(msg, keyv, args);
			break;
		case "kill":
			await kill(msg, keyv, args);
			break;
		case "opt":
			await opt(msg, keyv, args.slice(1));
			break;
		case "join":
			await join(msg, keyv, client, args);
			break;
		case "color":
		case "colour":
			await color(msg, keyv, args[1]);
			break;
		case "style":
			style(msg, keyv, args.slice(1).join(" "));
			break;
		case "guide":
			msg.channel.send(guide);
			break;
		case "mod":
			msg.channel.send(
				"`muteServer <gid>`, `muteUser <uid>`, `unmuteServer <gid>`," +
					" `unmuteUser <uid>`, `kill`, `unkill`"
			);
			break;
		case "modping":
			modping(msg, keyv, client);
			break;
		default:
			break;
	}
};

module.exports = {
	execute: it,
	args: ["command", "args"],
	description: `**INTERCOM** Inter-server chat since April 5th.
All commands start with your server's prefix followed by \`intercom \`.
Most questions can be remedied with the guide (\`intercom guide\`).
\`enable\` - Enable intercom.
\`disable\` - Disable intercom.
\`set\` - Set the intercom channel to the channel the command is run in.
\`rules\` - List the rules for intercom.
\`opt <in|out>\` - Opt in or out of intercom joining.
\`join <gid>\` - Join a server via intercom join.
\`color <hex>\` - Set your server's embed color.
\`style <style>\` - Set the way messages from intercom appear on your server.
\`guide\` - A guide for intercom.
\`modping\` - Someone causing trouble? Ping a mod!
\`mod\` - A list of commands for intercom mods.`,
};
