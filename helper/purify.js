"use strict";

const reallylongswearregex = /nigg?(er|a)?(?!ht)|negro|whore|cunt|retard|nick(er|ah)|di?c(c|k)|coc(c|k)|p(e|3)n(i|1)s|peen|s(e|3)x|rap(e|ist)|porg?n|b[o0][o0]b|(?<!cir)cc?umm?|yiff|slut|(blow|hand|feet)job|anal|creampie|intercourse/gmiu;

function purify(x) {
	const y = x.replace(/[^a-z ]+/gmiu, "");
	if (reallylongswearregex.test(y) || /﷽/gmu.test(y)) return "[REDACTED]";
	return x;
}

module.exports = purify;