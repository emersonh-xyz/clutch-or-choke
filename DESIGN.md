---
name: Clutch or Choke
description: Call a pro's 1vX through glass, then watch it break, in a sky-over-clear-water Frutiger Aero world.
colors:
  sky-high: "#1677d2"
  sky-mid: "#4fb2f2"
  sky-low: "#c9ecff"
  horizon: "#f2fbff"
  sea-top: "#43c3ee"
  sea-mid: "#22b4dc"
  sea-deep: "#0a789f"
  aqua-highlight: "#38b6ff"
  ink: "#0a3554"
  ink-soft: "#1f5479"
  ink-faint: "#5a87a8"
  glass: "rgba(255, 255, 255, 0.4)"
  glass-strong: "rgba(255, 255, 255, 0.72)"
  glass-edge: "rgba(255, 255, 255, 0.9)"
  leaf-top: "#9df07a"
  leaf: "#4cbf2c"
  leaf-deep: "#23801a"
  sunset-top: "#ffc58a"
  sunset: "#ff8a3d"
  sunset-deep: "#c24a0a"
  choke-candy: "#ffa04f"
  side-ct: "#2f8fe8"
  side-t: "#e9a524"
typography:
  display:
    fontFamily: "'Nunito Variable', 'Nunito', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
  numeral:
    fontFamily: "'Nunito Variable', 'Nunito', sans-serif"
    fontSize: "22cqi"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  headline:
    fontFamily: "'Nunito Variable', 'Nunito', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Nunito Variable', 'Nunito', sans-serif"
    fontSize: "1.4rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Nunito Variable', 'Nunito', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Nunito Variable', 'Nunito', sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  pane: "28px"
  tray: "24px"
  inner: "18px"
  small: "6px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "40px"
components:
  button-gel:
    backgroundColor: "linear-gradient(180deg, #c4eeff 0%, #7fd5fb 49%, #3fb3ee 50%, #8edcff 100%)"
    textColor: "#062c47"
    rounded: "{rounded.full}"
    padding: "10px 22px"
  button-gel-ghost:
    backgroundColor: "linear-gradient(180deg, #ffffff 0%, #e8f6ff 49%, #cbe9fc 50%, #eef9ff 100%)"
    textColor: "#062c47"
    rounded: "{rounded.full}"
    padding: "10px 22px"
  button-gel-small:
    rounded: "{rounded.full}"
    padding: "6px 14px"
  orb-clutch:
    backgroundColor: "{colors.leaf}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    size: "136px"
  orb-choke:
    backgroundColor: "{colors.sunset}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    size: "136px"
  chip-pearl:
    backgroundColor: "linear-gradient(180deg, #ffffff 0%, #e8f6ff 49%, #cbe9fc 50%, #eef9ff 100%)"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "1px 9px"
  glass-pane:
    backgroundColor: "{colors.glass-strong}"
    rounded: "{rounded.pane}"
    padding: "12px"
  glass-tray:
    backgroundColor: "{colors.glass-strong}"
    rounded: "{rounded.tray}"
  verdict-card:
    backgroundColor: "{colors.glass-strong}"
    rounded: "26px"
    padding: "22px 32px"
---

# Design System: Clutch or Choke

## Overview

**Creative North Star: "Clear Water, Open Sky"**

The whole product sits in an early 2000s Frutiger Aero world: a saturated sky gradient falls to a pale horizon, a band of clear aqua water with slow caustic light fills the lower third, and soap bubbles drift up through the page. Every surface on top of that world is glass: thick, glossy, white-edged panes with a bright top highlight and a soft blue underglow. You read the round through the glass; at the decision moment the clip frosts over, a sheen crosses it, and bubbles burst from the pane.

Density is moderate and readable. One large glass pane holds the clip, glass trays hold each team's players, and two big gel orbs carry the only decision on the page. Type is a single rounded humanist family set heavy and white on the sky, dark ink on glass. The system is light-only and refuses the dark esports stats overlay; nothing here is matte, flat, or grey.

