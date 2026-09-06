# Sprint 1 report — Foundation

| Field        | Your answer |
| ------------ | ----------- |
| **Dates**    | 06.09.2026  |
| **Names**    | Kimmo Silvennoinen |
| **Repo URL** | https://github.com/ckisi001-xamk/exercise-progress-tracker |
| **Branch**   | main        |

Tickets: [sprint-01-tickets.md](../sprints/tickets/sprint-01-tickets.md) · Index: [../sprints/README.md](../sprints/README.md)

## Sprint goal

Tavoitteena oli pystyttää yhtenäinen ja toistettava monorepo-kehitysympäristö: Docker Compose (db, api, web), kerrostettu FastAPI-runko toimivalla /health-reitillä, React-käyttöliittymän kuori sekä täydellinen käynnistysdokumentaatio. Tavoite saavutettiin täysimääräisesti; kaikki palvelut nousevat yhdellä komennolla ja rajapintayhteys todennetaan käyttöliittymästä.

## Tickets

### S1-01 — Create monorepo layout and root `.gitignore` (Must)
- **Status:** Done
- **PR / commit:** 29a1f5e
- **Used AI?** Yes

### S1-02 — FastAPI app skeleton (Must)
- **Status:** Done
- **PR / commit:** 7af7621
- **Demonstration:**
  1. Swagger UI avattu osoitteessa http://localhost:8000/docs.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-02-docs.png.
  3. Kuva todentaa OpenAPI-määrityksen toimivuuden ja API-palvelimen käynnistymisen.
- **Used AI?** Yes

### S1-03 — Health endpoint (Must)
- **Status:** Done
- **PR / commit:** 7af7621
- **Demonstration:**
  1. GET /health avattu selaimessa.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-03-health.png.
  3. Kuva todentaa kerrostetun arkkitehtuurin läpi tulevan {"status":"ok"} JSON-vastauksen.
- **Used AI?** Yes

### S1-04 — Python dependencies (Must)
- **Status:** Done
- **PR / commit:** 7af7621
- **Used AI?** Yes

### S1-06 — Env example and settings (Must)
- **Status:** Done
- **PR / commit:** ec67114
- **Used AI?** Yes

### S1-07 — Docker Compose for db and api (Must)
- **Status:** Done
- **PR / commit:** 97e0bbe
- **Demonstration:**
  1. Ajettu docker compose up --build -d ja tarkistettu docker compose ps.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-07-compose-db-api.png.
  3. Kuva todentaa tracker-db- ja tracker-api-konttien ajotilan ja terveyden.
- **Used AI?** Yes

### S1-08 — API reaches Postgres (Must)
- **Status:** Done
- **PR / commit:** c2f8637
- **Demonstration:**
  1. Suoritettu verkkoresoluutiotesti kontin sisällä (socket.gethostbyname("db")).
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-08-api-db.png.
  3. Todentaa Docker-verkon toiminnan: API saavuttaa kannan nimellä db (IP 172.18.0.2).
- **Used AI?** Yes

### S1-09 — Vite React TypeScript scaffold (Must)
- **Status:** Done
- **PR / commit:** 6dbf8b4
- **Demonstration:**
  1. Käynnistetty Vite dev-palvelin ja avattu sivu osoitteessa :5173.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-09-frontend.png.
  3. Todentaa toimivan TypeScript-pohjaisen React-rungon.
- **Used AI?** Yes

### S1-10 — Router and placeholder home (Must)
- **Status:** Done
- **PR / commit:** 37dec58
- **Demonstration:**
  1. Luotu HomePage-komponentti ja korvattu oletusrunko React Routerilla.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-10-home.png.
  3. Todentaa puhtaan placeholder-näkymän reitissä /.
- **Used AI?** Yes

### S1-11 — API base URL and health indicator (Should)
- **Status:** Done
- **PR / commit:** 37dec58
- **Demonstration:**
  1. Toteutettu client.ts ja kytketty dynaaminen tilatarkistus etusivulle.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-11-health-ui.png.
  3. Todentaa selainpään onnistuneen CORS-kutsun backendille ja vihreän tilatiedon.
- **Used AI?** Yes

### S1-12 — Web service in Compose (Must)
- **Status:** Done
- **PR / commit:** 91c5fd3
- **Demonstration:**
  1. Lisätty web-palvelu Composeen ja ajettu koko pino ylös.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-12-compose-web.png.
  3. Todentaa db-, api- ja web-konttien samanaikaisen toiminnan ja frontin latautumisen.
- **Used AI?** Yes

### S1-13 — Root README (Must)
- **Status:** Done
- **PR / commit:** 3df6f9c
- **Demonstration:**
  1. Juuren README.md tarkistettu.
  2. Kuva tallennettu: docs/reports/images/sprint-01/s1-13-readme.png.
  3. Todentaa toistettavan käynnistysohjeen ja osoitetaulukon.
- **Used AI?** Yes

## How we worked

Sprintti vietiin läpi tiiviissä aikaikkunassa systemaattisella tikettijärjestyksellä.
- **Backend & Infra:** Monorepo-rakenne, Pydantic-konfiguraatio, FastAPI-kerrokset ja Compose-kontitus.
- **Frontend & Integrointi:** Vite-alustus, React Router, tyypitetty API-clientti ja Viten lisäys Composeen.
- **Blocker & ratkaisu:** Työaseman virtualisointituki vaati WSL2-alustan ja Windows-ominaisuuksien aktivoinnin, jotta Docker-daemon saatiin vakaaseen tilaan.

## Decisions

1. **Vite dev-serveri Composessa:** Valittiin nopea dev-serveri suoran Nginx-tuotantobuildin sijaan, jotta koodimuutokset heijastuvat välittömästi ilman uudelleenbuildausta.
2. **Pydantic Settings konfiguraationhallintaan:** Ympäristömuuttujat luetaan tyypitettyinä keskitetysti core/config.py-moduulissa hajautettujen os.getenv-kutsujen sijaan.

## What we learned

- Docker Composen sisäverkon nimipalvelun logiikka (db vs localhost).
- Kerrosarkkitehtuurin tiukka eriyttäminen FastAPI:ssa jo /health-vaiheessa.

## Carry-over

Kaikki pakolliset (Must) ja suositellut (Should) tiketit tehty. Ei velkaa Sprinttiin 2.

## AI usage (sprint-level reflection)

- **Where AI helped most this sprint:** Alustavien Dockerfile- ja Compose-konfiguraatioiden generoimisessa sekä tikettikohtaisen arkkitehtuurin jäsentämisessä.
- **What I typically accepted from AI suggestions:** Standardinmukaiset koodirungot ja konfiguraatiot.
- **What I typically rejected or reworked:** Ylimääräiset monimutkaisuudet; pidettiin riippuvuudet ja Docker-kerrokset minimissä.
- **How I verified AI-assisted work:** Testaamalla manuaalisesti jokainen endpoint (curl, /docs, selain) ja ajamalla konttien verkkotestit.
- **What I can now explain independently:** Docker-sisäverkon toiminnan ja monorepon kansiorakenteen merkityksen full stack -putkessa.
- **Anything I would do differently next sprint:** Aloitetaan suoraan Docker Desktopin ja virtualisoinnin tarkistuksella ennen koodin kirjoittamista.
