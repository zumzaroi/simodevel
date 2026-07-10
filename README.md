# SimoDevel — Site Plan

> **Non-profit, open source.** Conținutul este gratuit, fără reclame, fără date colectate.  
> Oricine poate contribui: proiecte, modele, tutoriale, piese — prin Pull Request pe GitHub.

> **Principiu**: 100% static (GitHub Pages). Niciun backend. Date în JSON, UI în HTML/JS vanilla.  
> **Pagina principală = un search.** Utilizatorul tastează și vede instant rezultate grupate pe secțiuni.

---

## Stare secțiuni

| Secțiune | Status | Fișier |
|---|---|---|
| Home / Hero | ✅ live | `index.html` |
| Models Library | 🔧 placeholder | `index.html#models` |
| Tutorials | 🔧 placeholder | `index.html#tutorials` |
| Tools | 🔧 placeholder | `index.html#tools` |
| Blog Proiecte | ⏳ de făcut | `blog/` |
| Parts / Componente | ⏳ de făcut | `parts/` |
| Contribute | ⏳ de făcut | `CONTRIBUTING.md` |
| MADM Gantt Tool | ✅ live | `mamici_goethe.html` |

---

## Structura repo

```
simodevel/
├── index.html                  # pagina principală
├── mamici_goethe.html          # tool MADM Gantt
├── CONTRIBUTING.md             # ghid contribuții utilizatori
│
├── data/
│   ├── components.json         # baza de date componente (generat de script, nu editat manual)
│   ├── projects_index.json     # index blog proiecte (actualizat după fiecare PR acceptat)
│   └── tutorials_index.json    # index tutoriale
│
├── blog/
│   ├── 01_emitator_fm/
│   │   ├── README.md           # descriere, schema, explicație
│   │   ├── schema.asc          # fișier LTspice (opțional)
│   │   └── parts.json          # lista piese cu linkuri
│   ├── 02_senzor_umiditate_sol/
│   ├── 03_sursa_lm317/
│   ├── 04_amplificator_lm386/
│   ├── 05_ceas_cd4026/
│   ├── 06_detector_metale/
│   ├── 07_termometru_ntc/
│   ├── 08_incarcator_solar/
│   ├── 09_invertor_12v/
│   └── 10_receptor_ir/
│
├── parts/
│   └── scan_components.py      # script Python: citește o listă de part# → apelează API → scrie components.json
│
└── madm_gantt_share/
    └── madm_gantt_share/       # tool admitere liceu
```

---

## 1. Search global — pagina principală

### Concept UX

Pagina principală NU mai e un hero cu text lung. Este **direct un search box** centrat, mare, cu search-as-you-type.

```
┌─────────────────────────────────────────────────────┐
│  🔍  caută componente, proiecte, tutoriale...       │
└─────────────────────────────────────────────────────┘
         ↓ (apare imediat la tastat, fără buton)

┌── 📝 Blog Proiecte (max-height: 300px, scroll intern) ──┐
│  [card]  [card]  [card]  [card]                          │
└──────────────────────────────────────────────────────────┘
┌── 🛒 Componente (max-height: 300px, scroll intern) ──────┐
│  BC547 — BJT NPN — DigiKey ↗  Mouser ↗  TME ↗           │
│  LM317 — Regulator — DigiKey ↗  Mouser ↗                │
└──────────────────────────────────────────────────────────┘
┌── 🎓 Tutoriale (max-height: 200px, scroll intern) ───────┐
│  [card]  [card]                                          │
└──────────────────────────────────────────────────────────┘
┌── 📚 Modele (max-height: 200px, scroll intern) ──────────┐
│  [card]                                                  │
└──────────────────────────────────────────────────────────┘
```

- Dacă search-ul e gol → afișează câte 4 carduri din fiecare secțiune ("featured")
- O secțiune fără rezultate dispare complet din pagină
- View mode: toggle **mozaic** (grid) / **listă** (compact rows)

### Implementare JS

```js
// La load: fetch toate JSON-urile, cache în sessionStorage
// La input: filtrează în toate sursele, randează imediat (debounce 150ms)
// Structura rezultate:
{
  blog:       [ { title, tags, difficulty, url } ],
  parts:      [ { ref, type, manufacturer, buy } ],
  tutorials:  [ { title, tags, url } ],
  models:     [ { title, simulator, url } ]
}
```

[AI: scrie funcția JS `searchAll(query, index)` care primește un string și un obiect index cu cheile `{blog, parts, tutorials, models}`, filtrează case-insensitive pe câmpurile title+tags+ref+type, returnează obiectul cu rezultatele filtrate, max 20 per secțiune]

[AI: scrie funcția JS `renderResults(results, viewMode)` care primește rezultatele de mai sus și viewMode (`'grid'`/`'list'`), randează HTML cu secțiuni colapsabile, fiecare cu `max-height: 300px; overflow-y: auto`, carduri stilizate Tailwind]

### Sursele de date căutate

