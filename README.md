# HIREBEAR

Recruiter database marketplace. Next.js 14 (App Router) + TypeScript + MongoDB/Mongoose + NextAuth + Cashfree.

## What's built

- **Models**: `User`, `Product`, `Order`, `Purchase`, `Referral`, `RewardStatus` — matching the statuses and ownership rules from the spec.
- **Auth**: email/password via NextAuth Credentials provider, bcrypt-hashed passwords, JWT sessions.
- **Homepage**: server-rendered, pulls active products live from MongoDB (no hardcoded prices).
- **Checkout → Cashfree**: `/api/checkout` creates a `PENDING` order and a Cashfree payment session; the client hands off to Cashfree's hosted Checkout SDK.
- **Webhook**: `/api/webhooks/cashfree` verifies the HMAC signature, and *only* on a verified `SUCCESS` marks the order `PAID`, creates the `Purchase`, credits any pending referral, and sends the confirmation email. Nothing is trusted from the client redirect.
- **Downloads**: `/api/purchases/[id]/download` re-checks ownership + status on every request (IDOR-safe) and returns a 5-minute signed URL from `/api/purchases/download-file/[token]`, which verifies the token and streams the file — never a public file path. `FileStorageService` reads from `private-files/` at the project root (outside `public/`, so Next never serves it directly), which is bundled with the app on deploy — good enough for launch without standing up S3 first.
- **Referrals**: signup records a `PENDING` referral; it only becomes `SUCCESSFUL` from the webhook, after payment is verified — never from the frontend. Self-referrals and duplicate credits are blocked in `ReferralService`.
- **Dashboard**: stats, My Databases (working download button), Orders (full history with download counts), Referrals (progress bar, copy link, Web Share + WhatsApp/Telegram/LinkedIn/Email fallbacks), backed by the `/r/[code]` entry link that redirects to signup — clicks are never counted, only a webhook-verified paid order is.

- **Admin panel** (`/admin/*`): metrics overview (users, revenue, sales split, referral conversions, downloads); product CRUD with `.xlsx` upload/replace and enable/disable (new products start inactive until a real file is uploaded); full orders table; referral funnel + top referrers + a campaign settings form (required referrals, reward product, campaign on/off) backed by a single `ReferralConfig` document that signup now reads instead of a hardcoded default.

### Becoming an admin

There's no invite flow yet — sign up normally, then flip the flag directly in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```

## What's stubbed / left for you

- **Rate limiting** — noted with TODOs on signup/login; add a limiter (e.g. Upstash) before launch.
- **S3/R2 storage** — `FileStorageService` currently writes to local disk; implement the same interface against your bucket.
- **Real email provider** — `EmailService` logs to console; swap in Resend/SES.
- **Actual recruiter data** — no Excel files are included. Upload files you're licensed to redistribute and point each `Product.filePath` at them (see `scripts/seed.ts`).

## Launch checklist: adding your recruiter Excel files

1. Drop the `.xlsx` files into `private-files/products/` — e.g. `private-files/products/basic-recruiters.xlsx`. This folder is committed to git and deployed with the app, but sits **outside `public/`**, so Next.js never serves it at a guessable URL — the only way to it is through the signed-download route, after an ownership check.
2. In `scripts/seed.ts` (or via `/admin/products`), set each product's `filePath` to match — `"products/basic-recruiters.xlsx"`.
3. Run `npx tsx scripts/seed.ts`, then flip the product to **Active** in `/admin/products`.
4. To replace a file later at this stage, just overwrite it in `private-files/products/` and redeploy — the `/admin/products` "Upload" button writes to local disk, which works in `npm run dev` but **not** on Vercel's read-only filesystem, so treat git as the source of truth for files until you move to S3/R2.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in MongoDB URI, NextAuth secret, Cashfree keys
# add your .xlsx files to private-files/products/ — see "Launch checklist" above
npx tsx scripts/seed.ts      # creates Basic (₹299) and Standard (₹499) products
npm run dev
```

You'll need a Cashfree sandbox account (App ID + Secret Key + webhook secret) to test checkout end-to-end — payments won't work without them, but the homepage, auth, and dashboard will.

## Security notes already in the code

- Passwords hashed with bcrypt (cost 12), never logged or returned.
- Webhook signature verified with `crypto.timingSafeEqual` before any order is trusted.
- Download route checks `userId` ownership + `status === "ACTIVE"` server-side on every call.
- No product file path or bucket URL is ever sent to the client — only a time-boxed signed link.
# hirebear
