# IDOR (Insecure Direct Object Reference) -suojaustestaus ja -dokumentaatio

**Viitekehys:** OWASP API Security Top 10 (2023) – API1: Broken Object Level Authorization (BOLA / IDOR)  
**Sovellus:** Exercise Progress Tracker  
**Päivämäärä:** 18.10.2026  
**Auditoija:** Kimmo Silvennoinen

---

## 1. Johdanto ja periaate

IDOR-haavoittuvuus syntyy tilanteessa, jossa sovellus ottaa vastaan resurssin suoran tunnisteen (kuten UUID) ja palauttaa tai muokkaa sitä tarkistamatta, kuuluuko kyseinen tietue todennetulle käyttäjälle.

Järjestelmässä noudatetaan periaatetta **Zero Trust** ja tiukkaa käyttäjäkohtaista rajausta tietokantakerroksessa:
1. Jokainen kysely (`SELECT`, `UPDATE`, `DELETE`) sitoo ehdon todennettuun käyttäjään: `WHERE id = :resource_id AND user_id = :current_user_id`.
2. Toisen käyttäjän resursseihin ei pääse käsiksi edes silloin, kun resurssin suora UUID on tiedossa.

---

## 2. Statuskoodin valinta: 404 Not Found vs 403 Forbidden

Tietoturva-arkkitehtuurissa on tehty tietoinen valinta palauttaa **404 Not Found** tilanteessa, jossa toinen käyttäjä yrittää hakea tai manipuloida toisen käyttäjän tunnistetta:

* **Miksi ei 403 Forbidden:** Jos rajapinta vastaisi olemassa olevaan, mutta luvattomaan UUID:hen `403 Forbidden` ja olemattomaan UUID:hen `404 Not Found`, hyökkääjä voisi käyttää rajapintaa tunnisteiden olemassaolon skannaamiseen ja enumerointiin (Information Disclosure / Enumeration Attack).
* **Miksi 404 Not Found:** Vastaamalla johdonmukaisesti `404 Not Found`, rajapinta ei paljasta hyökkääjälle, onko kyseistä tietuetta lainkaan olemassa kyseisessä taustajärjestelmässä. Käyttäjän kannalta resurssi "ei ole olemassa" hänen näkymässään.

---

## 3. Testitapaus: Kahden tilin IDOR-todennus

### Testiympäristön tilit
* **Käyttäjä A:** Omistaja (`testaaja@example.com`)
* **Käyttäjä B:** Hyökkääjä (`attacker@example.com`)

### Testiaskeleet (Swagger /docs tai cURL)

1. **Kirjautuminen Käyttäjällä A:**
   * Haetaan Käyttäjän A luoma harjoitussessio: `GET /api/sessions/`
   * Otetaan talteen session tunniste: `c30aab01-66a5-4e02-9a5c-123456789abc`
2. **Kirjautuminen Käyttäjällä B:**
   * Autentikoidutaan Käyttäjän B JWT-tokenilla.
3. **Hyökkäysyritys Käyttäjän A resurssiin:**
   * `GET /api/sessions/c30aab01-66a5-4e02-9a5c-123456789abc`
   * `PUT /api/sessions/c30aab01-66a5-4e02-9a5c-123456789abc`
   * `DELETE /api/sessions/c30aab01-66a5-4e02-9a5c-123456789abc`

### Testitulos
* **Palautettu HTTP-tila:** `404 Not Found`
* **Vastausrunko:**
```json
{
  "detail": "Session not found"
}