# v5.9 — UI corrections from real screenshots

Implemented changes:

1. Enlarged the main hero visual block.
   - Increased right-side hero visual width and height.
   - Expanded the executive card, certificate card and background rings.
   - Shifted the visual weight further to the right side.

2. Restored motion for the hero visual elements.
   - Rings rotate.
   - Main card floats.
   - Certificate floats.
   - Chips move.
   - Mini cards move subtly.
   - Bar columns pulse vertically.
   - Platform breathes subtly.

3. Improved readability across the site.
   - Secondary copy text made larger.
   - Small descriptive text increased globally inside main content.
   - Stat-card descriptions enlarged.
   - Form text, labels and helper copy enlarged.

4. Fixed header collisions.
   - Header content width expanded.
   - Logo moved closer to the left edge on large screens.
   - Long logo subtitle is hidden until very wide screens.
   - Desktop navigation now appears only when there is enough width.
   - Menu labels stay on one line.

5. Fixed lead form collisions.
   - The form fields are no longer forced into a narrow two-column layout.
   - Program picker is now a full-width row inside the form.
   - Inputs have larger height and safer spacing.
   - Program picker text is larger and easier to read.

Validation notes:
- The patch is based on the v5.8 final-performance project.
- The changes do not remove database, Prisma, admin panel, leads, catalog or PDF documents.
