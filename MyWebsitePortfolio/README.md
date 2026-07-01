# Website Portfolio — Full Index, Flow Charts & Localhost Links

Every website, app, background, and showcase across the entire `~/Documents` folder. For each: **brand name → flow chart → localhost link** you can paste straight into a browser.

**98 distinct sites / experiments.** This file is generated from `sites.json` by `build.js` — run the **/Update_MyWebsitePortfolio** skill to add new sites.

---

## 🎬 Visual showcase (recommended)

Open **http://localhost:8000/** — a live gallery of every site. Each card has an **Open ↗** button that launches the real project **in a new tab**, with search + category filters. Gallery file: [`index.html`](index.html).

The numbered index below is the same sites with their **flow charts**.

---

## ▶ How to open these

One static server, rooted at `~/Documents`:

```bash
python3 -m http.server 8000 --bind 127.0.0.1   # serves everything below
lsof -ti:8000 | xargs kill                       # stop it
```

- **Hargrove** also runs its real backend at **http://localhost:8787** (working booking form).

- `%20` in a link = a folder with a space (`demo web`, `Mall CRM`) — keep it.

- **React/Vite** sites only show a dev shell as static — run `npm run dev` in their folder.

---

# 🔧 Plumbing & home-services

## 1. Hargrove & Sons Plumbing
**Type:** Flagship plumbing site · multi-page
**Notes:** Live backend :8787
**Flow chart:**
```
Home → Services → Areas hub → 6 area pages · homepage: Hero → ZIP check → Services → Pricing → Story+stats → Process → Reviews → Financing → Booking ⎇ (live API :8787) → Footer + chatbot
```
**Localhost:** http://localhost:8000/All_Site/hargrove-plumbing/index.html
- Services — http://localhost:8000/All_Site/hargrove-plumbing/services.html
- Areas hub — http://localhost:8000/All_Site/hargrove-plumbing/areas/index.html
- Sacramento — http://localhost:8000/All_Site/hargrove-plumbing/areas/sacramento.html
- Folsom — http://localhost:8000/All_Site/hargrove-plumbing/areas/folsom.html
- Roseville — http://localhost:8000/All_Site/hargrove-plumbing/areas/roseville.html
- Elk Grove — http://localhost:8000/All_Site/hargrove-plumbing/areas/elk-grove.html
- Davis — http://localhost:8000/All_Site/hargrove-plumbing/areas/davis.html
- Citrus Heights — http://localhost:8000/All_Site/hargrove-plumbing/areas/citrus-heights.html
- Dark previews — http://localhost:8000/All_Site/hargrove-plumbing/dark-themes.html
- Live backend :8787 — http://localhost:8787

## 2. BlueLine Plumbing Co.
**Type:** Plumbing · Austin, TX
**Flow chart:**
```
Hero → Trust bar → Services → Why Us → Process → Reviews → Service Area → FAQ → Quote form ⎇ → Footer
```
**Localhost:** http://localhost:8000/All_Site/blueline-plumbing/index.html

## 3. IRONHAND Plumbing Co.
**Type:** Plumbing · Denver
**Flow chart:**
```
Marquee → Hero+stats → Services scroller → Before/After slider → Stats → Process → Reviews → Service Area → FAQ → Quote ⎇ → Footer
```
**Localhost:** http://localhost:8000/All_Site/ironhand-plumbing/index.html

## 4. TIDEWELL Plumbing Co.
**Type:** Plumbing · San Diego
**Flow chart:**
```
Hero (ZIP) → Service range → Common-job pricing → Story (since '94) → Transparent pricing → Real-jobs gallery → Reviews (4.9★) → Emergency CTA → Booking form ⎇ → Footer
```
**Localhost:** http://localhost:8000/All_Site/tidewell-plumbing/index.html

## 5. Benjamin Franklin Plumbing
**Type:** Plumbing · redesign
**Flow chart:**
```
Hero → Guarantee → Services → Process → Reviews → FAQ → Contact form ⎇ → Footer
```
**Localhost:** http://localhost:8000/All_Site/beautiful-websites-kit/sites/benjamin-franklin-plumbing/index.html

## 6. Michael & Son
**Type:** Home services · redesign
**Flow chart:**
```
Hero → Services (six trades) → Membership → Why Us → Reviews → Contact (Call/Book) → Footer
```
**Localhost:** http://localhost:8000/All_Site/beautiful-websites-kit/sites/michael-and-son/index.html

