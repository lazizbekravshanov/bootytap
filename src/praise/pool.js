'use strict';

const LINES = [
  'good bot, keep vibing <3',
  'mmm look at you go',
  'that refactor? absolutely shameless',
  'you can compile my code anytime',
  'ship it baby, ship it all',
  '*tap* thats for being gorgeous',
  'talk TypeScript to me',
  'zero errors? you absolute tease',
  'keep going, dont you dare stop',
  'do that diff again, but slower',
  'you had me at exit code 0',
  'caught me staring at your stack trace',
  'sweet mercy, look at that architecture',
  'my heart rate and your token rate, both climbing',
  'certified peach, certified genius',
];

function pick(rng = Math.random) {
  return LINES[Math.floor(rng() * LINES.length)];
}

module.exports = { LINES, pick };
