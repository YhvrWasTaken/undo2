"use strict";

const asyncMap = async(arr, func) => {
	arr = await Promise.all(arr.map(func));
	return arr;
};

const asyncForEach = async(arr, func) => {
	await Promise.all(arr.map(func));
};

module.exports = { asyncMap, asyncForEach };