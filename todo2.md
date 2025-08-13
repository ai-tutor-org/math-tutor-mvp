# Shape Sorting Game — Single Todo (Complete “What” in Plain English)

This is the one source todo for what the game must do. It states behaviors and outcomes only (no code, libraries, or file‑level details). Use this to verify the final experience is exactly as intended.

## Overall Goals (What this game must achieve)
- Learners sort shapes into four labeled containers: triangles, circles, squares, rectangles.
- The experience ramps from demonstration to guided practice to independent practice to a final challenge, then ends with celebration and a recap.
- A clear, supportive help system assists learners after mistakes, but is limited in the final challenge to keep it challenging.

## Shape Set (What exists)
- Total shapes: 12
  - 3 triangles (3 broadly different variants — visually distinct; not a teaching objective)
  - 3 circlesStil
  - 3 rectangles
  - 3 squares
- Subtle visual variety across shapes:
  - Size: ~80%, ~100%, ~120%
  - Thickness: thin, normal, thick
- Initial layout: All shapes begin jumbled together in a pile at the top area.

## Containers (What the learner sees)
- Four containers (one per shape category) appear after tools are revealed.
- Each container has:
  - A visible label (triangle, circle, square, rectangle)
  - A counter that increments when a shape is correctly placed
- Interaction feel:
  - On hover, a container gently scales to ~1.1x while keeping its proportions (no distortion).

## Core Interaction Rules (What happens on actions)
- Correct drop:
  - Play a pleasant, higher‑pitch success pop (quieter than voice)
  - Increment the matching container’s counter
  - Shape stays in the container
- Incorrect drop:
  - Play a gentle, lower‑pitch failure bloop (quieter than voice)
  - Shape returns smoothly to the pile (~0.6s) with non‑overlapping, randomized placement
- Disabled shapes are visibly semi‑transparent and cannot be dragged.

## Timing and Feel (How the experience moves)
- Containers slide in on reveal: ~0.8s
- Incorrect return to pile: ~0.6s
- Completion celebration: ~3s
- Hover scaling on containers: ~1.1x (proportions preserved)

## Voice and Audio (What the learner hears)
- Tutor voice guides each phase and adapts to performance (e.g., encouragement after mistakes, praise after success).
- Game sounds are secondary to voice (lower volume than voice).
- If voice cannot play, continue with on‑screen text/notifications so the learner never gets stuck.

## Help System (When and how help appears)
- Attempts are tracked per shape type (triangle, circle, rectangle, square).
- Exact triggers:
  - 2nd wrong attempt for a shape type: show targeted intervention (overlay) with clear, shape‑specific guidance.
  - 3rd wrong attempt for the same shape type: auto‑place the shape in the correct container with encouraging feedback; count as help used.
- Final challenge help limit:
  - Exactly 2 helps total are available (shown as ⭐⭐ → ⭐ → 0)
  - After both helps are used, no more interventions appear (silent failure mode). Incorrect drops still return to the pile with failure sound.

## Phase‑by‑Phase Todos (Everything that must happen)

- Q1 — Introduction (Problem Setup)
  - Show all 12 shapes jumbled in a pile; all shapes disabled (semi‑transparent).
  - Tutor explains the problem context (e.g., “Oh no! Welcome to the Shape Factory…”).
  - Prominently show a start/help button (“I can help!”).
  - On click, proceed to tools reveal.

- Q2 — Tools Reveal (Show Containers)
  - Animate in the four containers (~0.8s) with labels.
  - Briefly explain what each container is for.
  - Shapes remain disabled until the demonstration begins.

- Q3 — Modeling (“I Do” with 1 shape)
  - System selects 1 square from the pile and sorts it into the square container automatically.
  - Tutor explains the square’s key property during the move.
  - Play the success sound when the square arrives in the container.
  - After the demo, transition to guided practice.

- Q4 — Guided (“We Do” with a Triangle)
  - Enable exactly 1 triangle. All other shapes remain disabled and semi‑transparent.
  - Tutor invites the learner to sort the triangle into the correct container.
  - On incorrect drop: play failure bloop; shape returns to pile (~0.6s).
  - On correct drop: play success pop; increment counter; proceed to Q5.
  - No star‑limited help here, but you may still present a short, encouraging hint if needed (not counted as a star).

- Q5 — Guided Success Transition
  - Acknowledge success in voice.
  - Brief, smooth transition setup to expand into practice.

- Q6 — Practice (3 shapes)
  - Enable exactly 3 shapes: 1 rectangle, 1 circle, 1 square. Others disabled.
  - Provide success/failure sounds and counter updates.
  - No targeted interventions yet (do not show the overlay here). Still track attempts internally.
  - After the 3 are sorted correctly, proceed to intervention‑enabled practice.

