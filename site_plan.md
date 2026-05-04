# SimoDevel Site Plan - Technical Resource for Simulation Model Developers

## Objective
Create a **simple, technical-focused resource site** for developers working with SPICE, MATLAB/Simulink, LTSpice, Verilog-A, Python (SymPy/Scipy/NGSpice), Cadence/Synopsys models. 100% static HTML/CSS/JS - no frameworks, fast loading.

## Key Focus: Technical Content
- SPICE subcircuits (.lib, .cir files)
- LTSpice symbols/models download
- MATLAB m-files + toolbox extensions
- Verilog-AMS modules
- Python simulation scripts (PySpice, Scipy ODE)
- Parameter extraction techniques
- Cross-platform model validation

## Site Structure (One-Page Technical Hub)
1. **Hero**: \"SimoDevel - Simulation Models Hub\" | Search bar for models

2. **Model Library** (Tabbed/Categories)
   - Amplifiers (OpAmp, Transconductance)
   - Transistors (MOSFET, BJT behavioral)
   - Passives (custom R/C/L with temp dependence)
   - Digital (Verilog-A gates, behavioral)
   - Sources (PWM, noise generators)
   - Each: Syntax highlighted code, Download ZIP, Live demo links

3. **Tutorials & Techniques**
   - \"Writing temperature-dependent models\"
   - \"Monte-Carlo analysis setup\"
   - \"HB/Harmonic Balance convergence\"
   - Code snippets + full examples

4. **Tools & References**
   | Tool | Link | Notes |
   |------|------|-------|
   | LTSpice XVII | Download | Free |
   | NGSpice | Download | Python integration |
   | PySpice | Docs | Full SPICE in Python |

5. **Contribute** 
   - GitHub template for new models
   - Validation checklist
   - Pull request guidelines

6. **API/Search** (simple JS)
   - Filter models by simulator/category
   - Syntax highlighter (Prism.js CDN)

## Tech Stack (Minimal)
- HTML5 semantic
- CSS Grid + Tailwind CSS CDN (or pure CSS)
- Prism.js for code highlighting
- Vanilla JS for search/filter
- Dark mode toggle
- PWA capable (service worker)
- GitHub Pages deploy

## MVP Timeline
1. HTML skeleton + categories (1h)
2. Sample models (5-10 verified SPICE/MATLAB) (2h)
3. CSS styling + responsive (1h)
4. JS search/highlight (1h)
5. Deploy/test (30min)

**Total: ~5h for functional technical hub**

Ready to implement?
