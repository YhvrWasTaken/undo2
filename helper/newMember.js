"use strict";

const newMember = async(usr, keyv, client) => {
	const channel = await keyv.get(`${usr.guild.id}.welcome.channel`) || null;
	const message = await keyv.get(`${usr.guild.id}.welcome.channel`) || null;
	if (channel && message) {
		client.channels.cache.get(channel).send(
			message
				.replace(/\{ping\}/gmu, `<@${usr.user.id}>`)
				.replace(/\{user\}/gmu, `${usr.user.username}`)
				.replace(/\{uuid\}/gmu, `${usr.user.id}`)
				.replace(/\{tag\}/gmu, `${usr.user.tag}`)
		);
	}
};

module.exports = newMember;