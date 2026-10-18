# Sprint 3 report — Sessions, clone, plans & calendar

Copy this file to `docs/reports/sprint-03.md` in **your** repo and fill the blanks. Keep it a process log: no pasted source, no secrets, no `.env` values. Say **session**, not workout.

| Field        | Your answer |
| ------------ | ----------- |
| **Dates**    | 15.10.2026 |
| **Names**    | Kimmo Silvennoinen |
| **Repo URL** | https://github.com/ckisi001-xamk/exercise-progress-tracker |
| **Branch**   | main |

Tickets: [sprint-03-tickets.md](../tickets/sprint-03-tickets.md) · Index: [../README.md](../README.md)

## Sprint goal

From the tickets: owners CRUD **sessions** with **planned** and **actual** measurements; **clone** keeps planned and clears actuals (source edits do not cascade); plans use **`plan_id`** (no junction) ordered by **`session_at`**; **calendar** month+week over dated sessions; User A cannot open User B’s session/plan/goal/calendar by ID; Dashboard shows only the current user’s recent sessions.

Tavoitteena toteuttaa moniharjoitteiset treenisessiot suunnitelluilla ja toteutuneilla mittaustuloksilla, syvä snapshot-kloonaus, harjoitusohjelmat suoralla plan_id-viitteellä ilman välitaulua, sekä kalenteri session_at-aikaleimojen pohjalta. Tähän asti tavoite on saavutettu backendin osalta täysimääräisesti; sessioiden CRUD, mittausarvojen eheys, suodatukset ja duplikointi toimivat tiukan IDOR-eristetysti.

## Tickets

For **each** ticket fill **Status** and **PR / commit**.

Fill **Demonstration** only where this template includes that section. Follow the numbered steps exactly. Store images under `docs/reports/images/sprint-03/` using the suggested filename. Crop tokens.

For **every** ticket: set **Used AI?** to `Yes` or `No`. Write the sprint-level **AI usage** reflection at the end of this report (not under each ticket).

Skip stretch tickets you did not do.

### S3-01 — Session models and migration (Must)

- **Status:** Done
- **PR / commit:** 8cea092 dc6f4f7 5796fd0
- **Used AI?** Yes

### S3-02 — Goal model and migration (Must)

- **Status:** Done
- **PR / commit:** 5796fd0
- **Used AI?** Yes

### S3-03 — Plan model and migration (Must)

- **Status:** Done
- **PR / commit:** 5796fd0
- **Used AI?** Yes

### S3-04 — Sessions CRUD API (Must)

- **Status:** Done
- **PR / commit:** d8d9a34
- **Demonstration:**
  1. **Do this:** In `/docs`, authorize, create a session, list sessions.
  2. **Capture:** Create + list responses.
  3. **Must show:** Session owned by the authenticated user.
  4. **Must not show:** Full Bearer token.
  5. **Save as:** `docs/reports/images/sprint-03/s3-04-sessions-crud.png`
  6. **Caption:** WorkoutSession CRUD -rajapinta testattu ja todennettu. Käyttäjäeristys toimii ja sessiotiedot palautuvat relaatioineen ilman token-vuotoja.
- **Used AI?** Yes

### S3-05 — Session measurements planned and actual (Must)

- **Status:** Done
- **PR / commit:** d8d9a34
- **Demonstration:**
  1. **Do this:** Save measurements with `planned_value` and/or `actual_value` using catalog `unit_type_id` (e.g. strength `per_set`).
  2. **Capture:** Request/response showing both fields where relevant.
  3. **Must show:** Catalog-keyed planned/actual values—not free-text units.
  4. **Must not show:** Tokens.
  5. **Save as:** `docs/reports/images/sprint-03/s3-05-measurements.png`
  6. **Caption:** Sarjakohtaiset suunnitellut (80.000) ja toteutuneet (85.000) mittausarvot sidottu katalogin unit_type_id-avaimella ilman vapaatekstikenttiä.
- **Used AI?** Yes

### S3-06 — Session filters (Must)

- **Status:** Done
- **PR / commit:** edd6308
- **Demonstration:**
  1. **Do this:** Apply filters (`from`/`to`, status, unscheduled, and/or `plan_id`) in `/docs` or UI.
  2. **Capture:** Filtered result.
  3. **Must show:** List matching filters for the current user only.
  4. **Save as:** `docs/reports/images/sprint-03/s3-06-filters.png`
  5. **Caption:** Sessioiden suodatus status=completed -parametrilla todennettu. Palauttaa vain kirjautuneen käyttäjän valmistuneet sessiot ilman ristiinnaapuruutta.