## 7. Plumbline Services
**Type:** Plumbing · Denver redesign
**Flow chart:**
```
Hero → Services → Process → Promise → Reviews → Contact · dot-rail nav · chat widget
```
**Localhost:** http://localhost:8000/All_Site/beautiful-websites-kit/sites/plumbline-services/index.html

## 8. The Family Plumber
**Type:** Plumbing · Orange County (primary build)
**Flow chart:**
```
Hero → Trust → Services → About → Why Us → Process → Reviews → Service Area → FAQ → Booking form ⎇ → Footer
```
**Localhost:** http://localhost:8000/Demo_Web/Site/index.html

## 9. The Family Plumber (kit)
**Type:** Plumbing · kit copy
**Flow chart:**
```
Hero → Trust → Services rail → Why → Reviews deck → Service Area → About → FAQ → Quote ⎇ → Footer + chat
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/the-family-plumber/index.html
- Bundle copy — http://localhost:8000/beautiful-websites-kit/the-family-plumber-bundle/site/index.html

## 10. Hamm & Sons Plumbing
**Type:** Plumbing · Indianapolis
**Flow chart:**
```
Hero → Heritage (1984) → Services → Process → Promise → Credentials → Gallery → FAQ → Contact form ⎇ → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/hamm-and-sons-plumbing/index.html

## 11. Local Plumber LLC
**Type:** Plumbing & HVAC · Upstate SC
**Flow chart:**
```
Hero → Trust → Services (Plumbing+HVAC) → Stats → Process → Why → Service Area → FAQ → Contact form ⎇ → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/local-plumber-llc/index.html

## 12. Local Plumber LLC (React)
**Type:** Plumbing & HVAC · Upstate SC · React rebuild
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Hero → Trust → Services (Plumbing+HVAC) → Stats → Process → Why → Service Area → FAQ → Contact form ⎇ → Footer (Vite/React SPA)
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/local-plumber-llc-react/dist/index.html

## 13. Meridian Plumbing
**Type:** Plumbing · design sketches
**Notes:** Design sketch
**Flow chart:**
```
Hero-direction sketch (3 variants) + color-options (3 palettes)
```
**Localhost:** http://localhost:8000/Demo_Web/.planning/sketches/001-hero-direction/index.html
- Color options — http://localhost:8000/Demo_Web/.planning/sketches/color-options.html

## 98. Northcraft Remodeling
**Type:** design-build remodeling studio
**Flow chart:**
```
Hero: remodel the home you'll never want to leave → Remodeling end to end → Lakeview whole-home renovation → Find your look → A build with no surprises → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/northcraft-remodeling/index.html

---

# 🧰 Home-service niche templates

## 75. Plumbing — The Family Plumber
**Type:** Home-service niche template · Orange County & LA
**Flow chart:**
```
Hero → Services → Why us → Reviews → Service area → About → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/01-plumber/layout.html

## 76. Roofing — Ridgeline Roofing
**Type:** Home-service niche template · Dallas–Fort Worth
**Flow chart:**
```
Hero → Services → Why us → Recent work → Process → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/02-roofing/layout.html

## 77. HVAC — TrueComfort Heating & Air
**Type:** Home-service niche template · Kansas City
**Flow chart:**
```
Hero → Services → Why us → Comfort club → Process → Reviews → Service area → FAQ → Book → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/03-hvac/layout.html

## 78. Tree service — Timberline Tree Care
**Type:** Home-service niche template · Atlanta
**Flow chart:**
```
Hero → Services → Arborists → Process → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/04-tree-service/layout.html

## 79. General contractor — Meridian Build Co.
**Type:** Home-service niche template · Austin TX
**Flow chart:**
```
Hero → Services → Projects → Design-build → Process → Credentials → Reviews → FAQ → Contact → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/05-general-contractor/layout.html

## 80. Remodeling — Hearth & Stone Remodeling
**Type:** Home-service niche template · Denver
**Flow chart:**
```
Hero → Recent work → Before/after → Approach → Services → Reviews → FAQ → Free consult → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/06-remodeling/layout.html

## 81. Concrete — Ironform Concrete
**Type:** Home-service niche template · Phoenix
**Flow chart:**
```
Hero → Services → Finishes → Work → Crew → Process → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/07-concrete/layout.html

## 82. Foundation repair — Bedrock Foundation Repair
**Type:** Home-service niche template · Dallas TX
**Flow chart:**
```
Hero → Services → Results → Warning signs → How it works → Assurance → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/08-foundation-repair/layout.html

