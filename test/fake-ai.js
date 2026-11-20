// Stands in for Claude in the tests: returns a fixed set of operations and records what it was asked.
exports.interpret = async (input) => {
  exports.last = input;
  if (/refuse/.test(input.director_request))
    throw Object.assign(new Error('Claude declined to stage that. Try describing it differently.'), { status: 422 });
  const hero = input.scene.on_stage.find((e) => e.is_the_hero);
  return {
    note: `Staged: ${input.director_request}`,
    ops: [
      { op: 'add', look: '🐉', ref: 'dragon', x: 0.9, y: 0.7, scale: 2, say: 'ROAR!', fx: 'shake' },
      {
        op: 'move',
        ref: 'dragon',
        path: [
          [0.7, 0.75],
          [0.6, 0.8],
        ],
        seconds: 2,
      },
      { op: 'scene', key: 'backdrop', value: 'cave' },
      { op: 'scene', key: 'burst', value: 'shake' },
      { op: 'scene', key: 'sfx', value: 'boom' },
      { op: 'scene', key: 'narration', value: 'The wall explodes.' },
      { op: 'scene', key: 'choices', value: 'Fight|Run|Hide|Extra' },
      { op: 'scene', key: 'backdrop', value: 'not-a-place' },
      { op: 'remove', id: hero.id },
      { op: 'stat', key: 'health', delta: -2 },
      { op: 'bogus' },
      null,
    ],
  };
};
