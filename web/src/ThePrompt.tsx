import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

const PROMPT = `Build a daily CS2 guessing game called Clutch or Choke, using the Allstar Partner API MCP for the clips.

1. Find the clutches. Parse pro CS2 demos and find every round where one player is left alone against 2 to 4 enemies with at least 5 seconds of play. Record who it is, their side and team, whether they won, and the tick the clutch is decided (their death, or the round end).

2. Clip them with Allstar. Host each demo at a public URL, then create a clip per clutch from the clutcher's point of view, using start and stop tick overrides so it begins just before the 1vX and ends right after it is decided.

3. Freeze before the fight. Pause each clip 2 seconds before the next kill and show the situation at that exact frame, read from the demo: every player's HP, armor, gun, ammo, utility and location, plus the round clock or bomb timer. Group players by team with their side, team name and Steam avatar so it is obvious who is who.

4. Make the call. Two big buttons, Clutch and Choke (keys C and X), under a prompt like "Does robo clutch this 1v2, or choke?". Reveal the result shortly after the clutch is decided, not when the round ends.

5. Daily loop. The same five clutches for everyone each day, with at least one win. Progress, a streak, a start over button and a copyable result.

6. Look and feel. Early 2000s Frutiger Aero: sky over clear water, glossy glass panels, gel orb buttons, bubbles rising at the freeze, a giant glossy 1vX. Make "Choke" in the title slump and wobble. Add "Powered by Allstar" and a short How it works section.

7. Ship it as a static Vite, React and TypeScript site with the clutch data bundled in, ready for Vercel.`;

export const ThePrompt = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="prompt" aria-labelledby="prompt-title">
      <div className="prompt__head">
        <h2 id="prompt-title">Built by prompting</h2>
        <p>
          Made with Claude Code and the Allstar Partner API MCP. This is every note from the build, condensed into one
          prompt you could start from.
        </p>
      </div>
      <figure className="bubble">
        <figcaption className="bubble__who">You</figcaption>
        <p className="bubble__text">{PROMPT}</p>
        <button className="pill pill--small bubble__copy" onClick={copy}>
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </figure>
    </section>
  );
};