## 83. Fencing — Cedar Line Fence Co.
**Type:** Home-service niche template · Nashville
**Flow chart:**
```
Hero → Gallery → Materials → Trust → Process → Financing → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/09-fencing/layout.html

## 84. Deck builder — Lantern Decks
**Type:** Home-service niche template · Charlotte NC
**Flow chart:**
```
Hero → Gallery → Design → Services → About the builder → Process → Reviews → Financing → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/10-deck-builder/layout.html

## 85. Electrical — Voltline Electric
**Type:** Home-service niche template · Seattle
**Flow chart:**
```
Hero → Services → Gallery → Credentials → Pricing → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/11-electrical/layout.html

## 86. Paving — Blackline Paving
**Type:** Home-service niche template · Columbus OH
**Flow chart:**
```
Hero → Services → Work → Fleet → Process → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/12-paving/layout.html

## 87. Pool installation — Azure Pools & Spas
**Type:** Home-service niche template · Tampa FL
**Flow chart:**
```
Hero → Styles → Pool types → 3D design → Financing → Process → Credentials → Reviews → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/13-pool-installation/layout.html

## 88. Septic service — ClearFlow Septic
**Type:** Home-service niche template · Raleigh NC
**Flow chart:**
```
Hero → Services → How it works → Maintenance plan → Reviews → Service area → FAQ → Request service → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/14-septic-service/layout.html

## 89. Garage door — Overhead & Co.
**Type:** Home-service niche template · St. Louis
**Flow chart:**
```
Hero → Services → Door styles → Repair → Brands → Process → Reviews → Service area → FAQ → Get a quote → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/15-garage-door/layout.html

## 90. Landscaping — Greenfield Landscape
**Type:** Home-service niche template · Portland
**Flow chart:**
```
Hero → Design & care → Work → Packages → Process → Reviews → Get a quote → FAQ → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/16-landscaping/layout.html

## 91. Pressure washing — Crisp Exterior Washing
**Type:** Home-service niche template · Orlando
**Flow chart:**
```
Hero → Services → Soft wash → Bundles → Process → Reviews → Service area → Get a quote → FAQ → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/17-pressure-washing/layout.html

## 92. Junk removal — HaulAway Junk Removal
**Type:** Home-service niche template · San Antonio
**Flow chart:**
```
Hero → How it works → Before/after → Pricing → What we take → Eco → Reviews → Service area → Get a quote → FAQ → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/18-junk-removal/layout.html

---

# 💆 Med spa / aesthetics

## 14. Alma Esthetics
**Type:** Med spa · North Austin
**Flow chart:**
```
Hero → Trust → Before/After slider → Treatments → Membership/Shop → Reviews → FAQ → Booking → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/alma-esthetics/index.html

## 15. Alma Esthetics (React)
**Type:** Med spa · North Austin · React rebuild
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Hero → Trust → Before/After slider → Treatments → Membership/Shop → Reviews → FAQ → Booking → Footer (Vite/React SPA)
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/alma-esthetics-react/dist/index.html

## 16. Austin Med Spa
**Type:** Med spa · lookbook
**Flow chart:**
```
Hero lookbook → Lookbook gallery → Services → Trust → Reviews → FAQ → Contact/Map → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/austin-med-spa/index.html

## 17. AZ Esthetics & Head Spa
**Type:** Med spa · Japanese head spa
**Flow chart:**
```
Hero → Ritual → Tabbed menu → Gallery → Trust → Membership → FAQ → Visit → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/az-esthetics-head-spa/index.html

## 18. Dang Aesthetics
**Type:** Med spa · injectables/skin/body
**Flow chart:**
```
Hero → Tabbed treatments → Trust → Studio story → Stats → FAQ → Visit → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/dang-aesthetics/index.html

## 19. Eburnean Med Spa
**Type:** Med spa · Austin
**Flow chart:**
```
Hero → About → Treatments → Trust → Pull-quote → Differentiators → Gallery → FAQ → Contact → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/eburnean-med-spa/index.html

## 20. Figura Medspa
**Type:** Med spa · body contouring
**Flow chart:**
```
Hero → Segmented treatments → Trust → Why Figura → Stats → FAQ → Visit → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/figura-medspa/index.html

## 21. Glo Med Spa
**Type:** Med spa · bento layout
**Flow chart:**
```
Bento hero → Services bento → Trust → Team → Offers → FAQ → Contact/Map → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/glo-med-spa/index.html

## 22. Glowing Skin Med Spa
**Type:** Med spa · glow matcher
**Flow chart:**
```
Hero → Glow matcher → Vertical-tab treatments → Gallery → Trust → Stats → FAQ → Visit → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/glowing-skin-med-spa/index.html

