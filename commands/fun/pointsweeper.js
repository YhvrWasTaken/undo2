"use strict";

const Embed = require("./../../helper/embed.js");
const MiniSweeper = require("minisweeper");

const { minesweeperEmotes, PSIsBomb } = require("./../../helper/minesweeperCore.js");

const pointsweeper = (msg, args) => {
    const exportBool = args.split(" ")[0] === "-e";
    // 8x8, 10 bombs
    let grid = (exportBool ? MiniSweeper.createGrid(6, 6) : MiniSweeper.createGrid(7, 7));
    grid = MiniSweeper.addMine(exportBool ? 8 : 10, grid);
    grid = MiniSweeper.replaceMine(minesweeperEmotes, grid);
    grid.forEach((x, p1) => {
		/* eslint-disable no-unused-vars */
        x.forEach((_, p2) => {
		/* eslint-enable no-unused-vars */
			// Up one, down one, left one, right one, upleft one, downright one, upright one, downleft one
			if (PSIsBomb(grid, p1, p2, exportBool ? 4 : 5)) return;
            if (PSIsBomb(grid, p1 - 1, p2, exportBool ? 4 : 5) && PSIsBomb(grid, p1 + 1, p2, exportBool ? 4 : 5))
				grid[p1][p2] = "||:arrow_up_down:||";
            else if (PSIsBomb(grid, p1, p2 - 1, exportBool) && PSIsBomb(grid, p1, p2 + 1, exportBool ? 4 : 5))
				grid[p1][p2] = "||:left_right_arrow:||";
            else if (PSIsBomb(grid, p1 - 1, p2, exportBool)) grid[p1][p2] = "||:arrow_up:||";
            else if (PSIsBomb(grid, p1 + 1, p2, exportBool)) grid[p1][p2] = "||:arrow_down:||";
            else if (PSIsBomb(grid, p1, p2 - 1, exportBool)) grid[p1][p2] = "||:arrow_left:||";
            else if (PSIsBomb(grid, p1, p2 + 1, exportBool)) grid[p1][p2] = "||:arrow_right:||";
            else if (PSIsBomb(grid, p1 - 1, p2 - 1, exportBool)) grid[p1][p2] = "||:arrow_upper_left:||";
            else if (PSIsBomb(grid, p1 + 1, p2 + 1, exportBool)) grid[p1][p2] = "||:arrow_lower_right:||";
            else if (PSIsBomb(grid, p1 - 1, p2 + 1, exportBool)) grid[p1][p2] = "||:arrow_upper_right:||";
            else if (PSIsBomb(grid, p1 + 1, p2 - 1, exportBool)) grid[p1][p2] = "||:arrow_lower_left:||";
        });
    });
    let result = JSON.stringify(grid)
        .split(/[[\] '"]/gmu)
        .join()
        .replace(/,/gu, "")
        .replace(new RegExp(`((\\|\\|:([^:]*):\\|\\|){${exportBool ? 6 : 7}})`, `gmu`), "$1\n")
		// Error handling, it's like this for some reason >_<
        .replace(new RegExp(`\\|\\|:(zero|one|two|three|four|five|six|seven|eight):\\|\\|`, `gmu`), "||:black_large_square:||")
        .replace("||:black_large_square:||", ":black_large_square:");
    if (exportBool) {
        result = result.replace(/\|/gmu, "\\|")
            .replace(/:/gmu, "\\:");
    }
    msg.channel.send(new Embed(
		`Pointsweeper${exportBool ? " (Exported)" : ""} - ${exportBool ? 8 : 10} Bombs`,
		result.length < 1024 ? result : "Too big :("
	));
};

module.exports = {
	execute: pointsweeper,
	args: [],
	description: "Play a game of minesweeper, but a tile points to a bomb nearby."
};