- **Used AI?** Yes

### S3-07 — Clone session API (Must)

- **Status:** Done
- **PR / commit:** edd6308
- **Demonstration:**
  1. **Do this:** Create a source session with planned values. Call `POST /sessions/{id}/clone`. Show clone has planned copied and actuals null/`source_session_id` set. Then edit the source (add an item) and show the clone unchanged.
  2. **Capture:** Clone response + proof of isolation (source vs clone).
  3. **Must show:** Snapshot clone + no cascade after source edit.
  4. **Save as:** `docs/reports/images/sprint-03/s3-07-clone.png`
  5. **Caption:** Sessio monistettu: uusi id luotu, status asetettu muotoon planned, toteumat nollattu (actual_value: null) ja audit trail säilytetty source_session_id-viitteellä.
- **Used AI?** Yes

### S3-08 — Plans CRUD and attach API (Must)

- **Status:** Done
- **PR / commit:** 3dc880f
- **Demonstration:**
  1. Luotu WorkoutPlan, liitetty sessio suoralla plan_id-viitteellä ja haettu ohjelman detaljit jäsensessioineen.
  2. Kuva tallennettu: docs/reports/images/sprint-03/s3-08-plans.png
  3. Todentaa suoran plan_id-kytkennän ilman välitaulua, omistajuuden eristyksen ja jäsensessioiden palautuksen.
- **Used AI?** Yes

### S3-09 — Activity types API (Must)

- **Status:** Done
- **PR / commit:** fe9ecde
- **Used AI?** Yes

### S3-10 — Goals CRUD API (Must)

- **Status:** Done
- **PR / commit:** de43af0
- **Demonstration:**
  1. **Do this:** Create and list goals in Swagger / cURL.
  2. **Capture:** Goals list or detail response.
  3. **Must show:** Goal tied to unit (and optional activity), target, active flag—not planned per-set values.
  4. **Save as:** `docs/reports/images/sprint-03/s3-10-goals.png`
  5. **Caption:** Tavoitteiden (Goal) elinkaari ja listaus todennettu rajapinnasta. Tavoite on sidottu mittayksikköön (unit_type_id), jaksoon (period: "week"), aktiivisuustilaan (active: true) ja tavoitearvoon (target_value: "100.000"). Tavoite on erillinen harjoituskertojen sarjakohtaisista suunnitelma-arvoista. Käyttäjäeristys (IDOR) varmistettu user_id-kytkennällä, ja Bearer-token pidetty suojattuna muuttujassa.
- **Used AI?** Yes

### S3-11 — Ownership enforcement (Must)

- **Status:** Done
- **PR / commit:** d2e5492
- **Demonstration:**
  1. **Do this:** As User B, call get/update/delete on User A's session and plan IDs.
  2. **Capture:** Failed responses (404 or 403).
  3. **Must show:** Cross-user access denied; note your status convention.
  4. **Save as:** `docs/reports/images/sprint-03/s3-11-ownership.png`
  5. **Caption:** IDOR-suojaus todennettu rajapinnasta. Autentikoitu Käyttäjä B yrittää hakea Käyttäjän A omistamaa harjoitussessiota (GET /sessions/{session_id}). Palvelin palauttaa konvention mukaisesti 404 Not Found (Session not found), jotta toisen käyttäjän resurssin olemassaoloa ei paljasteta hyökkääjälle. Pääsy evätään luotettavasti tietokantatason käyttäjärajauksella ilman tietovuotoja.
- **Used AI?** Yes

### S3-12 — Calendar API (Must)

- **Status:** Done
- **PR / commit:** a0a4a64
- **Demonstration:**
  1. **Do this:** `GET /calendar?from=&to=` (optional `plan_id`) for dated sessions.
  2. **Capture:** Calendar response.
  3. **Must show:** Only current user's sessions with `session_at` in range.
  4. **Save as:** `docs/reports/images/sprint-03/s3-12-calendar-api.png`
  5. **Caption:** Kalenterirajapinta (GET /calendar) todennettu. Rajapinta palauttaa ainoastaan todennetun käyttäjän harjoitussessiot määritetyltä aikaväliltä (2026-10-01 - 2026-10-31) eager loading -liitoksella ilman N+1-ongelmia.