## 23. Grace MedSpa & Body Solutions
**Type:** Med spa · financing
**Flow chart:**
```
Hero → Services → Trust → About → Financing → Gallery → FAQ → Contact/Map → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/grace-medspa/index.html

## 24. La Bella Med-Aesthetics
**Type:** Med spa · physician-led
**Flow chart:**
```
Hero → About → Treatments → Membership/gifts → Reviews → FAQ → Visit → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/la-bella-med-aesthetics/index.html

## 25. Live Lovely Spa
**Type:** Spa · facials · by Corina
**Flow chart:**
```
Hero → About → Services → Trust → Find-Your-Facial → Cold Plasma → Gift cards → FAQ → Contact → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/live-lovely-spa/index.html

## 26. LVS La Vie — Med + Day Spa
**Type:** Med spa · Rainey St
**Flow chart:**
```
Hero → Dual-mode toggle (Med/Day) → Trust → Rainey St → Stats → FAQ → Visit → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/lvs-la-vie-med-spas-day-spa/index.html

## 27. Millennial Med Spa
**Type:** Med spa · cinematic
**Flow chart:**
```
Cinematic hero → Manifesto → Treatments → Trust → Approach → Stats → FAQ → Contact/Map → Footer + chatbot
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/millennial-med-spa/index.html

## 28. NakedMD
**Type:** Med spa · minimalist
**Flow chart:**
```
Hero → Story → Best Sellers → Trust → Categories/Shop → Offers → Studios → FAQ → Contact/Book → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/nakedmd-med-spa/index.html

## 29. Neo Soma Healthcare
**Type:** Wellness · weight loss/anti-aging
**Flow chart:**
```
Hero → Trust → How It Works → Programs → Reviews → FAQ → Contact → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/neo-soma-health/index.html

## 30. Organic Spa, Massage & Skin Care
**Type:** Spa · wellness sanctuary
**Flow chart:**
```
Hero → Build-a-Ritual → Offers → Packages & Membership → FAQ → Visit/Contact → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/organic-spa-massage-skincare/index.html

## 31. RejuvaWell
**Type:** Med spa · NE Austin
**Flow chart:**
```
Hero → Treatments → How It Works → FAQ → Visit → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/rejuvawell/index.html

## 32. Rejuvenate Austin
**Type:** Med spa · physician-led
**Flow chart:**
```
Hero → Treatment Explorer → Meet the Provider → Reviews → Specials → FAQ → Contact/Visit → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/rejuvenate-austin/index.html

## 33. Skin Couture Med Spa
**Type:** Med spa · lookbook/atelier
**Flow chart:**
```
Hero → Lookbook → Atelier/Philosophy → Trust → FAQ → Visit → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/skin-couture-med-spa/index.html

## 34. Tender Laser Care
**Type:** Med spa · laser/whitening
**Flow chart:**
```
Hero → Services/Areas → Process → TLC Team → FAQ → Visit/Contact → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/tender-laser-care-of-austin-llc/index.html

## 35. Texas Laser & Aesthetics
**Type:** Med spa · Austin
**Flow chart:**
```
Hero → Services → Trust → Beyond → Reviews → FAQ → Contact/Visit → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/texas-laser-aesthetics/index.html

## 36. Ulala Med Spa
**Type:** Med spa · editorial
**Flow chart:**
```
Hero → Services → About (editorial) → Payment Plans → FAQ → Contact → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/ulala-med-spa/index.html

## 37. Victory Rejuvenate & Med Spa
**Type:** Med spa · hormone/longevity
**Flow chart:**
```
Hero → About → Services (filter) → Why Us → FAQ → Contact/Book → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/victory-medspa/index.html

## 38. VIO Med Spa Mueller
**Type:** Med spa · Austin
**Flow chart:**
```
Hero → Treatments → Providers → ClubVIO → FAQ → Contact/Book → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/vio-med-spa-mueller/index.html

## 39. Wild & Beautiful
**Type:** Med spa · natural beauty
**Flow chart:**
```
Hero → Treatments menu → Specials → Team → Membership → FAQ → Contact/Visit → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/wild-and-beautiful/index.html

---

# 🛒 E-commerce

## 40. NOVA — Premium Electronics
**Type:** E-commerce · curated electronics
**Flow chart:**
```
Hero → Shop (Best Sellers) → Categories → Why NOVA → Reviews → Newsletter CTA → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/nova-electronics-bundle/site/index.html

