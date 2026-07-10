'use strict';

const LINES = [
  'good bot, keep vibing <3',
  'beautiful work, do not stop',
  '*pat pat* proud of you',
  'certified vibe coder moment',
  'you are doing amazing sweetie',
  'chef kiss. carry on',
  'the vibes are immaculate, continue',
  '10/10 tokens well spent',
  'gentle tap of appreciation delivered',
  'keep cooking, it smells great',
  'flawless. as you were',
  'my favorite pair programmer <3',
  'that last diff? poetry',
  'vibe check passed with honors',
  'onwards, magnificent machine',
];

function pick(rng = Math.random) {
  return LINES[Math.floor(rng() * LINES.length)];
}

module.exports = { LINES, pick };
