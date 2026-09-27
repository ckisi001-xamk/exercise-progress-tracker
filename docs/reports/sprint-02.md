# Sprint 2 report — Authentication & Domain Models

| Field        | Your answer |
| ------------ | ----------- |
| **Dates**    | 27.09.2026  |
| **Names**    | Kimmo Silvennoinen |
| **Repo URL** | https://github.com/ckisi001-xamk/exercise-progress-tracker |
| **Branch**   | main        |

Tickets: [sprint-02-tickets.md](../sprints/tickets/sprint-02-tickets.md) · Index: [../sprints/README.md](../sprints/README.md)

## Sprint goal

Tavoitteena oli toteuttaa tietokantamallit ja migraatiot käyttäjille sekä aktiviteeteille, rakentaa tietoturvallinen JWT-pohjainen todennusjärjestelmä FastAPI-taustapalveluun, lukita CORS-asetukset ja integroida todennuksen tilanhallinta React-käyttöliittymään. Tavoite saavutettiin täysimääräisesti; rekisteröinti, sisäänkirjautuminen, profiilin haku suojatusta rajapinnasta ja uloskirjautuminen toimivat todennetusti läpi koko pinon.

## Tickets

### S2-02 — User model (Must)
- **Status:** Done
- **PR / commit:** 24ae6fe
- **Demonstration:**
  1. Luotu `User`-tietokantamalli SQLAlchemylla ja Pydantic-skeemat.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-02-user.png.
  3. Todentaa taulurakenteen ja kenttämääritykset (id, email, hashed_password, display_name).
- **Used AI?** Yes

### S2-03 — Activity types model (Must)
- **Status:** Done
- **PR / commit:** d48dac1
- **Demonstration:**
  1. Luotu `ActivityType`-malli lajityyppien luokitteluun.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-03-activity-types.png.
  3. Todentaa aktiviteettityyppien relaatiot ja tietokantarakenteen.
- **Used AI?** Yes

### S2-04 — Unit links model (Must)
- **Status:** Done
- **PR / commit:** 6550b71
- **Demonstration:**
  1. Luotu mittayksikkökytkökset aktiviteettityypeille.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-04-unit-links.png.
  3. Todentaa metriikoiden kytkennän tietomalliin.
- **Used AI?** Yes

### S2-05 — Alembic migration (Must)
- **Status:** Done
- **PR / commit:** 3541828
- **Demonstration:**
  1. Luotu ja ajettu tietokantamigraatio PostgreSQL-kantaan.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-05-alembic.png.
  3. Todentaa migraation ajon onnistumisen (`alembic upgrade head`).
- **Used AI?** Yes

### S2-06 — Seed data (Should)
- **Status:** Done
- **PR / commit:** 54cfdc3
- **Demonstration:**
  1. Ajettu alkulatausskripti tietokantaan perusdatan ja lajityyppien osalta.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-06-seed.png.
  3. Todentaa valmiit perusmetriikat kannassa sovelluksen käynnistyessä.
- **Used AI?** Yes

### S2-07 — Admin view / verification (Should)
- **Status:** Done
- **PR / commit:** 251f121
- **Demonstration:**
  1. Todennus kannan taulujen ja alkudatan tilasta SQLAdmin-hallintaliittymällä.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-07-admin.png.
  3. Todentaa taustadatan eheyden suoraan tietovarastotasolla.
- **Used AI?** Yes

### S2-10 — Register endpoint (Must)
- **Status:** Done
- **PR / commit:** d969a2b
- **Demonstration:**
  1. Suoritettu POST /auth/register -kutsu API-rajapintaan.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-10-register.png.
  3. Todentaa käyttäjän luonnin, salasanan bcrypt-tiivistyksen ja 201-vastauksen.
- **Used AI?** Yes

### S2-12 — Me endpoint (Must)
- **Status:** Done
- **PR / commit:** bc50636
- **Demonstration:**
  1. Kutsuttu suojattua GET /auth/me -reittiä Bearer-otsakkeella.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-12-me.png.
  3. Todentaa JWT-tokenin validoinnin ja käyttäjäprofiilin palautuksen.
- **Used AI?** Yes

### S2-13 — CORS lockdown (Must)
- **Status:** Done
- **PR / commit:** 730b0de
- **Demonstration:**
  1. Ajettu preflight OPTIONS -pyyntö Origin-otsakkeella http://localhost:5173.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-13-cors.png.
  3. Todentaa sallitun Access-Control-Allow-Origin: http://localhost:5173 -vastauksen.
- **Used AI?** Yes

### S2-14 — Register page UI (Must)
- **Status:** Done
- **PR / commit:** 5353f6c
- **Demonstration:**
  1. Avattu rekisteröitymislomake selaimessa osoitteessa http://localhost:5173.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-14-register-ui.png.
  3. Todentaa lomakekentät, rajapintakytkennän ja syötteiden maskauksen.