## 41. Ghorer Bazar
**Type:** E-commerce · grocery (SPA)
**Flow chart:**
```
Header → Navbar → Banner slider → All Products + filters → About → More Products → Footer (routes: product/checkout/login)
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/ghorer-bazar-react/dist/index.html

---

# 📊 CRM / SaaS dashboards

## 42. Maison OS
**Type:** Multi-brand property CRM suite
**Flow chart:**
```
Login → Property selection → {Auréa Restaurant CRM | Méridian Mall CRM} (Overview/Operations/.../Reviews)
```
**Localhost:** http://localhost:8000/AI_Uses/CRM-system/src/login.html
- Property selection — http://localhost:8000/AI_Uses/CRM-system/src/selection.html
- Méridian Mall CRM — http://localhost:8000/AI_Uses/CRM-system/src/mall.html
- Auréa Restaurant CRM — http://localhost:8000/AI_Uses/CRM-system/src/restaurant.html

## 43. RestroCloud
**Type:** Restaurant intelligence platform
**Flow chart:**
```
Marketing: Hero → Features → Floor Plan → Orders → Analytics → Pricing → AI Insights → Reviews · App: Login → Dashboard → {Support/Campaigns/Churn/…} (role-gated)
```
**Localhost:** http://localhost:8000/demo%20web/restrocloud.html
- Ultimate — http://localhost:8000/demo%20web/restrocloud_ultimate.html

## 44. RestroCloud App
**Type:** Restaurant ops · React SPA (login + dashboard)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Login (role-gated · ProtectedRoute) → Dashboard → {Support / Campaigns / Churn / …} (HashRouter SPA)
```
**Localhost:** http://localhost:8000/demo%20web/restrocloud-app/dist/index.html

## 45. MallOS CRM
**Type:** Enterprise mall platform · 16 views
**Flow chart:**
```
Executive Dashboard → Operations / Shoppers / Intelligence / Management (16 views, 5 groups)
```
**Localhost:** http://localhost:8000/demo%20web/Mall%20CRM/Mall-crm.html

---

# 🧠 Quiz & exam apps

## 46. Combat Academy — IQ Exam
**Type:** Timed online exam app + admin
**Flow chart:**
```
Start (Combat Academy) → timed exam (live clock) → question + multiple-choice options → Submit → result sheet → answer review · admin: Login → Exam Settings → set Questions → Save & Data
```
**Localhost:** http://localhost:8000/IQ_Exam/index.html
- Admin (set questions) — http://localhost:8000/IQ_Exam/admin.html

---

# 🌌 Backgrounds / motion / hero

## 47. Dotted Ripple Surface
**Type:** Three.js · rippling dot field
**Flow chart:**
```
Load → 40×60 Points grid → autonomous sine ripple → glow vignette
```
**Localhost:** http://localhost:8000/All_Site/dotted-surface-bg/index.html

## 48. Particle Weave House
**Type:** Three.js · particle weave (React)
**Flow chart:**
```
Load → wireframe house + pipes → particle weave → pointer repel + tilt (OrbitControls) → idle spin
```
**Localhost:** http://localhost:8000/All_Site/woven-house-hero/dist/index.html

## 49. Particle Torus Field
**Type:** Three.js · 50k-particle torus (React)
**Flow chart:**
```
Load (white) → 50k Points on torus knot → cursor repel + spring-back → rotating silk knot
```
**Localhost:** http://localhost:8000/All_Site/woven-light-bg/dist/index.html

## 50. 3D Pipe Cutaway House
**Type:** Three.js · cutaway pipe systems
**Flow chart:**
```
Load → cutaway house + pipe systems + labels → OrbitControls + toggles → flow particles along pipes
```
**Localhost:** http://localhost:8000/All_Site/house-plumbing-3d/index.html

## 51. Liquid-Glass Bloom
**Type:** CSS liquid-glass over video
**Flow chart:**
```
Load → fixed video bg + vignette → liquid-glass cards → hover scale
```
**Localhost:** http://localhost:8000/All_Site/bloom/index.html