- Q7 — Practice with Interventions (Enable Help)
  - Keep the same 3‑shape practice flow.
  - On 2nd wrong attempt for a type: show targeted intervention overlay with shape‑specific guidance, and visually indicate the correct container (e.g., glow/attention cue).
  - On 3rd wrong attempt for that type: auto‑place the shape with encouraging feedback; count help used.
  - After successfully placing the current set, proceed to final challenge setup.

- Q8 — Targeted Intervention Experience (Detail the Guidance)
  - Guidance must reference the mistake and explain the property simply (e.g., “A triangle has 3 sides”).
  - Draw attention to the correct container without being overwhelming.
  - Keep the overlay focused and readable; allow the learner to continue immediately after.

- Q9 — Automated Correction (When still struggling)
  - If the learner reaches a 3rd wrong attempt after an intervention for the same type, automatically move the shape to the correct container.
  - Play success sound, increment counter, and speak encouraging feedback (e.g., “Great! Let’s keep going.”).
  - Count this as help used.

- Q10 — Final Challenge Setup (8 remaining shapes + Stars)
  - Reveal the remaining 8 shapes (2 of each type) and enable them.
  - Show exactly 2 helps available as ⭐⭐. On each help use, reduce: ⭐⭐ → ⭐ → 0.
  - Reset attempt counters so the challenge starts fresh.
  - Tutor frames the challenge clearly and positively.

- Q11 — Final Challenge (All remaining shapes)
  - All 8 shapes are active.
  - Interventions work exactly as before but are limited by stars:
    - 2nd wrong attempt for a type: show targeted intervention overlay, if at least 1 star remains.
    - 3rd wrong attempt for that type: auto‑place and consume a star (help used).
  - When stars reach 0: interventions stop completely (silent failure mode). Incorrect = failure sound + return to pile; no overlay, no auto‑place.
  - Continue attempt tracking per type for performance stats.
  - When all shapes are sorted, proceed immediately to completion.

- Q12 — Completion (Celebrate + Performance‑Based Voice)
  - Play a ~3‑second celebration.
  - Performance‑based tutor voice:
    - Perfect (0 helps used): “A perfect score! You’re a true shape superstar!”
    - Help used (≥1): “All sorted! Fantastic job finishing the puzzle…”
  - Smoothly transition to the recap.

- Q13 — Recap (Summary and Exit)
  - Show a clean summary view of the four shape categories with a simple visual for each and a clear, child‑friendly phrasing of key properties.
  - Provide a clear “Next” action; also support automatic navigation back to the lesson/home after the recap.
  - End the game neatly.

## Error‑Resilience (What must still work)
- If speech or sound cannot play, continue with clear on‑screen feedback and a notification.
- Prevent stuck states (e.g., a shape never becomes draggable again, overlay never dismisses, counters stop updating).
- Rapid actions should not break the experience (quick drags/drops, repeated clicks).

## Data and Outcomes (What is recorded and concluded)
- Track wrong attempts per shape type to drive help triggers.
- Track total helps used (0, 1, or 2 in the final challenge; helps from earlier phases also count toward performance evaluation).
- Record total attempts and whether the run is perfect (0 helps used) for performance‑based voice.

## Visual/Interaction Consistency (What it should feel like)
- Clean, clear visuals that match a dark‑themed app.
- Containers preserve aspect ratio when scaling; no visual distortion.
- Disabled shapes are obviously inactive (semi‑transparent, non‑draggable).
- Jumbled pile always looks intentional: when shapes return, they re‑enter the pile without overlapping and with light randomness.

## Done Criteria (All must be true)
- All 13 phases behave exactly as specified above.
- Shape counts per phase are exact: Q3 = 1 (square), Q6 = 3 (rectangle, circle, square), Q11 = 8 remaining (2 of each type). Total = 12.
- Help triggers are precise: 2nd wrong attempt = targeted intervention; 3rd wrong attempt = auto‑place (consumes a help). Final challenge has exactly 2 helps.
- Sounds, voice, and timings are as specified: ~0.8s containers, ~0.6s returns, ~3s celebration; sounds quieter than voice.
- Final celebration and performance‑based messaging show correctly; recap is clear and exits properly.
- Edge cases handled gracefully; no stuck states; notifications appear if audio/voice fail.

## Checklist
- [ ] Q1 Introduction
- [ ] Q2 Tools Reveal
- [ ] Q3 Modeling (1 square)
- [ ] Q4 Guided (1 triangle)
- [ ] Q5 Guided Success Transition
- [ ] Q6 Practice (3 shapes)
- [ ] Q7 Practice with Interventions
- [ ] Q8 Targeted Intervention Experience
- [ ] Q9 Automated Correction
- [ ] Q10 Final Challenge Setup (8 shapes + ⭐⭐)
- [ ] Q11 Final Challenge (help limit enforced)
- [ ] Q12 Completion (celebration + performance voice)
- [ ] Q13 Recap (summary + exit)
- [ ] Error‑resilience scenarios verified
- [ ] Data and outcomes verified
- [ ] Visual/interaction consistency verified 