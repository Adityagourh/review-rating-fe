# Rately — Review & Rating Frontend

A standalone React frontend for the `review_rating` Express/MongoDB API. It owns its
own `package.json`, so this whole folder can be copied anywhere and run independently.

## Stack

- **Vite + React 18** — fast dev server, plain JS (no build-time TS)
- **React Router v6** — routing, protected routes
- **Tailwind CSS** — dark, glassmorphism/gradient design system (see `tailwind.config.js`)
- **Framer Motion** — page transitions, hover/entry animations
- **Axios** — API client with an auth-token interceptor
- **react-hot-toast** — notifications
- **jwt-decode** — reads the user info embedded in the backend's JWT
- **lucide-react** — icon set

## Getting started

```bash
cd review_rating_fe
npm install
cp .env.example .env   # already present with sensible defaults
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment

`.env`:

```
VITE_API_URL=http://localhost:9000
```

Point this at wherever the `review_rating` backend (this repo's root, `npm start`,
default port `9000`) is running. No other backend changes are required.

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page — hero, search, featured companies |
| `/companies` | Browse/search all companies (A–Z filter + free text) |
| `/companies/:id` | Company profile — details, reviews, add a review |
| `/companies/add` | Add a new company (requires login) |
| `/login`, `/register` | Auth |
| `/forgot-password` | Request a password-reset email |
| `/user/reset-password/:id/:token` | Matches the link the backend emails (see `emailService`) |

## Notes on the backend contract

- Registration and "add company" both **require an image upload** — the backend
  controllers dereference `req.file.filename` unconditionally, so the forms treat a
  photo as mandatory to avoid a 500.
- Login tokens are short-lived (backend signs them with `expiresIn: "2m"`). The
  auth context detects an expired token and logs the user out client-side instead of
  sending a stale one; log back in if a request suddenly 401s.
- `rating` is stored as a `String` on the backend, so the star-picker's numeric value
  is stringified before POSTing to `/comment/create`.
- The reviews endpoint populates `userId` with `userName` + `profilPic` (typoed field
  name in the backend's `.populate(... select: "userName profilPic")` — the actual
  schema field is `profilePic`), so reviewer avatars fall back to initials. This is a
  backend detail, not something this frontend can fix on its own.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
