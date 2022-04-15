"use strict";

const Embed = require("./../../helper/embed.js");
const MiniSweeper = require("minisweeper");

const { minesweeperEmotes, BSIsBomb } = require("./../../helper/minesweeperCore.js");

const diagonalsweeper = (msg, args) => {
	const exportBool = args.split(" ")[0] === "-e";
	let grid = MiniSweeper.createGrid(8, 8);
	grid = MiniSweeper.addMine(10, grid);
	grid = MiniSweeper.replaceMine(minesweeperEmotes, grid);
	grid.forEach((x, p1) => {
		/* eslint-disable no-unused-vars */
		x.forEach((_, p2) => {
		/* eslint-enable no-unused-vars */
		if (grid[p1][p2] === "||:boom:||") return;
		let count = 0;
		if (BSIsBomb(grid, p1 - 1, p2 - 1)) count++;
		if (BSIsBomb(grid, p1 + 1, p2 + 1)) count++;
		if (BSIsBomb(grid, p1 - 1, p2 + 1)) count++;
		if (BSIsBomb(grid, p1 + 1, p2 - 1)) count++;
		grid[p1][p2] = ["||:zero:||", "||:one:||", "||:two:||", "||:three:||", "||:four:||"][count];
		});
	});
	let result = JSON.stringify(grid)
		.split(/[[\] '"]/gmu)
		.join()
		.replace(/,/gu, "")
		.replace(/((\|\|:(.{3,5}):\|\|){8})/gmu, "$1\n")
		.replace("||:zero:||", ":zero:")
		.replace("||:zero:||", ":zero:");
	if (exportBool)
		result = result.replace(/\|/gmu, "\\|").replace(/:/gmu, "\\:");

	msg.channel.send(new Embed(`Diagonalsweeper - 10 Bombs`, result));
};

module.exports = {
	execute: diagonalsweeper,
	args: [],
	description: "Play a game of minesweeper, but the tile only counts the bombs diagonally adjacent to it."
};