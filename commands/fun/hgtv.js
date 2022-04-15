"use strict";

// I think this was supposed to be something where it's, like,
// the jobs of people that were buying a house on HGTV.
// Sort of like:
//    "I'm Richard Nixon, and I collect fancy stones for a living.
//    Along with my wife, who uploads cat videos and scams old people online,
//    we are looking for a forever home. We have a budget of $1,250,000.
const rand = a => a[Math.floor(Math.random() * a.length)];
const min = 333000;
const max = 1250000;
const jobs = ``.split("\n");
const relations = `Husband
Wife
Spouse
Son
Daughter
Child
Dad
Mom
Father
Mother
Uncle
Aunt
Niece
Nephew`.split("\n");
