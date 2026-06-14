interface TransparencyPanelProps {
  onClose: () => void;
}

export default function TransparencyPanel({ onClose }: TransparencyPanelProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 text-white rounded-lg p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto">
        {/* Close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Data & Methodology</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none p-1"
          >
            ×
          </button>
        </div>

        {/* Data Sources */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">Data Sources</h3>
          <div className="space-y-3 text-sm">
            <DataItem
              name="Amap (Gaode) POI"
              source="28,750 Points of Interest across Shanghai"
              date="Provided May 2026"
              notes="3-level Amap taxonomy. Core data for 12 of 15 indicators."
            />
            <DataItem
              name="Anjuke Real Estate"
              source="467,030 housing listings"
              date="Provided May 2026"
              notes="Price/m², location, bedrooms, surface area. 19 Shanghai districts."
            />
            <DataItem
              name="Shanghai Buildings"
              source="1.76M building footprints"
              date="Provided May 2026"
              notes="WKB geometry. Used for built-up density validation."
            />
            <DataItem
              name="OpenStreetMap"
              source="OSM Contributors / Geofabrik"
              date="May 2026 download"
              notes="Road networks (walk/bike/drive), supplemental POIs, transit stops."
            />
            <DataItem
              name="Shanghai Administrative Boundaries"
              source="16 districts, 266 towns, 5,614 villages"
              date="Provided May 2026"
              notes="CRS84 (EPSG:4326). District boundaries for spatial joins."
            />
            <DataItem
              name="Sentinel-2 NDVI"
              source="ESA Copernicus / Google Earth Engine"
              date="2024 growing season"
              notes="Median NDVI composite at 10m resolution. Cloud-masked."
            />
            <DataItem
              name="AQI Data"
              source="AQICN / CNEMC"
              date="2024 annual average"
              notes="District-level air quality index from monitoring stations."
            />
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-green-400">Methodology</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Grid:</strong> 500m × 500m fishnet grid over Shanghai (~25,000 cells).
              Only cells whose centroid falls within the Shanghai land boundary are retained.
            </p>
            <p>
              <strong>Isochrones:</strong> Network-constrained accessibility using Pandana
              (contraction hierarchy on OSM street network). Travel thresholds: walk = 1,000m
              network, bike = 3,000m network, car = 5,000m Euclidean.
            </p>
            <p>
              <strong>Scoring:</strong> Min-max normalization of continuous distances to [0, 1].
              For each indicator, the better of walk or bike access is used (reflecting real travel choice).
              Equal-weight composite of 6 baseline + 9 Track A indicators.
            </p>
            <p>
              <strong>H3 Aggregation:</strong> Uber H3 resolution 8 hexagons (~0.74 km² each).
              Grid cell scores averaged within each hexagon.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">Limitations</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
            <li>Amap POI data underrepresents transit (40 metro entries vs. 500+ real stations)</li>
            <li>Isochrones use simplified network distances, not real-time routing</li>
            <li>Transit mode uses stop proximity rather than full GTFS routing</li>
            <li>NDVI and AQI data require separate collection (placeholders shown)</li>
            <li>Equal indicator weighting may not reflect individual preferences</li>
            <li>POI count does not measure quality, capacity, or opening hours</li>
            <li>Building data covers structure footprints only — not height or use</li>
          </ul>
        </section>

        {/* GitHub */}
        <div className="text-center pt-4 border-t border-gray-700">
          <a
            href="https://github.com/YOUR_USERNAME/shanghai-15min-trackA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View full analysis on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

function DataItem({
  name,
  source,
  date,
  notes,
}: {
  name: string;
  source: string;
  date: string;
  notes: string;
}) {
  return (
    <div className="bg-gray-800 rounded p-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-medium text-white">{name}</span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-xs text-gray-400">{source}</p>
      <p className="text-xs text-gray-500 mt-1">{notes}</p>
    </div>
  );
}
