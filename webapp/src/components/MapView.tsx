import { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import type { MapViewState } from '@deck.gl/core';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { H3HexFeature, TravelMode, LayerType, MapState } from '../types';
import { getScoreColor } from '../utils/colorScales';
import { getHexScore } from '../hooks/useH3Data';

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

interface MapViewProps {
  data: H3HexFeature[] | null;
  loading: boolean;
  error: string | null;
  viewState: MapState;
  travelMode: TravelMode;
  layerType: LayerType;
  topHexes: string[];
  onViewStateChange: (state: MapState) => void;
  onHexClick: (hex: H3HexFeature | null) => void;
  onHexHover: (hex: H3HexFeature | null) => void;
}

export default function MapView({
  data,
  loading,
  error,
  viewState,
  travelMode,
  layerType,
  topHexes,
  onViewStateChange,
  onHexClick,
  onHexHover,
}: MapViewProps) {
  const topHexSet = useMemo(() => new Set(topHexes), [topHexes]);

  const hexLayer = useMemo(() => {
    if (!data) return null;

    const scores = data.map((f) => getHexScore(f, travelMode, layerType));
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    const normalize = (score: number) =>
      maxScore > minScore ? (score - minScore) / (maxScore - minScore) : 0.5;

    return new GeoJsonLayer({
      id: 'h3-hex-layer',
      data: {
        type: 'FeatureCollection',
        features: data,
      },
      pickable: true,
      filled: true,
      stroked: true,
      opacity: 0.9,

      getFillColor: (feature) => {
        const score = getHexScore(feature as H3HexFeature, travelMode, layerType);
        return [...getScoreColor(normalize(score)), 210];
      },
      getLineColor: (feature) => {
        const hex = feature as H3HexFeature;
        if (topHexSet.has(hex.properties.h3)) return [255, 215, 0, 255];
        return [20, 28, 32, 180];
      },
      getLineWidth: (feature) =>
        topHexSet.has((feature as H3HexFeature).properties.h3) ? 3 : 1,
      lineWidthMinPixels: 1,

      onClick: (info) => {
        onHexClick((info.object as H3HexFeature | undefined) ?? null);
      },
      onHover: (info) => {
        onHexHover((info.object as H3HexFeature | undefined) ?? null);
      },

      updateTriggers: {
        getFillColor: [travelMode, layerType, topHexes],
      },

      transitions: {
        getFillColor: 500,
      },
    });
  }, [data, travelMode, layerType, topHexSet, onHexClick, onHexHover]);

  const layers = hexLayer ? [hexLayer] : [];

  const deckViewState: MapViewState = {
    longitude: viewState.longitude,
    latitude: viewState.latitude,
    zoom: viewState.zoom,
    pitch: viewState.pitch,
    bearing: viewState.bearing,
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto mb-4" />
          <p className="text-lg">Loading Shanghai H3 data...</p>
          <p className="text-sm text-gray-400 mt-2">This should take under 4 seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
        <div className="text-center p-8 max-w-md">
          <p className="text-red-400 text-xl mb-2">Error Loading Data</p>
          <p className="text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Ensure the GeoJSON file is placed in <code>public/data/</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <DeckGL
      initialViewState={deckViewState}
      controller={{ doubleClickZoom: true, touchRotate: true }}
      onViewStateChange={(params) => {
        const vs = params.viewState as MapViewState;
        if ('longitude' in vs && vs.longitude != null) {
          onViewStateChange({
            longitude: vs.longitude,
            latitude: vs.latitude ?? 31.23,
            zoom: vs.zoom ?? 10,
            pitch: vs.pitch ?? 0,
            bearing: vs.bearing ?? 0,
          });
        }
      }}
      layers={layers}
      getTooltip={({ object }: { object?: H3HexFeature }) => {
        if (!object) return null;
        const p = object.properties;
        const score = getHexScore(object, travelMode, layerType);
        return {
          html: `<div style="font-family:sans-serif;font-size:13px;line-height:1.5">
            <b>H3: ${p.h3.slice(0, 12)}...</b><br/>
            <b>Score:</b> ${score.toFixed(3)}<br/>
            Baseline: ${p.baseline.toFixed(3)} | Track A: ${p.track.toFixed(3)}<br/>
            Walk: ${p.walk.toFixed(3)} | Bike: ${p.bike.toFixed(3)} | Car: ${p.car.toFixed(3)}
          </div>`,
        };
      }}
      getCursor={({ isDragging }: { isDragging: boolean }) =>
        isDragging ? 'grabbing' : 'pointer'
      }
      style={{ background: '#1a1a2e' }}
    >
      <Map reuseMaps mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}
