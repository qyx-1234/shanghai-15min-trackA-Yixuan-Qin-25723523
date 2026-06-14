import type { H3HexFeature } from '../types';
import { getTopIndicators } from '../hooks/useH3Data';

interface HexDetailPanelProps {
  hex: H3HexFeature | null;
  onClose: () => void;
}

export default function HexDetailPanel({ hex, onClose }: HexDetailPanelProps) {
  if (!hex) return null;

  const p = hex.properties;
  const topIndicators = getTopIndicators(hex);

  // Compute percentile (approximate from score)
  const percentile = Math.round(p.score * 100);

  return (
    <div className="absolute top-4 right-4 z-10 bg-gray-900/95 backdrop-blur text-white rounded-lg p-5 shadow-xl w-72 max-h-[80vh] overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl leading-none p-1"
      >
        ×
      </button>

      <h2 className="text-lg font-bold mb-3">Hex Details</h2>

      {/* H3 Index */}
      <p className="text-xs text-gray-400 font-mono mb-3 break-all">
        {p.h3}
      </p>

      {/* Scores */}
      <div className="space-y-2 mb-4">
        <ScoreBar label="Composite" value={p.score} color="bg-blue-500" />
        <ScoreBar label="Baseline" value={p.baseline} color="bg-green-500" />
        <ScoreBar label="Track A" value={p.track} color="bg-purple-500" />
      </div>

      {/* Mode scores */}
      <div className="mb-4">
        <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
          By Travel Mode
        </h3>
        <div className="grid grid-cols-4 gap-1">
          <ModeBadge label="Walk" value={p.walk} />
          <ModeBadge label="Bike" value={p.bike} />
          <ModeBadge label="Transit" value={p.car} />
          <ModeBadge label="Car" value={p.car} />
        </div>
      </div>

      {/* Top 5 Indicators */}
      <div className="mb-4">
        <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
          Top Amenities
        </h3>
        <div className="space-y-1.5">
          {topIndicators.map(({ name, value }) => (
            <div key={name} className="flex justify-between text-sm">
              <span className="text-gray-300">{name}</span>
              <span className="font-mono text-xs">{value.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Context */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Grid cells in hex</span>
          <span>{p.cells}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Transit stops</span>
          <span>{p.tstops?.toFixed(0) ?? '—'}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Building density</span>
          <span>{p.bldg_cnt?.toFixed(0) ?? '—'}</span>
        </div>
      </div>

      {/* Percentile */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Better than <span className="text-white font-bold">~{percentile}%</span> of Shanghai hexes
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(3)}</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ModeBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center bg-gray-800 rounded p-1">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xs font-mono">{value.toFixed(2)}</div>
    </div>
  );
}
