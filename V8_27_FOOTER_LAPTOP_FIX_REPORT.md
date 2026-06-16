# V8.27 Footer Agile Link + Laptop Hero Anti-Overlap Fix

## Scope
- Removed the public footer link labeled `Админ панель`.
- Kept the admin route itself available by direct URL: `/admin/login/`.
- Restyled the public `сделано Agile business` link as a fully blue/cyan oval with bright red text.
- Added laptop-only hero layout corrections for 1024–1439px widths so the long hero headline no longer overlaps the 3D visual block.

## Design preservation
- Public site structure unchanged.
- 3D scene unchanged except laptop sizing rules.
- Program catalog unchanged.
- Admin panel functionality unchanged.
- Agile business link remains in footer and opens `https://www.agile-business-pro.com/`.

## Responsive correction
The hero grid now uses laptop-specific CSS overrides:
- wider safe text column;
- slightly smaller hero title on laptops;
- capped 3D scene width;
- smaller inner 3D headline/document card sizing on laptop screens.

This targets the issue visible in the laptop screenshot where the hero title enters the visual column.
