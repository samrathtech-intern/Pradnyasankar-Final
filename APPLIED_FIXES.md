# Applied landing-page fixes

- Rebuilt the “Why Pradnyasanskar” area as a single-line, continuously looping typographic carousel inspired by the supplied Webflow reference.
- Removed the hero pause/play button while retaining manual slide indicators and automatic rotation.
- Rebuilt Featured Collection product imagery on plain white image areas with no generated gradients, colour stages, rings, overlays, or artificial image backgrounds.
- Rebuilt Browse by Format cards with the same plain white image treatment and used the transparent Vitamin C PNG supplied inside the archive.
- Updated product imagery inside search, saved products, wellness bag, quick view, and reusable product cards to use white areas and contain-fit display.
- Reworked the daily routine flow into a responsive six-card grid, ordered from Morning through Evening Calm, eliminating clipped final cards.
- Replaced the hidden/click-to-reveal product-information structure with six fully visible information cards.
- Made the Ingredient Library interactive: selecting any ingredient updates the large featured panel and displays key nutrients/plant actives plus common wellness roles.
- Rebuilt the Everyday Wellness Stories grid into equal responsive cards so “Everyday nourishment” and other content cannot be cropped.
- Removed white text over the Wellness Focus image by separating the image and dark-colour text into distinct panels.

## Validation

- TypeScript/TSX syntax parsing passed for all source files.
- Local import and public image-reference validation passed.
- A full Next.js production build could not be executed in the editing runtime because the archive did not include `node_modules` and the runtime could not resolve the npm registry.
