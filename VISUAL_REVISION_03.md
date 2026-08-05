# Visual Revision 03

## Discover by Wellness Focus
- Replaced technical `Focus 01`, `Focus 02`, etc. labels with professional collection descriptors.
- Retained the subtle `01 / 08` progress counter only.

## Shop by Routine
- Preserved each complete source image using an uncropped `object-contain` foreground.
- Added a soft blurred fill behind the original image so the frame remains visually full.
- Matched the section-intro and experience-card column proportions.
- Aligned the timeline, range control, labels, and card content to the same horizontal gutters.

## Ingredient Library
- Removed horizontal and vertical scrolling from the book stage.
- Added a responsive single-column folio layout below 900px rather than forcing a wide book viewport.
- Disabled 3D page turning in the narrow single-page layout to prevent hidden overflow or clipped animation.
- Removed the exit-opacity phase from the turning sheet.
- Animated pages and final pages now use the identical content layout, eliminating the compact-to-full flash.
- Increased monograph labels, botanical names, scientific names, body copy, constituent tags, benefit text, plate labels, and responsible-use notes.

## Site-wide typography
- Increased all major section-opening headings and eyebrow labels.
- Applied a restrained readability increase to undersized 8–15px utility and supporting copy across the website.
- Added global horizontal overflow protection.

## Validation
- Project source/import/image validation passed.
- All TypeScript and TSX source files passed syntax transpilation checks.
- A production build could not be completed because the dependency registry returned HTTP 503 responses during package installation.