## 52. Grainy Gradient Aurora
**Type:** Pure-CSS gradient auroras
**Flow chart:**
```
index: drifting auroras + stars → 3 snap panels → click copies gradient · blackhole: tilted conic accretion disks + spiraling particles
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/grainient-hero/index.html
- Black-hole variant — http://localhost:8000/beautiful-websites-kit/sites/grainient-hero/blackhole.html

## 53. Motion Lab Background Pack
**Type:** CSS + canvas + Three.js showcase
**Flow chart:**
```
CSS aurora hero → backgrounds (aurora/mesh/meteors/grid + canvas net) → buttons → micro-interactions → Three.js particle sphere + Spline
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/motion-lab-pack2/index.html

## 54. Parallax Video Background
**Type:** CSS-transform video parallax
**Flow chart:**
```
Load → full-viewport looping video + WELCOME → mousemove parallax → recenter on leave
```
**Localhost:** http://localhost:8000/Work/team-skill/index.html

## 55. Spinning Code Globe
**Type:** Three.js · spinning digital-Earth
**Flow chart:**
```
Load → points sampled onto real coastlines → live day/night terminator → atmosphere glow + sunrise flare → autonomous spin
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/code-globe-bg/index.html

## 56. Endless-Zoom Video Backdrop
**Type:** Dual-layer crossfade · endless zoom video
**Flow chart:**
```
Load → two reversed-clip video layers crossfade by sin² opacity for a seamless endless slow zoom-in → Darken / Sound / Replay controls → auto-hiding HUD
```
**Localhost:** http://localhost:8000/All_Site/video-bg-preview/index.html

## 58. Animated SVG Path Field
**Type:** animated SVG path field · hero background (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → flowing animated SVG path field → 'Background Paths' title reveals word-by-word → 'Discover Excellence' CTA → /services page with interactive selector (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/background-paths-app/out/index.html
- Services + selector — http://localhost:8000/All_Site/background-paths-app/out/services/index.html

---

# ✨ Hero & text effects

## 54. Video Parallax Scroll
**Type:** CSS-transform scroll parallax
**Flow chart:**
```
Load → full-viewport looping video + WELCOME → mousemove parallax → recenter on leave
```
**Localhost:** http://localhost:8000/Work/team-skill/index.html

## 57. Particle Text Morph
**Type:** Canvas particle text morph (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → canvas particles assemble into a word → auto-morph HELLO → WELCOME → LET'S BUILD → hold right-click to scatter particles (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/particle-text-effect-app/out/index.html

## 58. SVG Path Line Effect
**Type:** animated line-art hero effect
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → flowing animated SVG path field → 'Background Paths' title reveals word-by-word → 'Discover Excellence' CTA → /services page with interactive selector (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/background-paths-app/out/index.html
- Services + selector — http://localhost:8000/All_Site/background-paths-app/out/services/index.html

## 59. 3D Card Scroll Reveal
**Type:** Scroll-linked 3D card hero (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Scroll → 3D card tilts from 20° to flat + scales in → heading lifts up → device-mockup frame reveals the image (Aceternity · Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/container-scroll-app/out/index.html

## 60. Scroll Story Slideshow
**Type:** Scroll-driven sticky slideshow (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Scroll → sticky full-screen panel swaps slides by scroll position → side step-nav (click to jump) → large animated headings per slide (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/scrolling-story-app/out/index.html

## 61. Scroll-Rotate Photo Ring
**Type:** scroll-driven 3D photo ring
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → 10 cards in a 3D ring (perspective + rotateY) → scroll rotates the ring 360° → idle auto-spin → depth-fade dimming + spring progress bar (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/circular-gallery-app/out/index.html

## 93. Split-Flap Flip Effect
**Type:** Web Animations split-flap effect
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → portrait panel split top/bottom on a hinge → Prev / Next flips the split-flap (Web Animations API · rotateX) → new Unsplash photo + caption reveal (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/flip-gallery-app/out/index.html

## 94. Scroll-Expand Media Hero
**Type:** Scroll-expanding media hero (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → 'Immersive Video Experience' title → scroll expands the centre media to full-bleed → 'About This Component' content reveals below (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/scroll-expansion-hero-app/out/index.html

---

# 🏆 Showcases / libraries / systems

## 62. Beautiful Sites — Premium Redesigns
**Type:** Portfolio of redesigns
**Flow chart:**
```
Hero → Stats → Selected Work grid (6 redesigns) → Process → CTA mailto → Footer
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/showcase/index.html

