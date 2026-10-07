const STEPS = [
  {
    title: 'A pro demo goes in',
    body: 'Every clutch comes from a real CS2 match demo. The demo records every player, every shot and every tick of the round.',
  },
  {
    title: 'The clutches get found',
    body: 'A parser walks each round and flags the moment one player is left alone against two, three or four. Rounds that end in a couple of seconds are skipped.',
  },
  {
    title: 'Allstar cuts the clip',
    body: 'Each clutch is clipped from the clutcher’s point of view, cut to the exact ticks of the demo so it starts just before the 1vX and ends right after it is decided.',
  },
  {
    title: 'It freezes, you call it',
    body: 'The clip stops two seconds before the next kill. Health, armor, guns, utility, positions and the clock all come straight from the demo at that frame.',
  },
  {
    title: 'Five a day',
    body: 'Everyone gets the same five clutches each day, with at least one that was won. Most 1vXs are lost, so trust the read, not the odds.',
  },
];

export const HowItWorks = () => (
  <section className="how" id="how-it-works" aria-labelledby="how-title">
    <h2 id="how-title">How it works</h2>
    <ol className="how__steps">
      {STEPS.map((s) => (
        <li key={s.title} className="how__step">
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  </section>
);