| Fișier JSON | Secțiune afișată | Câmpuri căutate |
|---|---|---|
| `data/projects_index.json` | Blog Proiecte | title, tags, category |
| `data/components.json` | Componente | ref (part#), type, manufacturer |
| `data/tutorials_index.json` | Tutoriale | title, tags |
| `data/models_index.json` | Modele | title, simulator, tags |

---

## 2. Blog Proiecte

Fiecare proiect este un folder în `blog/`. Site-ul citește `data/projects_index.json` și randează cardurile dinamic.

### Format `projects_index.json`
```json
[
  {
    "id": "01_emitator_fm",
    "title": "Emițător FM 88–108 MHz",
    "category": "RF",
    "tags": ["BC547", "oscilator", "RF", "FM"],
    "difficulty": "beginner",
    "description": "Emițător FM simplu cu un tranzistor BJT, raza ~10m.",
    "readme": "blog/01_emitator_fm/README.md",
    "parts": "blog/01_emitator_fm/parts.json"
  }
]
```

### Cele 10 proiecte planificate

[AI: pentru fiecare proiect de mai jos, scrie un README.md cu: descriere 2 paragrafe, lista componente cu valori, schema text (ASCII sau link LTspice), note de simulare LTspice, referinte datasheet]

| # | Titlu | Categorie | Dificultate | Componente cheie |
|---|-------|-----------|-------------|-----------------|
| 01 | Emițător FM 88–108 MHz | RF | beginner | BC547, bobina 5 spire, trimmer 22pF |
| 02 | Senzor umiditate sol cu alarmă | Senzori | beginner | LM393, electrozi Cu, LED, buzzer |
| 03 | Sursă reglabilă 1.25–30V 1A | Alimentare | beginner | LM317, pot 5kΩ, C filter |
| 04 | Amplificator audio 5W mono | Audio | beginner | LM386, 250µF, 10Ω |
| 05 | Ceas digital cu numărătoare | Digital | intermediate | CD4026 ×4, display 7seg ×4, 555 |
| 06 | Detector metale BFO | RF | intermediate | BC547 ×2, bobina search, difuzor |
| 07 | Termometru analogic cu NTC | Senzori | beginner | NTC 10kΩ, LM358, LED bargraph |
| 08 | Încărcător solar Li-Ion | Alimentare | intermediate | LTC4054, panou solar 6V, LED status |
| 09 | Invertor 12V→220V 50Hz (low power) | Putere | advanced | IRF540 ×2, 555, trafo 12V/220V |
| 10 | Receptor IR universal | Comunicații | beginner | TSOP4838, Arduino Nano, LCD 16×2 |

---

## 3. Parts / Componente

### Flux de lucru (fără backend)

```
1. Editezi parts/scan_components.py  → adaugi part numbers dorite
2. Rulezi local: python scan_components.py
3. Se generează/actualizează: data/components.json
4. git add data/components.json && git push
5. Site-ul servește JSON-ul static
```

### Format `components.json`
```json
{
  "BC547": {
    "type": "BJT NPN",
    "manufacturer": "Vishay / ON Semi / Fairchild",
    "package": "TO-92",
    "datasheet": "https://www.vishay.com/docs/85014/bc546.pdf",
    "buy": {
      "DigiKey": "https://www.digikey.com/en/products/detail/BC547BTA",
      "Mouser": "https://www.mouser.com/ProductDetail/BC547",
      "TME": "https://www.tme.eu/ro/details/bc547b/"
    },
    "used_in_projects": ["01_emitator_fm", "06_detector_metale"]
  }
}
```

### API-uri disponibile pentru scan_components.py

[AI: scrie scan_components.py care: citeste o lista part_numbers.txt, incearca DigiKey API v3 (cu API key din .env), fallback la Mouser API, fallback la cautare TME, salveaza results in data/components.json; include retry logic si rate limiting]

| API | Gratuit | Cheie necesară | Note |
|-----|---------|----------------|------|
| DigiKey v3 | 1000 req/zi | Da (OAuth2) | Cel mai complet |
| Mouser Search | 1000 req/zi | Da (simplu) | Bun pentru EU |
| TME | nelimitat | Da | Prețuri RO/EU |
| Octopart / Nexar | 100 req/zi | Da | Agregator |

---

## 4. Contribuții utilizatori

### Workflow GitHub (fork & PR)

```
1. Utilizatorul face Fork la repo
2. Creează folder: blog/xx_numele_proiectului/
3. Adaugă fișierele (README.md obligatoriu, schema opțional, parts.json opțional)
4. Deschide Pull Request cu titlul: [BLOG] Numele proiectului
5. Review → merge → actualizez manual projects_index.json
```

### Template proiect contribuit

[AI: scrie un template README.md pentru un proiect contribuit de utilizator, cu sectiuni: About, Schematic, Simulation (LTspice), Parts List, How to Build, References]

Fișierul `CONTRIBUTING.md` va explica exact pașii de mai sus, cu exemple și reguli minime (fișier README.md obligatoriu, fără conținut comercial, schema sau foto obligatorie).

---

## 5. Navbar

```
[SimoDevel]  Blog  Parts  Models  Tutorials  Tools  Contribute
```

Navbar-ul NU mai are search — search-ul e pe pagina principală.  
Linkurile din navbar duc la ancore din `index.html` sau la pagini dedicate (viitor).

---

## TODO imediat

- [ ] Rescrie `index.html`: pagina principală = search-as-you-type cu rezultate secționate
- [ ] Creează `data/projects_index.json` cu cele 10 proiecte
- [ ] Creează `data/components.json` cu componentele de bază (via script sau manual)
- [ ] Creează `data/tutorials_index.json` și `data/models_index.json` (placeholder)
- [ ] Scrie `blog/01_emitator_fm/README.md` ca proiect demo
- [ ] Scrie `parts/scan_components.py` cu suport DigiKey + Mouser
- [ ] Scrie `CONTRIBUTING.md`