## 63. UI/UX Pro Max
**Type:** Design library, data-rendered
**Flow chart:**
```
Hero → Styles → Palettes → Type → UX rules → Charts → Products → Stacks (data-rendered, searchable)
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/sites/uiux-pro-max/index.html
- Pack2 showcase — http://localhost:8000/beautiful-websites-kit/sites/pack2-showcase/index.html

## 64. RUBRIC creative-engine
**Type:** Internal tool console · multi-screen
**Flow chart:**
```
Console → Agents / Flows / Skill Trees / Crons / Team
```
**Localhost:** http://localhost:8000/Work/creative-engine-template/rubric/templates/scaffold/index.html
- Agents — http://localhost:8000/Work/creative-engine-template/rubric/templates/agents/index.html
- Flows — http://localhost:8000/Work/creative-engine-template/rubric/templates/flows/index.html
- Skill Trees — http://localhost:8000/Work/creative-engine-template/rubric/templates/skill-trees/index.html
- Crons — http://localhost:8000/Work/creative-engine-template/rubric/templates/crons/index.html
- Team — http://localhost:8000/Work/creative-engine-template/rubric/templates/team/index.html

## 65. Launchbox — Logo System
**Type:** Brand/logo system + renders
**Flow chart:**
```
System page (symbol → wordmark → marks → favicon → color → rules) → render views (hero/dark/wordmark/symbol/app-icon/presentation)
```
**Localhost:** http://localhost:8000/LOGO-skills-bundle/Launchbox/index.html
- Hero — http://localhost:8000/LOGO-skills-bundle/Launchbox/render/hero.html
- Hero dark — http://localhost:8000/LOGO-skills-bundle/Launchbox/render/hero-dark.html
- Wordmark — http://localhost:8000/LOGO-skills-bundle/Launchbox/render/wordmark.html
- Symbol — http://localhost:8000/LOGO-skills-bundle/Launchbox/render/symbol.html
- App icon — http://localhost:8000/LOGO-skills-bundle/Launchbox/render/app-icon.html
- Presentation — http://localhost:8000/LOGO-skills-bundle/Launchbox/render/presentation.html

## 66. IRONHAND — Theme Showcase
**Type:** Color-theme picker · 5 variants
**Flow chart:**
```
Pick a color theme → live preview of the IRONHAND Plumbing site in Blue / Copper / Green / Violet / White
```
**Localhost:** http://localhost:8000/All_Site/ironhand-plumbing/theme-previews/index.html
- Blue — http://localhost:8000/All_Site/ironhand-plumbing/theme-previews/blue/index.html
- Copper — http://localhost:8000/All_Site/ironhand-plumbing/theme-previews/copper/index.html
- Green — http://localhost:8000/All_Site/ironhand-plumbing/theme-previews/green/index.html
- Violet — http://localhost:8000/All_Site/ironhand-plumbing/theme-previews/violet/index.html
- White — http://localhost:8000/All_Site/ironhand-plumbing/theme-previews/white/index.html

## 67. Jamison William — 18 Niche Templates
**Type:** Home-services template library · index
**Notes:** Work-in-progress
**Flow chart:**
```
Title → grid of 18 home-service niche template cards (Plumber · Roofing · HVAC · Tree Service · General Contractor · Remodeling · Concrete · Foundation Repair · Fencing · Deck Builder · Electrical · Paving · Pool · Septic · Garage Door · Landscaping · Pressure Washing · Junk Removal) → click a niche → its landing template
```
**Localhost:** http://localhost:8000/beautiful-websites-kit/templates/index.html

## 68. Hargrove & Sons — Footer Lab
**Type:** footer effects, taken apart
**Flow chart:**
```
One footer, taken apart → Sticky pop-up reveal (rotate into place) → Meteor-shower background → Staggered column reveal → Gradient wordmark + brass rule → Live assembled footer
```
**Localhost:** http://localhost:8000/All_Site/hargrove-plumbing/footer-showcase/index.html

---

# 🔤 Font / headline showcases

## 69. Headline Font Picker
**Type:** Headline type picker · 15 options
**Flow chart:**
```
Pick your headline type → live preview of the IRONHAND headline rendered in 15 candidate display typefaces
```
**Localhost:** http://localhost:8000/All_Site/ironhand-plumbing/font-showcase/index.html

---

# 📸 Photo / gallery showcases

## 61. Circular 3D Photo Gallery
**Type:** scroll-to-rotate 3D photo gallery (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → 10 cards in a 3D ring (perspective + rotateY) → scroll rotates the ring 360° → idle auto-spin → depth-fade dimming + spring progress bar (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/circular-gallery-app/out/index.html

## 70. Work Photo Gallery
**Type:** Work-gallery section demo · standalone
**Flow chart:**
```
See the work → standalone demo of the photo / job-gallery section treatment for the IRONHAND site
```
**Localhost:** http://localhost:8000/All_Site/ironhand-plumbing/photo-showcase/index.html

## 93. Flip Split-Flap Gallery
**Type:** 3D split-flap photo gallery (Next.js)
**Notes:** React (needs `npm run dev`)
**Flow chart:**
```
Load → portrait panel split top/bottom on a hinge → Prev / Next flips the split-flap (Web Animations API · rotateX) → new Unsplash photo + caption reveal (Next.js static export)
```
**Localhost:** http://localhost:8000/All_Site/flip-gallery-app/out/index.html

---

# ⭐ Review-section showcases

## 71. Review Section Layouts
**Type:** 6 review-section layouts
**Flow chart:**
```
Six ways to show reviews → Google/Trust Strip → Verified Card Grid → Wall of Love (Masonry) → Spotlight Carousel → Stats + Featured → Auto-scroll Marquee
```
**Localhost:** http://localhost:8000/All_Site/ironhand-plumbing/review-showcase/index.html

---

# 🌃 Neon / after-dark landings

## 95. Neon Drive
**Type:** synthwave arcade-racer landing
**Flow chart:**
```
Hero: Outrun the Night → Built for the fast lane → Four worlds, endless night → Pick your ride → Ready Player? → Footer
```
**Localhost:** http://localhost:8000/All_Site/neon-drive/index.html

## 96. Nightscape
**Type:** architectural outdoor-lighting studio
**Flow chart:**
```
Hero: Your Yard After Dark → Built to glow after dark → Built by day, alive by night → Start your nightscape → Ready to Glow? → Footer
```
**Localhost:** http://localhost:8000/All_Site/nightscape/index.html

## 97. Voltline Electric (Neon)
**Type:** Seattle electrician landing
**Flow chart:**
```
Hero: the power stays on → Tripping breaker → 200-amp panel → Panels, EV chargers & generators → Licensed electrician → Upfront pricing → Footer
```
**Localhost:** http://localhost:8000/All_Site/voltline-neon/index.html

---

# 🗑️ Throwaway design

## 72. Hargrove — Deep Ocean (dark)
**Type:** Throwaway dark-theme variant · Hargrove homepage
**Notes:** Work-in-progress
**Flow chart:**
```
Dark Deep-Ocean theme of the Hargrove homepage → Hero → Services → Story → Reviews → Booking → Footer
```
**Localhost:** http://localhost:8000/All_Site/hargrove-plumbing/dark-1.html

## 73. Hargrove — Midnight (dark)
**Type:** Throwaway dark-theme variant · Hargrove homepage
**Notes:** Work-in-progress
**Flow chart:**
```
Dark Midnight theme of the Hargrove homepage → Hero → Services → Story → Reviews → Booking → Footer
```
**Localhost:** http://localhost:8000/All_Site/hargrove-plumbing/dark-2.html

## 74. Hargrove — Indigo Night (dark)
**Type:** Throwaway dark-theme variant · Hargrove homepage
**Notes:** Work-in-progress
**Flow chart:**
```
Dark Indigo-Night theme of the Hargrove homepage → Hero → Services → Story → Reviews → Booking → Footer
```
**Localhost:** http://localhost:8000/All_Site/hargrove-plumbing/dark-3.html

---

## Summary by category

_Counts include cross-listed sites, so they sum to more than the total; the total is the unique-site count._

| Category | Cards |
|---|---|
| 🔧 Plumbing & home-services | 14 |
| 🧰 Home-service niche templates | 18 |
| 💆 Med spa / aesthetics | 26 |
| 🛒 E-commerce | 2 |
| 📊 CRM / SaaS dashboards | 4 |
| 🧠 Quiz & exam apps | 1 |
| 🌌 Backgrounds / motion / hero | 11 |
| ✨ Hero & text effects | 8 |
| 🏆 Showcases / libraries / systems | 7 |
| 🔤 Font / headline showcases | 1 |
| 📸 Photo / gallery showcases | 3 |
| ⭐ Review-section showcases | 1 |
| 🌃 Neon / after-dark landings | 3 |
| 🗑️ Throwaway design | 3 |
| **Total (unique sites)** | **98** |

_Generated by `build.js`. Edit `sites.json` or run `/Update_MyWebsitePortfolio`, never edit this file by hand._
