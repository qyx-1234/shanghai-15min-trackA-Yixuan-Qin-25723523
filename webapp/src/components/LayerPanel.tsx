import type { TravelMode, LayerType } from '../types';

interface LayerPanelProps {
  travelMode: TravelMode;
  layerType: LayerType;
  onTravelModeChange: (mode: TravelMode) => void;
  onLayerTypeChange: (layer: LayerType) => void;
  onRecommenderToggle: () => void;
  onTransparencyToggle: () => void;
}

const MODES: { key: TravelMode; label: string; icon: string }[] = [
  { key: 'walk', label: 'Walk', icon: '🚶' },
  { key: 'bike', label: 'Bike', icon: '🚲' },
  { key: 'transit', label: 'Transit', icon: '🚇' },
  { key: 'car', label: 'Car', icon: '🚗' },
];

const LAYERS: { key: LayerType; label: string }[] = [
  { key: 'composite', label: 'Composite' },
  { key: 'baseline', label: 'Baseline' },
  { key: 'track', label: 'Track A' },
];

export default function LayerPanel({
  travelMode,
  layerType,
  onTravelModeChange,
  onLayerTypeChange,
  onRecommenderToggle,
  onTransparencyToggle,
}: LayerPanelProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur text-white rounded-lg p-4 shadow-xl w-64">
      {/* Title */}
      <h1 className="text-lg font-bold mb-3">15-Min Shanghai</h1>

      {/* Travel Mode Toggle */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">
          Travel Mode
        </label>
        <div className="grid grid-cols-4 gap-1">
          {MODES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onTravelModeChange(key)}
              className={`p-2 rounded text-xs font-medium transition-colors ${
                travelMode === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={label}
            >
              <span className="block text-base">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Toggle */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">
          Map Layer
        </label>
        <div className="flex gap-1">
          {LAYERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onLayerTypeChange(key)}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                layerType === key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onRecommenderToggle}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm font-medium transition-colors"
        >
          Where to Live?
        </button>
        <button
          onClick={onTransparencyToggle}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
        >
          Data & Methodology
        </button>
      </div>
    </div>
  );
}
