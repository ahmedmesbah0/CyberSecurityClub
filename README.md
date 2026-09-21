# E-JUST Cyber Security Club

Responsive static website built with HTML5, CSS3, and vanilla JavaScript. Open `index.html` directly; no build step or dependencies are required.

## Files

- `index.html` — all club sections and learning content
- `style.css` — responsive layout, visual system, motion, and reduced-motion support
- `script.js` — navigation, accordions, scroll progress, terminal, counter, and canvas
- `assets/` — club and vendor logos, community QR, instructor portrait placeholder, and a locally stored hero photo

## Before publishing

The WhatsApp button is configured with the supplied community invite. The displayed QR was decoded at phone, tablet, and desktop sizes and matches that invite. LinkedIn and Facebook links are removed. If the invite changes, update the HTML link, `COMMUNITY_LINKS` in `script.js`, and `assets/qr-code.png` together. The instructor portrait remains a placeholder and the scoreboard is explicitly a demonstration.

The certification and partnership content is carried over from the provided project. Confirm the NSE pathway labels, Cisco voucher terms, and partner status with the club before presenting them as current program details.

Google Fonts supplies Inter and Manrope; system fonts are used when offline. The hero photograph is stored locally, so imagery works without an internet connection.

## Design

Art direction follows `~/.codex/skills/frontend-skill/SKILL.md`: a full-bleed infrastructure photograph, strong club identity, warm-white editorial sections, near-black technical sections, and university red. Motion respects the operating system's reduced-motion setting. Navigation supports keyboard focus containment and Escape; all section links work without JavaScript.

Hero photo source: https://images.unsplash.com/photo-1558494949-ef010cbdcc31 (Unsplash). This is illustrative infrastructure photography, not an E-JUST campus photograph.
