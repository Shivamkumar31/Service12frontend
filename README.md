# ServiceHub Frontend (Next.js)

Connects to the ServiceHub backend (`servicehub-backend`) you already have running.
Structure/UI is kept plain and functional per request — every screen wires up a
real backend endpoint. Polish/design pass can come later.

## 1. Setup

```bash
npm install
cp .env.local.example .env.local
```

Edit `.env.local` if your backend runs somewhere other than `http://localhost:5000`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 2. Run

Start the backend first (`npm run dev` in `servicehub-backend`, on port 5000),
then:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

## 3. What's wired up

| Page | Route | Backend endpoints used |
|---|---|---|
| Home | `/` | `GET /categories` |
| Register | `/register` | `POST /auth/register` |
| Login | `/login` | `POST /auth/login` |
| Phone OTP login | `/otp-login` | `POST /auth/otp/request`, `POST /auth/otp/verify` |
| Browse workers | `/workers` | `GET /categories`, `GET /workers/nearby` |
| Worker profile + book | `/workers/[id]` | `GET /workers/:id`, `POST /bookings` |
| Become a worker | `/become-worker` | `POST /workers/apply` (multipart, photo optional) |
| Customer dashboard | `/dashboard` | `GET /bookings/my`, `PATCH /bookings/:id/cancel`, `PATCH /users/me/location` |
| Worker dashboard | `/worker/dashboard` | `GET /workers/me/bookings`, `PATCH /bookings/:id/status`, `PATCH /workers/me` |
| Admin panel | `/admin` | `GET /admin/workers/pending`, `PATCH /admin/workers/:id/verify` |

Auth: JWT stored in `localStorage` (`sh_token`), sent as `Authorization: Bearer`
on every authenticated call via `lib/api.js`. `lib/auth-context.js` re-fetches
`/auth/me` on load so refreshing the page keeps you logged in.

## 4. Dummy images

No real photo pipeline needed to test the flow — everywhere a worker photo
would show:
- If Cloudinary `photoUrl` exists (worker uploaded one in `/become-worker`), it's shown.
- Otherwise a generated initial-avatar (`components/DummyAvatar.js`) or a
  `placehold.co` placeholder is shown instead. Nothing breaks if you skip the
  photo field when applying as a worker.

## 5. How errors are shown

Every backend response follows `{ success, message }`. `lib/api.js` throws
`Error(message)` on any non-2xx or `success: false` response, and every page
catches it and renders it inline via `<ErrorText>` — so backend validation
messages (e.g. "Cannot cancel a booking that is already ACCEPTED") show up
directly in the UI without you needing to open devtools.

## 6. Known rough edges (matches backend note from earlier — not fixed here)

- Google login button isn't built into the UI yet since it needs a real
  `GOOGLE_CLIENT_ID` + a Google sign-in button/SDK — OTP and email/password
  cover login for now.
- No image cropping/compression on the worker photo upload — just a raw file input.
- No pagination on `/workers/nearby` or bookings lists — fine for testing, would
  need it before real data volume.
- Worker `/workers/:id` route will 500 if you pass a non-ObjectId string
  directly in the URL (a backend validation gap noted in the previous
  Swagger test) — the frontend never does this itself since IDs always come
  from real API responses, but worth fixing backend-side later.

## 7. Full test flow (mirrors the backend README)

1. Register a customer at `/register` (allow location access when prompted).
2. Go to `/become-worker`, apply with a category + location (photo optional).
3. In MongoDB, promote that same account to `ADMIN` (see backend README) —
   or register a **second** account and promote that one, so you can act as
   admin and worker separately.
4. Log in as admin, go to `/admin`, click **Verify** on the pending worker.
5. Go to `/workers`, the verified worker should now appear.
6. Log in as a **different** customer account, open the worker's profile, and
   submit a booking.
7. Log back in as the worker, go to `/worker/dashboard`, **Accept** the booking,
   then walk it through **Start job → Mark completed**.
8. Log back in as the customer, `/dashboard` should reflect the updated status.










