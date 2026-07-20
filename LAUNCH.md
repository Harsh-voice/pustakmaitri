# Pustak Maitri — Launch & Go-Live Guide

This app is built and verified. The steps below take it from "works locally"
to "live and taking real payments." Items marked **[client]** need real
business information or account access.

## 1. Fill in your business details **[client]**

Edit **one file** — `src/lib/site-config.ts` — and replace every value marked
`TODO(client)`:

- Legal proprietorship name (exactly as on your Udyam / PAN)
- Proprietor full name, Udyam Registration Number
- Contact phone, WhatsApp, full postal address
- Grievance officer name
- Jurisdiction city

Then run the gate — it must pass before enabling live payments:

```bash
npm run check:placeholders   # fails while any TODO(client) remains
```

The email (`harsh@iskcon-navimumbai.org`) and shipping/refund defaults
(₹49 flat, free above ₹499, 5–8 day delivery) are pre-filled — adjust if needed.

## 2. Database (Supabase or Neon — free tier)

1. Create a Postgres database. Copy two connection strings into your env:
   - `DATABASE_URL` — the **pooled** connection (used by the app).
   - `DIRECT_URL` — the **direct** `:5432` connection (used by migrations).
   - For Supabase transaction pooler, append `?pgbouncer=true` to `DATABASE_URL`.
2. Apply the schema and seed the catalogue:

```bash
npm run db:deploy          # prisma migrate deploy
CATALOGUE_XLSX=./data/Pustakmaitri_all_Book_Catalogue.xlsx npm run db:seed
```

Put the real `.xlsx` in `data/` first (it is git-ignored). Re-running the seed
is safe — it is idempotent.

## 3. Deploy to Vercel

1. Import the repo into Vercel. Build command and `prisma generate`
   (via `postinstall`) run automatically.
2. Set environment variables (Project → Settings → Environment Variables) —
   see `.env.example`. Use **Razorpay TEST keys first**:
   - `DATABASE_URL`, `DIRECT_URL`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `ADMIN_USER`, `ADMIN_PASS`
   - `BLOB_READ_WRITE_TOKEN` (create a Vercel Blob store for cover uploads)

## 4. Razorpay dashboard setup **[client]**

- Complete **KYC** (needs: Udyam certificate, PAN, Aadhaar, cancelled cheque
  whose name matches PAN, current bank account for settlements).
- **Settings → Payment Capture:** enable **auto-capture** (so
  `payment.captured` fires and orders auto-confirm).
- **Settings → Webhooks:** add `https://<your-domain>/api/webhook/razorpay`,
  subscribe to `payment.captured` and `payment.failed`, and set the secret to
  the same value as `RAZORPAY_WEBHOOK_SECRET`.

## 5. Test end-to-end (test mode)

- Add to cart → checkout → pay with a Razorpay **test** method
  (UPI `success@razorpay`, card `4111 1111 1111 1111`). Confirm `/order/success`
  and that the order shows **paid** in `/admin`.
- Try `failure@razorpay` and confirm `/order/failed`.
- Close the browser mid-payment and confirm the webhook still marks it paid.

## 6. Pre-launch checklist (Razorpay approval)

- [ ] All 6 legal pages live, real content, both languages, linked in footer.
- [ ] Business/legal name on About + Contact **matches KYC / Udyam docs**.
- [ ] Contact page has a working email, phone, full address, grievance officer.
- [ ] Refund policy states clear windows/timelines (not "no refunds").
- [ ] Shipping policy states charges + delivery timeline.
- [ ] Terms: online-only, no COD, GST-exempt, jurisdiction filled.
- [ ] `npm run check:placeholders` passes; `npm run test`, `npm run typecheck`,
      `npm run build`, `npm run check:i18n`, `npm run check:legal` all green.
- [ ] `sitemap.xml` + `robots.txt` reachable; site on HTTPS.

## 7. Go live

- Switch Vercel env to **live** Razorpay keys + live webhook secret.
- Do one small **real** transaction and refund it to confirm settlement.
- Confirm real stock levels (or that "in stock" is acceptable) with the client.

---

### Local development quick start

```bash
# Postgres (Docker) — or use a Neon/Supabase branch
docker run -d --name pustak-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=pustak -e POSTGRES_DB=pustakmaitri postgres:16

cp .env.example .env        # fill DATABASE_URL/DIRECT_URL
npm install
npm run db:migrate
npm run db:seed             # imports data/*.xlsx, else a synthetic sample
npm run dev
```

Admin panel: `/<locale>/admin` (e.g. `/mr/admin`), guarded by
`ADMIN_USER` / `ADMIN_PASS`.
