import { useState, useCallback } from 'react';
import type { TravelMode, LayerType, MapState, H3HexFeature, RecommenderWeights } from '../types';

// Default view: Shanghai center
const DEFAULT_MAP_STATE: MapState = {
  longitude: 121.47,
  latitude: 31.23,
  zoom: 10.3,
  pitch: 0,
  bearing: 0,
};

export function useMapState() {
  const [viewState, setViewState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [travelMode, setTravelMode] = useState<TravelMode>('walk');
  const [layerType, setLayerType] = useState<LayerType>('composite');
  const [selectedHex, setSelectedHex] = useState<H3HexFeature | null>(null);
  const [hoveredHex, setHoveredHex] = useState<H3HexFeature | null>(null);
  const [recommenderWeights, setRecommenderWeights] = useState<RecommenderWeights>({
    green: 0.5,
    fitness: 0.5,
    markets: 0.5,
    schools: 0.5,
    transit: 0.5,
  });
  const [showRecommender, setShowRecommender] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  const [topHexes, setTopHexes] = useState<string[]>([]);

  const handleViewStateChange = useCallback((newState: { longitude: number; latitude: number; zoom: number; pitch: number; bearing: number }) => {
    setViewState(newState);
  }, []);

  return {
    viewState,
    travelMode,
    layerType,
    selectedHex,
    hoveredHex,
    recommenderWeights,
    showRecommender,
    showTransparency,
    topHexes,
    setTravelMode,
    setLayerType,
    setSelectedHex,
    setHoveredHex,
    setRecommenderWeights,
    setShowRecommender,
    setShowTransparency,
    setTopHexes,
    handleViewStateChange,
  };
}
