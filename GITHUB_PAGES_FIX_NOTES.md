# v8.12 GitHub Pages fix

- Source files are UTF-8 clean.
- Static GitHub Pages build sets NEXT_PUBLIC_STATIC_EXPORT=true.
- Public build removes API/admin only inside GitHub Actions; source code keeps local admin/API.
- Public homepage avoids heavy client search/form widgets in static preview.
- Prisma is dynamically loaded only outside static export, preventing GitHub Pages from bundling server DB code.
- The workflow rejects mojibake strings before deployment.
