import { useCallback } from 'react';
import MapView from './components/MapView';
import LayerPanel from './components/LayerPanel';
import HexDetailPanel from './components/HexDetailPanel';
import Recommender from './components/Recommender';
import TransparencyPanel from './components/TransparencyPanel';
import Legend from './components/Legend';
import { useH3Data } from './hooks/useH3Data';
import { useMapState } from './hooks/useMapState';
import type { TravelMode, LayerType, H3HexFeature, RecommenderWeights } from './types';

export default function App() {
  const { data, loading, error, minScore, maxScore } = useH3Data();

  const {
    viewState,
    travelMode,
    layerType,
    selectedHex,
    recommenderWeights,
    showRecommender,
    showTransparency,
    topHexes,
    setTravelMode,
    setLayerType,
    setSelectedHex,
    setRecommenderWeights,
    setShowRecommender,
    setShowTransparency,
    setTopHexes,
    handleViewStateChange,
  } = useMapState();

  const handleHexClick = useCallback((hex: H3HexFeature | null) => {
    setSelectedHex(hex);
  }, [setSelectedHex]);

  const handleHexHover = useCallback((_hex: H3HexFeature | null) => {
    // Hover state reserved for future cursor effects
  }, []);

  const handleModeChange = useCallback((mode: TravelMode) => {
    setTravelMode(mode);
  }, [setTravelMode]);

  const handleLayerChange = useCallback((layer: LayerType) => {
    setLayerType(layer);
  }, [setLayerType]);

  const handleRecommenderToggle = useCallback(() => {
    setShowRecommender((prev) => !prev);
    if (!showRecommender) setTopHexes([]);
  }, [showRecommender, setShowRecommender, setTopHexes]);

  const handleTransparencyToggle = useCallback(() => {
    setShowTransparency((prev) => !prev);
  }, [setShowTransparency]);

  const handleWeightsChange = useCallback((weights: RecommenderWeights) => {
    setRecommenderWeights(weights);
  }, [setRecommenderWeights]);

  const handleTopHexesChange = useCallback((hexIds: string[]) => {
    setTopHexes(hexIds);
  }, [setTopHexes]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gray-900">
      {/* Map */}
      <MapView
        data={data}
        loading={loading}
        error={error}
        viewState={viewState}
        travelMode={travelMode}
        layerType={layerType}
        topHexes={topHexes}
        onViewStateChange={handleViewStateChange}
        onHexClick={handleHexClick}
        onHexHover={handleHexHover}
      />

      {/* Layer Panel (top-left) */}
      <LayerPanel
        travelMode={travelMode}
        layerType={layerType}
        onTravelModeChange={handleModeChange}
        onLayerTypeChange={handleLayerChange}
        onRecommenderToggle={handleRecommenderToggle}
        onTransparencyToggle={handleTransparencyToggle}
      />

      {/* Hex Detail Panel (top-right, on hex click) */}
      <HexDetailPanel hex={selectedHex} onClose={() => setSelectedHex(null)} />

      {/* Legend (bottom-right) */}
      <Legend minScore={minScore} maxScore={maxScore} />

      {/* Recommender (bottom panel) */}
      {showRecommender && (
        <Recommender
          data={data}
          weights={recommenderWeights}
          onWeightsChange={handleWeightsChange}
          onTopHexesChange={handleTopHexesChange}
          onClose={() => setShowRecommender(false)}
        />
      )}

      {/* Transparency Modal */}
      {showTransparency && (
        <TransparencyPanel onClose={() => setShowTransparency(false)} />
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 z-10 text-xs text-gray-500">
        Data: Amap, OSM, Anjuke, ESA Sentinel-2 | H3 resolution 8 |
        <a
          href="https://github.com/YOUR_USERNAME/shanghai-15min-trackA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white ml-1"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