The one deliberate break from all-white display type is the wordmark's "CHOke": candy orange letters that slump and tilt like they are losing their grip, the choke made literal. It is the brand's signature, not a pattern to repeat.

**Key Characteristics:**
- Sky-to-water backdrop is fixed behind everything; content floats on it. The caustic light is one untiled SVG turbulence field, oversized to 120% and drifting slowly by transform (24s), so it never shows tile seams.
- Glass panes with white 1px edges, inner top highlight, and blue-tinted soft drop shadows.
- Gel (split-gradient, glossy) fills for every interactive pill and orb.
- Circles everywhere: bubbles, HP orbs, avatars, beads, step bubbles, decision orbs.
- One family (Nunito Variable), heavy weights (700 to 900) carry the hierarchy.
- Green means clutch/right, orange means choke/wrong; nothing else uses those hues.

## Colors

A sky-and-sea blue world with deep navy ink for text, two candy gel accents reserved for the verdict pair, and team colors used only on team trays.

### Primary
- **Gel Leaf Green** (leaf, with leaf-top and leaf-deep): the Clutch orb, correct-answer beads, completed pipeline steps, and the "Clutched." verdict text (leaf-deep). Always a three-stop radial top/mid/deep, never a flat fill.
- **Gel Sunset Orange** (sunset, with sunset-top and sunset-deep): the Choke orb, wrong-answer beads, error steps, the "Choked." verdict (sunset-deep), the streak count, and low-HP water in the HP orb.