- **Used AI?** Yes

### S3-13 — TanStack Query setup (Must)

- **Status:** Done
- **PR / commit:** 962d438
- **Used AI?** Yes
- **Note your query-key convention**: Käytössä keskitetty ja vahvasti tyypitetty queryKey-tehdas (frontend/src/lib/queryKeys.ts). Rakenne noudattaa hierarkkista muotoa: resurssi -> toiminto -> parametrit/filtterit (esim. ["sessions", "list", filters] tai ["calendar", { from, to, planId }]). Tämä takaa deterministisen välimuistin validoinnin ja estää manuaaliset merkkijonovirheet.

### S3-14 — Sessions list and filters UI (Must)

- **Status:** Done
- **PR / commit:** 6fa2490
- **Demonstration:**
  1. **Do this:** View sessions list; apply status / date-range filter.
  2. **Capture:** Filtered sessions view.
  3. **Must show:** Filter controls working and sessions filtered by status/date.
  4. **Save as:** `docs/reports/images/sprint-03/s3-14-sessions-list.png`
  5. **Caption:** Sessioiden listaus- ja suodatusnäkymä toteutettu TanStack Queryllä. Käyttöliittymä reagoi suodattimiin lennosta ilman sivun uudelleenlatausta ja näyttää harjoitukset tilakohtaisilla tunnisteilla.
- **Used AI?** Yes

### S3-15 — Session designer planned and actual (Must)

- **Status:** Done
- **PR / commit:** 801cadb
- **Demonstration:**
  1. **Do this:** Create/edit a multi-exercise session with planned and/or actual inputs from unit links.
  2. **Capture:** Designer UI.
  3. **Must show:** Catalog-driven fields (e.g. per-set strength + running).
  4. **Save as:** `docs/reports/images/sprint-03/s3-15-designer.png`
  5. **Caption:** Session Designer -lomake kytketty tietokannan lajikatalogiin. Lomake generoi voimaliikkeelle sarjakohtaiset toisto- ja painokentät sekä kestävyyslajille kesto- ja matkakentät suunnitelluille ja toteutuneille arvoille ilman kovakoodattuja yksiköitä.
- **Used AI?** Yes

### S3-16 — Edit, delete, and clone session UI (Must)

- **Status:** Done
- **PR / commit:** 283a408
- **Demonstration:**
  1. **Do this:** Clone from the UI onto a date; optionally show delete confirm.
  2. **Capture:** Clone result in UI.
  3. **Must show:** Clone available from the session UI.
  4. **Save as:** `docs/reports/images/sprint-03/s3-16-clone-ui.png`
  5. **Caption:** Sessioiden muokkauslomakkeelle toteutettu tilannevedoksen luonti (kloonaus) valinnaisella ajankohdalla. Rajapintakutsun onnistuessa valimuisti invalidoidaan, lomaketila nollataan ja kayttaja ohjataan paanakymaan, jossa kloonattu sessio esitetaan planned-tilassa ilman toteutuneita arvoja.
- **Used AI?** Yes

### S3-17 — Activity type selector (Must)

- **Status:** Done
- **PR / commit:** 801cadb
- **Used AI?** Yes

### S3-18 — Plans UI (Must)

- **Status:** Done
- **PR / commit:** 1a63c17
  1. **Do this:** Open Plans; show members ordered by `session_at` / Unscheduled.
  2. **Capture:** Plan detail.
  3. **Must show:** Attach via `plan_id` story; no junction reorder UI.
  4. **Save as:** `docs/reports/images/sprint-03/s3-18-plans-ui.png`
  5. **Caption:** Harjoitussuunnitelmien päänäkymä, jossa valitun suunnitelman tiedot ja siihen liitetyt harjoitussessiot esitetään ryhmiteltynä ajankohdan mukaan (aikataulutetut session_at-järjestyksessä ja aikatauluttamattomat erikseen).
- **Used AI?** Yes

### S3-19 — Calendar UI (Must)

