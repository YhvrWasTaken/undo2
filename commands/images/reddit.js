"use strict";

const memeEmbed = require("./../../helper/memeEmbed.js");
const Embed = require("./../../helper/embed.js");
const text =
	"There was an error fetching an image from the subreddit. The most" +
	" common causes for this are: NSFW Subreddit, No recent (image) posts on subreddit, Subreddit doesn't exist.";
const memeThrottle = {};

const reddit = async(msg, args, client) => {
	const { ksoft } = client;
    if (memeThrottle[msg.author.id] === undefined) memeThrottle[msg.author.id] = Date.now() - 5000;
    if (memeThrottle[msg.author.id] > Date.now()) {
        throttle(msg, "custom", stuff.pre);
        return;
    }
    memeThrottle[msg.author.id] = Date.now() + 5000;
    let abort = false;
    const img = await ksoft.images.reddit(args, { span: "week", removeNSFW: true })
		.catch(e => {
			msg.channel.send(new Embed("Reddit - Error", text).addField("Debug Info", `\`\`\`${e}\`\`\``));
			abort = true;
		});
    if (abort) return;
    if (img.tag.nsfw) {
        msg.channel.send(new Embed("Reddit - Error", text)
			.addField("Debug Info", "```there is none this is just an edge case please stop" +
				" trying to watch porn via undo2 (or try again if you were not)```"));
        return;
    }
    msg.channel.send(memeEmbed(img));
};

module.exports = {
	execute: reddit,
	args: ["sub"],
	description: "Get a random post from /r/`<sub>`."
};