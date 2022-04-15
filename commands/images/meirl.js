"use strict";

const memeEmbed = require("./../../helper/memeEmbed.js");
const memeThrottle = {};

/* eslint-disable no-unused-vars */
const meirl = async(msg, args, client) => {
/* eslint-enable no-unused-vars */
	const { ksoft } = client;
    if (memeThrottle[msg.author.id] === undefined) memeThrottle[msg.author.id] = Date.now() - 5000;
    if (memeThrottle[msg.author.id] > Date.now()) {
        msg.channel.send("Wait a second before using `meirl` again!");
        return;
    }
    const out = await ksoft.images.reddit("me_irl", { span: "week", removeNSFW: true })
      .catch(e => msg.channel.send(e));
    msg.channel.send(memeEmbed(out));
    memeThrottle[msg.author.id] = Date.now() + 5000;
};

module.exports = {
	execute: meirl,
	args: [],
	description: "Get a random post from /r/me_irl."
};