- **Status:** Done
- **PR / commit:** 9d09f22
  1. **Do this:** Show **month** and **week** views; clone onto a date if available.
  2. **Capture:** Both views (or clearly labeled tabs).
  3. **Must show:** In-app calendar driven by `session_at` (not Google sync).
  4. **Save as:** `docs/reports/images/sprint-03/s3-19-calendar-ui.png`
  5. **Caption:** Harjoituskalenterin viikko- ja kuukausinäkymät, joissa harjoitussessiot esitetään päiväkohtaisesti session_at-aikaleiman mukaan jaoteltuna.
- **Used AI?** Yes

### S3-20 — Dashboard recent sessions (Must)

- **Status:** Pending
- **PR / commit:**
- **Demonstration:**
  1. **Do this:** Open Dashboard after login.
  2. **Capture:** Recent sessions or empty state.
  3. **Must show:** Current user only.
  4. **Save as:** `docs/reports/images/sprint-03/s3-20-dashboard.png`
  5. **Caption:**
- **Used AI?** Yes

### S3-21 — Empty and error states (Should)

- **Status:** Pending
- **PR / commit:**
- **Demonstration:**
  1. **Do this:** Show empty list and an error/retry state.
  2. **Capture:** Screenshot.
  3. **Must show:** Clear empty/error UX.
  4. **Save as:** `docs/reports/images/sprint-03/s3-21-empty-error.png`
  5. **Caption:**
- **Used AI?** Yes

### S3-22 — IDOR demo documentation (Must)

- **Status:** Pending
- **PR / commit:**
- **Demonstration:**
  1. **Do this:** Open your IDOR write-up; confirm two-account steps for session/plan/goal/calendar.
  2. **Capture:** Doc snippet or `/docs` failure screenshot referenced by the write-up.
  3. **Must show:** Documented 404 vs 403 choice.
  4. **Save as:** `docs/reports/images/sprint-03/s3-22-idor.png`
  5. **Caption:**
- **Used AI?** Yes

### S3-23 — Optional Goals UI (Stretch)

- **Status:** Done / deferred (why):
- **PR / commit:**
- **Demonstrations:**
- Screenshot of the optional Goals UI
- **Used AI?** Yes

### Stretch (if done)

#### S3-S1 — Pagination · S3-S2 — Ownership API tests · S3-S3 — SQLAdmin · S3-S4 — Adherence preview

For each completed stretch: Status, PR/commit, Used AI? Add a short Demonstration if you have a useful screenshot (`s3-sN-….png`).

## Design notes

Two to four technical choices (e.g. 404 vs 403; how clone sets `plan_id`; calendar empty days).

1. **IDOR ja 404-konventio:** Jos resurssi kuuluu toiselle käyttäjälle tai sitä ei ole, palautetaan aina 404 Not Found (eikä 403 Forbidden), jotta resurssien olemassaoloa ei paljasteta hyökkääjälle.
2. **Snapshot-kloonaus:** Sessioiden duplikoinnissa luodaan täysin itsenäiset tietueet. Lähdesession muokkaukset eivät kaskadoidu uuteen tietueeseen, mutta source_session_id säilytetään SACM-auditointia varten.
3. **Ohjelmasidonnaisuus:** WorkoutPlan- ja WorkoutSession-relaatiossa käytetään suoraa viiteavainta (plan_id) ilman välitaulua, jolloin ohjelman rakenne määräytyy suoraan session_at-aikaleiman mukaan.

## Retrospective

What went well / what to change next sprint (Sprint 4 charts).

## Carry-over

Deferred Must/Should, stretch leftovers, risks for [Sprint 4 tickets](../tickets/sprint-04-tickets.md).

## AI usage (sprint-level reflection)

Mark **Used AI?** under each ticket above (`Yes` / `No`). Do **not** write per-ticket reflections there.

Here, cover your **overall** AI use during this sprint (Cursor, ChatGPT, Copilot, local coding assistants, etc.). Product Insights via Ollama in Sprint 5 does **not** count unless you also used an AI assistant to write code.

If you marked **No** on every ticket, write a short note that you did not use AI coding assistants this sprint (you may still answer verification / independence questions briefly).

- **Where AI helped most this sprint** (themes, ticket IDs, or areas—not a ticket-by-ticket dump):
- **What I typically accepted from AI suggestions:**
- **What I typically rejected or reworked, and why:**
- **How I verified AI-assisted work** (tests, `/docs`, manual demos, reviews):
- **What I can now explain or do independently** that I relied on AI for earlier:
- **Anything I would do differently with AI next sprint:**

Do not paste secrets, full JWTs, or `.env` values.
