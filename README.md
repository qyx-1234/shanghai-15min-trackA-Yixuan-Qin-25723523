# 15-Minute Shanghai — Track A: Healthy Lifestyle & Sport

Urban data analysis graduate project assessing Shanghai's urban livability through the 15-minute city lens, with a focus on healthy lifestyle and sport infrastructure access.

## Project Structure

```
├── notebooks/
│   ├── 01_data_collection.ipynb   # Literature review + data sourcing & cleaning
│   ├── 02_grid_isochrones.ipynb   # 500m grid + 4-mode isochrones
│   └── 03_scoring_h3.ipynb        # Scoring + H3 aggregation + GeoJSON export
├── webapp/                         # React + deck.gl + MapLibre GL JS
│   └── src/
│       ├── components/             # MapView, LayerPanel, HexDetailPanel, etc.
│       ├── hooks/                  # useH3Data, useMapState
│       └── utils/                  # colorScales, scoring
├── data/
│   ├── raw/                        # Original data files
│   ├── processed/                  # Intermediate outputs
│   └── output/                     # GeoJSON for web app
└── requirements.txt
```

## Quick Start

### Python Notebooks

```bash
pip install -r requirements.txt
jupyter notebook notebooks/
```

### Web Application

```bash
cd webapp
npm install
npm run dev       # Development server
npm run build     # Production build
```

After running Notebook 03, copy the output GeoJSON to the web app:

```bash
cp data/output/h3_scored_composite.geojson webapp/public/data/
```

## Data Sources

| Source | Content |
|--------|---------|
| Amap (Gaode) | 28,750 POIs across Shanghai |
| OpenStreetMap | Road networks, transit stops, supplemental POIs |
| Anjuke | 467K real estate listings (price/m², location) |
| Shanghai Buildings | 1.76M building footprints |
| Sentinel-2 / GEE | NDVI vegetation index (10m) |
| AQICN / CNEMC | Air Quality Index by district |

## Methodology

- **Grid:** 500m fishnet over Shanghai (~25,000 valid cells)
- **Isochrones:** Pandana network-constrained (OSM walk/bike/drive graphs)
- **Scoring:** Min-max normalization, equal-weight composite (6 baseline + 9 Track A indicators)
- **Aggregation:** H3 resolution 8 hexagons (~0.74 km², ~6,000-8,000 hexes)
- **Web:** React + deck.gl H3HexagonLayer + MapLibre GL JS (free, no API key)

## Track A Indicators

**Baseline (all students):** Food, healthcare, education, public transit, green space, daily services

**Track A — Healthy Lifestyle & Sport:**
Gym/fitness, outdoor exercise equipment, sports fields/courts, swimming pools,
yoga/dance studios, cycling lane length, fresh/health food markets, NDVI greenery, AQI

## Deliverables

1. **Python Notebooks** (35%) — 3 documented notebooks in GitHub repository
2. **Web Application** (35%) — Deployed on Vercel, <4s load, mobile-ready
3. **Trello Board** (15%) — 5-sprint agile project management
4. **Literature Review** (15%) — 800 words, 4+ papers, in Notebook 01 header

## License

Educational project. Data from third-party sources subject to their respective terms.