### Secondary
- **Aqua Gel** (the `--aqua-gel` split gradient, edge #5fb3e4): primary pill buttons and the play button. Its hard 49%/50% split is the gloss line.
- **Pearl Gel** (the `--pearl-gel` split gradient): ghost pills, the round clock chip, utility chips.

### Tertiary
- **Team CT Blue** (side-ct) and **Team T Amber** (side-t): only on a tray's 4px top rule, its side badge, its 14 to 20% header wash, and the player avatar ring. T badge text is dark brown (#3d2600) for contrast; CT badge text is white.
- **Candy Choke Orange** (choke-candy): the wordmark's "CHOke" letters only.

### Neutral
- **Sky High / Sky Mid / Sky Low / Horizon**: the sky gradient top to bottom, with a white horizon glow at its base.
- **Sea Top / Sea Mid / Sea Deep**: the water band; sea-deep is also the html background behind the fixed world, sea-mid tints the upload pool and scrollbar track.
- **Aqua Highlight** (aqua-highlight): text selection and the browser theme color.
- **Deep Navy Ink** (ink): primary text on glass, numbers, names, weapon names.
- **Soft Navy** (ink-soft): secondary text (roles, places, ammo, ledes, pending verdict).
- **Faded Navy** (ink-faint): idle pipeline steps and in-progress statuses only.
- **Glass / Glass Strong / Glass Edge**: pane fills (white at 40 to 88%) and the 1px white edge every glass surface wears.

### Named Rules
**The Verdict Pair Rule.** Green and orange gel are reserved for the clutch/choke meaning (the call, the outcome, right/wrong, healthy/hurt). Never use them as generic accent or decoration.

**The White Edge Rule.** Every glass surface carries a near-white 1px border (glass-edge or #fff) plus an inset 1px white top highlight. A glass surface without its edge reads as a grey box.

## Typography

**Display Font:** Nunito Variable (with Nunito, sans-serif)
**Body Font:** Nunito Variable
**Label/Mono Font:** ui-monospace, SF Mono, Menlo for inline `code` only

**Character:** One soft, rounded humanist family does everything. Hierarchy comes from weight (black 900 for anything that must be read at a glance) and from glossy extruded text-shadows on the two display moments, not from a second face.

### Hierarchy
- **Display** (900, clamp(2rem, 5vw, 3.25rem), line-height 1, -0.02em): the wordmark only. White with a navy drop; "or" drops to 600 italic in pale ice (#dff4ff).
- **Numeral** (900, 22cqi of the clip pane, line-height 0.9, -0.04em, tabular): the giant "1vX" over the frozen frame. Ice-blue face with a crisp white upper half and a stepped blue extrusion, like a glossy plastic letter.
- **Headline** (900, clamp(2rem, 5vw, 3rem), 1.1, -0.02em): results title; the verdict outcome (2.6rem) and section heading (1.9rem) sit on the same 900/-0.02em voice.
- **Title** (900, 1.4rem, -0.01em): orb labels; player names (1.05rem) and team names share the black weight.
- **Body** (400, 16px, 1.5): captions, ledes (max 62ch). The footnote (0.9rem, ink) sits on its own pale glass pill (white 72%, 1px white edge, blur 8px, 8px 18px, fully round) so it reads on the water. Secondary detail drops to 0.85 to 0.92rem in ink-soft.
- **Label** (700 to 900, 0.78rem): side badges (0.04em tracking) and utility chips. No uppercase transform; case comes from the data.

### Named Rules
**The Tabular Numbers Rule.** Every live number (HP, clock, ammo, position, streak, numeral) uses `font-variant-numeric: tabular-nums` so values never jitter as they change.

**The One Family Rule.** No second display face. Emphasis is weight and gloss, never a new font.

## Layout

A single centered column, `min(1240px, 100% - 32px)` wide, padded 28px top and 40px bottom, with 40px between major sections. The masthead is a wrap-flex row: wordmark left, a glass meta pill (date, five progress beads, streak) right.

The play stage is a two-column grid: the clip pane fluid on the left, a fixed 340px situation column on the right (round clock chip, then one tray per team), with the call or verdict spanning under the pane. Gaps are 20px vertical, 24px horizontal. The clip is locked to 16:9.

At 1100px and below the stage stacks to one column (pane, situation, call) and the two team trays sit side by side when there is room (auto-fit, min 280px), with the clock chip centered above them. At 760px and below the decision orbs shrink from 136px to 112px, the upload card tightens to 20px 16px padding, and the five-step pipeline turns from a horizontal track into a vertical list.

Spacing rhythm runs 4, 8, 12, 16, 24, 40 with 14px and 20px as in-component steps (tray rows pad 10px 14px).

## Elevation & Depth

Depth is lit glass over water, built from layered soft shadows, inset highlights, and backdrop blur. Shadows are always blue-navy tinted (rgba of #053a6c family), large, and pulled in with a negative spread so surfaces float rather than sit. Every glass surface also carries `backdrop-filter: blur(10 to 16px)` so the sky and water stay visible through it.

### Shadow Vocabulary
- **Pane float** (`box-shadow: 0 24px 48px -18px rgba(5, 58, 108, 0.55)`): the clip pane, the verdict card, the upload card.
- **Tray float** (`0 16px 30px -18px rgba(5, 58, 108, 0.8), inset 0 1px 0 #fff`): team trays.
- **Chip float** (`0 8px 18px -10px rgba(5, 58, 108, 0.7)`): clock chip, meta pill, the sound button over the video.
- **Gel lift** (`0 8px 16px -8px rgba(5, 58, 108, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9)`): pills.
- **Orb drop** (`0 16px 26px -10px` tinted to the orb's own hue, plus `inset 0 -8px 16px rgba(0,0,0,0.18)` and a 2px inner white ring): the decision orbs.
- **Focus halo** (`outline: 3px solid #fff; outline-offset: 3px; box-shadow: 0 0 0 7px rgba(22, 119, 210, 0.55)`): every focusable element.

### Named Rules
**The Gloss Cap Rule.** Every pane, orb, bead, and HP orb carries a white highlight cap on its upper half (a pseudo-element gradient from about 75 to 92% white to transparent). The cap is what makes the material read as glass or gel.

**The Tinted Shadow Rule.** Shadows are navy-blue or hue-matched, never neutral black, and always soft. No hard offset box shadows.

## Shapes

Generously rounded rectangles for containers and perfect circles for everything that represents a person, a state, or a choice. Panes are 28px, trays 24px, the verdict card 26px, inner screens and alerts 18px, the upload pool 22px. Pills, chips, and the meta bar are fully round (999px). Avatars, HP orbs, beads, step bubbles, bubbles, and the decision orbs are circles. The upload pool is the one dashed border (2px, sea blue), marking it as a drop target.

## Components

### Buttons
Glossy and squeezable, like candy plastic.
- **Shape:** fully round pill (999px).
- **Primary (gel pill):** aqua gel split gradient, 1px #5fb3e4 edge, dark navy text (#062c47) at 800, 10px 22px, Lucide icon at the leading or trailing edge.
- **Hover / Focus:** brightness 1.06 and saturate 1.1, lift 1px over 0.2s on the ease-out curve; press drops 1px. Focus uses the global white-outline halo.
- **Ghost:** pearl gel fill with #a8d6f2 edge, same text. **Small:** 6px 14px at 0.9rem.

### Decision Orbs (signature)
Two big spherical gel buttons centered under the clip: Clutch in leaf green, Choke in sunset orange, 136px (112px on small screens), white 900 label at 1.4rem with a keyboard hint chip (C / X) that hides on touch devices. Radial three-stop fill, a white gloss cap on the top 40%, and a soft white bounce light at the bottom. Hover lifts 4px and scales 1.04; press sinks and scales 0.97. They rise in with a 70ms stagger.

### Chips
- **Style:** pearl gel, 1px #b6dcf3 edge, ink-soft 0.78rem 700, 1px 9px, fully round. Used for utility (Flash, Smoke) and, larger, for the round clock (8px 18px, bold clock value in ink 900).
- **Side badges:** solid team color pill, 900 weight, white (CT) or dark brown (T) text.

### Cards / Containers
- **Glass pane:** 28px radius, white 62 to 50% gradient, white edge, pane float plus inset top highlight and inner blue glow, blur 16px saturate 140%, 12px padding around a 16:9 screen with 18px corners.
- **Team tray:** 24px radius, white 86 to 62% glass with a team-colored wash fading in from the top, 4px team-colored top rule on the header, rows divided by white 1px lines.
- **Verdict card:** 26px radius, max 520px, centered, 22px 32px padding, outcome headline in leaf-deep or sunset-deep.

### Inputs / Fields
- **Drop pool:** the upload target is a pool of water: 22px radius, 2px dashed sea-blue edge, translucent aqua fill with an inset shadow. Hover or drag-over deepens the fill and solidifies the edge to sea-mid; upload progress fills it left to right with deeper water. Focus-within takes the white 3px outline.

### HP Orb (signature)
A 52px glass sphere (60px for a lone player) whose water level is the player's health: aqua water at full, turning sunset orange when low, with a pale meniscus line and a gloss cap. The value sits on top in ink 900 with a white glow.

### Progress Beads and Pipeline Steps
Beads are 30px (14px in the masthead) pearl spheres that turn leaf for right and sunset for wrong, with the current one ringed in CT blue. Pipeline steps are 38px bubbles on a 4px track: pearl idle, aqua and breathing when active, leaf when done, sunset on error.

## Do's and Don'ts

### Do:
- **Do** put every surface on glass: white 1px edge, inset top highlight, tinted soft shadow, backdrop blur.
- **Do** use gel split gradients (`--aqua-gel`, `--pearl-gel`) for anything clickable, and three-stop radials for spheres.
- **Do** reserve leaf green and sunset orange for the clutch/choke meaning.
- **Do** set every live number in tabular figures and every name or number that must be read fast at 900.
- **Do** ease motion with `cubic-bezier(0.16, 1, 0.3, 1)` and make things rise in (translateY 18px, scale 0.97) with short staggers; honor reduced motion by cutting bubbles and bursts entirely.
- **Do** keep the slumping candy-orange "CHOke" as the wordmark's one exception to white display type.

### Don't:
- **Don't** introduce dark mode, dark panels, or a dark esports stats overlay look.
- **Don't** use flat, matte, or grey fills, or neutral black shadows.
- **Don't** add a second typeface or uppercase-tracked label styles.
- **Don't** use em dashes in any copy.
- **Don't** show the Allstar name, logo, or any credit anywhere on the site.
- **Don't** use leaf green or sunset orange for decoration, links, or generic emphasis.
