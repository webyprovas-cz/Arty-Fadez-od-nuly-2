# Arty Fadez — Barbershop + rezervace

Web pro barbershop Arty Fadez (Štěpařská, Praha), teď s **plně funkčním rezervačním systémem** — stejný vzor jako `third_website` a `arty-fadez` (statické HTML/CSS/JS + Vercel serverless funkce + Neon Postgres, Basic Auth admin).

⚠️ Původně jednostránkový statický web publikovaný na GitHub Pages. Rezervace potřebují serverless funkce, které GitHub Pages neumí — **od teď musí být nasazeno na Vercelu**, GitHub Pages už bude ukazovat jen starou statickou verzi bez fungujících rezervací.

## Struktura

- `index.html`, `booking.html` — homepage a samostatná rezervační stránka (3-krokový wizard: služba → datum a čas → potvrzení)
- `style.css`, `script.js`, `booking.js` — sdílené styly, nav/animace, a logika rezervačního wizardu
- `api/` — serverless funkce: `sloty` (GET volné termíny), `rezervace` (POST nová rezervace), `admin-bookings` (GET/DELETE, Basic Auth), `admin-blokace` (POST blokace termínu, Basic Auth), `_hodiny` (sdílená otevírací doba + generování slotů)
- `admin/index.html` — admin nástěnka (`/admin`, chráněno přes `middleware.js` Basic Authem)
- `scripts/init-db.mjs` — vytvoří tabulku `bookings` v Neon Postgres

## Lokální vývoj

1. `npm install`
2. `vercel env pull .env.local` (po `vercel link` a `vercel integration add neon`)
3. `node scripts/init-db.mjs` — vytvoří tabulku `bookings`
4. `vercel dev` — spustí web i API lokálně

## Nasazení

Vlastní Vercel projekt s vlastní Neon Postgres integrací — **databáze se nesdílí** s ostatními weby (viz `my_websites/README.md`). Env proměnné (`DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`, případně `RESEND_API_KEY`/`EMAIL_FROM`/`OWNER_EMAIL`) se nastavují ve Vercel dashboardu.

## Otevírací doba a ceník

Otevírací doba je v `api/_hodiny.js`. Seznam služeb a cen je jen v HTML/`booking.js` — žádná DB tabulka služeb.
