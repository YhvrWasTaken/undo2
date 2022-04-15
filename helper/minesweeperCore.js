"use strict";

module.exports = {
	minesweeperEmotes: {
		"0": "||:zero:||",
		"1": "||:one:||",
		"2": "||:two:||",
		"3": "||:three:||",
		"4": "||:four:||",
		"5": "||:five:||",
		"6": "||:six:||",
		"7": "||:seven:||",
		"8": "||:eight:||",
		"-1": "||:boom:||"
	},

	PSIsBomb: (grid, x, y, e) => {
		const v = e ? 4 : 5;
		if (x > v || x < 0 || y > v || y < 0) return false;
		if (grid[x][y] === "||:boom:||") return true;
		return false;
	},

	BSIsBomb: (grid, x, y) => {
		if (x > 7 || x < 0 || y > 7 || y < 0) return false;
		if (grid[x][y] === "||:boom:||") return true;
		return false;
	}
};