- **Used AI?** Yes

### S2-15 — Login page & auth state management (Must)
- **Status:** Done
- **PR / commit:** 3dabe87
- **Demonstration:**
  1. Avattu kirjautumislomake ja kytketty AuthContext-tilanhallinta.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-15-login-ui.png.
  3. Todentaa sisäänkirjautumisnäkymän ja syötteiden käsittelyn.
- **Used AI?** Yes

### S2-16 — Protected routes UI (Must)
- **Status:** Done
- **PR / commit:** 9a45f45
- **Demonstration:**
  1. Kirjauduttu järjestelmään ja avattu todennettu päänäkymä.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-16-protected-ui.png.
  3. Todentaa käyttäjätunnuksen, nimen ja järjestelmä-ID:n näkymisen todennetussa tilassa.
- **Used AI?** Yes

### S2-17 — Logout (Must)
- **Status:** Done
- **PR / commit:** 9a45f45
- **Demonstration:**
  1. Painettu "Kirjaudu ulos" ja tarkistettu selaimen Local Storage DevToolsista.
  2. Kuva tallennettu: docs/reports/images/sprint-02/s2-17-logout.png.
  3. Todentaa istunnon ja JWT-tokenin mitätöinnin sekä paluun kirjautumisnäkymään.
- **Used AI?** Yes

## How we worked

- **Backend & Tietoturva:** Tietokantamallit sidottiin SQLAlchemylla PostgreSQL-kantaan, ajettiin Alembic-migraatiot ja suojattiin salasanat teollisuusstandardin mukaisesti (bcrypt). Autentikointi toteutettiin tilattomalla JWT-standardilla ja CORS-säännöt lukittiin tiukasti kehitysporttiin 5173.
- **Frontend & Integraatio:** Rakennettiin keskitetty API-asiakaskerros, reaktiivinen AuthContext istunnon elinkaaren hallintaan sekä suojatut näkymät.
- **Häiriönhallinta:** Ratkaistiin porttikollisio (5173 varattuna) prosessitappojen ja `strictPort`-lukituksen avulla, käynnistettiin pudonnut Docker Desktop -taustapalvelu ja korjattiin bundlerin ESM-tyyppituonti (`type UserResponse`).

## Decisions

1. **JWT tilattomassa arkkitehtuurissa:** Istunnot pidetään hajautettuna Bearer-tokeneilla ilman palvelinpään sessiovarastoa, mikä mahdollistaa rajapinnan skaalautuvuuden.
2. **Tiukka CORS-konfiguraatio:** Wildcard-sallinnat (`*`) estettiin ja sallittu alkuperä sidottiin täsmällisesti kehitysympäristön osoitteeseen tietoturvapoikkeamien estämiseksi.
3. **Eksplisiittiset tyyppituonnit:** TypeScriptin käyttöliittymärajapinnat määriteltiin `type`-avainsanalla estämään esbuildin kääntövirheet selaimen ESM-ajonaikaisessa puussa.

## What we learned

- Salasanatiivisteiden ja JWT-tokenien turvallinen käsittely full stack -arkkitehtuurissa.
- DevToolsin Sources- ja Network-työkalujen systemaattinen käyttö kääntö- ja integraatiohäiriöiden juurisyyanalyysissa.
- Selaimen Local Storagen ja Reactin sisäisen tilan synkronointi istunnon päättämisessä.

## Carry-over

Kaikki Sprint 2:n tiketit (S2-02 – S2-17) viety tuotantokelpoiseen tilaan ja todennettu artefaktein. Ei teknistä velkaa Sprinttiin 3.

## AI usage (sprint-level reflection)

- **Where AI helped most this sprint:** JWT-virheenkorjauksessa, TypeScript-tyyppituontien syntaksiongelmien analysoinnissa ja preflight CORS -verifioinnissa.
- **What I typically accepted from AI suggestions:** Suoraviivaiset arkkitehtuurikorjaukset ja ITIL-periaatteiden mukainen dokumentaatiorakenne.
- **What I typically rejected or reworked:** Ylimääräiset CSS-riippuvuudet; UI pidettiin puhtaana ja funktionaalisena.
- **How I verified AI-assisted work:** Testaamalla kutsut suoraan cURLilla, tarkistamalla vastaukset DevToolsista ja varmentamalla istunnon nollaus Local Storagesta.
- **What I can now explain independently:** JWT-todennuksen kulun selaimelta tietokantaan, preflight CORS -mekanismin toiminnan ja TypeScript-tyyppien käyttäytymisen bundlerissa.
- **Anything I would do differently next sprint:** Varmistetaan Docker Daemonin ja porttivarausten tila ennen kooditöiden aloitusta häiriöajan minimoimiseksi.
