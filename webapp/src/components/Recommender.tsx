import { useState, useCallback } from 'react';
import type { H3HexFeature, RecommenderWeights } from '../types';
import { recomputeScores } from '../utils/scoring';

interface RecommenderProps {
  data: H3HexFeature[] | null;
  weights: RecommenderWeights;
  onWeightsChange: (weights: RecommenderWeights) => void;
  onTopHexesChange: (hexIds: string[]) => void;
  onClose: () => void;
}

const SLIDERS: { key: keyof RecommenderWeights; label: string; description: string }[] = [
  { key: 'green', label: 'Green Space & Nature', description: 'Parks, greenery, clean air' },
  { key: 'fitness', label: 'Fitness & Sport', description: 'Gyms, pools, sports fields' },
  { key: 'markets', label: 'Fresh Food Markets', description: 'Healthy food access' },
  { key: 'schools', label: 'Schools & Education', description: 'Quality education nearby' },
  { key: 'transit', label: 'Public Transit', description: 'Metro, bus connectivity' },
];

export default function Recommender({
  data,
  weights,
  onWeightsChange,
  onTopHexesChange,
  onClose,
}: RecommenderProps) {
  const [localWeights, setLocalWeights] = useState<RecommenderWeights>(weights);

  const handleSliderChange = useCallback(
    (key: keyof RecommenderWeights, value: number) => {
      const newWeights = { ...localWeights, [key]: value };
      setLocalWeights(newWeights);
    },
    [localWeights]
  );

  const handleFind = useCallback(() => {
    if (!data) return;

    onWeightsChange(localWeights);
    const scored = recomputeScores(data, localWeights);
    const top10 = scored.slice(0, 10).map((s) => s.feature.properties.h3);
    onTopHexesChange(top10);

    console.log(
      `Recommender: found top 10 hexes (best score: ${scored[0]?.score.toFixed(3)})`
    );
  }, [data, localWeights, onWeightsChange, onTopHexesChange]);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 bg-gray-900/95 backdrop-blur text-white rounded-lg p-5 shadow-xl max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Where to Live?</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl leading-none p-1"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Slide to set your priorities. We'll find the best hexagons for your lifestyle.
      </p>

      {/* Sliders */}
      <div className="space-y-3 mb-4">
        {SLIDERS.map(({ key, label, description }) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">{label}</span>
              <span className="text-gray-500 font-mono">
                {Math.round(localWeights[key] * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localWeights[key]}
              onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-xs text-gray-600 mt-0.5">{description}</p>
          </div>
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={handleFind}
        disabled={!data}
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded text-sm font-bold transition-colors"
      >
        Find My Top 10 Hexagons
      </button>

      <p className="text-xs text-gray-600 text-center mt-2">
        Top matches are highlighted in gold on the map
      </p>
    </div>
  );
}
