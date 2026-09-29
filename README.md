# KnowValTE website

Public website and CMS for the KnowValTE project (M4 deliverable), with a KV-HUB
placeholder page. The KV-HUB itself (accounts, self-assessments, training
pathways, resource directory, licensing register) will be built in this app later.

Rails 8.1 defaults (SQLite, Solid Queue/Cache/Cable, Propshaft, built-in
authentication, Kamal) plus:

- [Inertia Rails](https://inertia-rails.dev) with React 19 and TypeScript,
  bundled by [Vite Ruby](https://vite-ruby.netlify.app). Every screen is an
  Inertia page in `app/frontend/pages`.
- [Puck](https://puckeditor.com) (`@puckeditor/core`) as the visual page editor.
- [Tailwind CSS](https://tailwindcss.com) v4 and [shadcn/ui](https://ui.shadcn.com)
  components (Base UI primitives, "nova" style) in `app/frontend/components/ui`.
  Add more with `npx shadcn@latest add <component>`; they're our code, so edit freely.

## Development

Requirements: Ruby and Node.js (see `.ruby-version` and `.node-version`).

```sh
bundle install
npm install
bin/rails db:prepare
ADMIN_EMAIL=you@example.org ADMIN_PASSWORD=choose-a-dev-password bin/rails db:seed
bin/dev            # or PORT=3100 bin/dev if port 3000 is taken
```

- Site: <http://localhost:3000>. Admin: <http://localhost:3000/admin>
  (sign in at `/session/new`).
- Checks: `bin/rails test`, `npm run check` (TypeScript), `bin/rubocop`,
  `bin/brakeman`, `bin/bundler-audit`.

## How it fits together

- **Pages** (`Page` model): title, slug, menu (`main`, `footer` or none),
  position, published flag, meta description, and `content`, the Puck data as
  JSON. `/` is the page with slug `home`; other pages are served at `/<slug>`
  by the catch-all route at the end of `config/routes.rb`. Drafts are visible
  only to signed-in users. `db/seeds.rb` creates the page tree from the
  requirements and never overwrites pages edited in the CMS.
- **Editing**: `/admin/pages` lists pages. *Settings* edits the page fields;
  *Edit content* opens the full-screen Puck editor
  (`app/frontend/pages/Admin/Pages/Editor.tsx`), whose *Publish* button
  PATCHes the Puck data to `Admin::PagesController#publish`.
- **Puck components** are defined once in `app/frontend/puck/config.tsx` and
  used both by the editor and by the public renderer
  (`app/frontend/pages/Pages/Show.tsx`, via Puck's `<Render>`). Add new blocks
  there. Current blocks: Hero, Page header, Heading, Text (rich text), Button,
  Columns and Section (both hold other blocks), Card, Image, YouTube video and
  Download.
- **Uploads**: image and document fields (`app/frontend/puck/UploadField.tsx`)
  upload to `Admin::UploadsController`, which stores them in Active Storage and
  returns a permanent blob URL that is saved in the page content. Allowed types
  and the size limit are in the controller.
- **Layouts**: `app/frontend/layouts` (public site and admin), picked by page
  name in `app/frontend/entrypoints/inertia.tsx`. Menus and social links are
  shared props from `InertiaController`; social links are in `config/site.yml`.
  Styles are Tailwind classes in the components. `app/frontend/styles/app.css`
  holds the theme (colours as CSS variables, e.g. `--primary`), base styles and
  the `page-container` utility. Rich text uses the Tailwind typography plugin.
- **Users**: Rails' authentication generator (`User`, `Session`, password
  reset). There is no sign-up; create users in the console or with the seed
  variables above. Every signed-in user can edit everything.
- **Accessibility**: skip link, labelled landmarks, `aria-current` in the menu,
  visible focus, reduced motion. Each page gets one `<h1>` (from a Hero or Page
  header block, or the page title). Images need alt text unless marked
  decorative. Downloads show file type and size. YouTube uses the no-cookie domain.
- **Analytics**: [Umami](https://umami.is) (cookieless, so no consent banner
  is needed). The script tag is added only when `UMAMI_SCRIPT_URL` and
  `UMAMI_WEBSITE_ID` are set.

## Deployment

`config/deploy.yml` is the Rails default Kamal config: fill in the server,
domain and registry. The Docker image installs Node only in the build stage to
run the Vite build. SQLite databases and uploads live in the `storage/` volume,
so back up that volume.

## Open items

- News and events as structured content (list pages, dates, archive), and a
  contact form with spam protection.
- Brand colours, fonts and logo (theme variables in `app/frontend/styles/app.css`), favicon in
  `public/`, and the official EU emblem and funding statement in
  `app/frontend/layouts/SiteLayout.tsx`.
- Real social media URLs (`config/site.yml`).
- Inertia SSR, so search engines and no-JS visitors get the rendered HTML
  (the public page currently renders in the browser).
- Languages, if the site needs more than English.
- Editor roles, if not every editor should manage everything.
- Page content, including legal notice, privacy notice and accessibility statement.
