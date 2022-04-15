"use strict";

const Embed = require("./../../helper/embed.js");
const MiniSweeper = require("minisweeper");

const { minesweeperEmotes } = require("./../../helper/minesweeperCore.js");

const minesweeper = (msg, args) => {
    const exportBool = args.split(" ")[0] === "-e";
    let grid = MiniSweeper.createGrid(8, 8);
    grid = MiniSweeper.addMine(10, grid);
    grid = MiniSweeper.replaceMine(minesweeperEmotes, grid);
    let result = JSON.stringify(grid)
        .split(/[[\] '"]/gmu)
        .join()
        .replace(/,/gu, "")
        .replace(/((\|\|:(.{3,5}):\|\|){8})/gmu, "$1\n")
        .replace("||:zero:||", ":zero:");
    if (exportBool)
        result = result.replace(/\|/gmu, "\\|")
            .replace(/:/gmu, "\\:");

    msg.channel.send(new Embed(`Minesweeper - 10 Bombs`, result));
};

module.exports = {
	execute: minesweeper,
	args: [],
	description: "Play a game of minesweeper!"
};