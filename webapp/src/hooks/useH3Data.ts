import { useState, useEffect } from 'react';
import type { H3HexFeature, H3GeoJSON, TravelMode, LayerType } from '../types';

interface H3DataState {
  data: H3HexFeature[] | null;
  loading: boolean;
  error: string | null;
  minScore: number;
  maxScore: number;
}

const DATA_URL = '/data/h3_scored_composite.geojson';

/**
 * Load and parse H3 GeoJSON data for the application.
 * Handles loading state, errors, and computes score range.
 */
export function useH3Data(): H3DataState {
  const [state, setState] = useState<H3DataState>({
    data: null,
    loading: true,
    error: null,
    minScore: 0,
    maxScore: 1,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        const json = (await response.json()) as H3GeoJSON;

        if (cancelled) return;

        const features = json.features;

        // Compute score range
        const scores = features.map((f) => f.properties.score);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);

        setState({
          data: features,
          loading: false,
          error: null,
          minScore,
          maxScore,
        });

        console.log(
          `Loaded ${features.length} H3 hexagons (score range: ${minScore.toFixed(3)} - ${maxScore.toFixed(3)})`
        );
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Unknown error loading data',
          }));
        }
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  return state;
}

/**
 * Get the score value for a hex based on the selected mode and layer.
 */
export function getHexScore(
  hex: H3HexFeature,
  mode: TravelMode,
  layer: LayerType
): number {
  const p = hex.properties;

  if (layer === 'baseline') return p.baseline;
  if (layer === 'track') return p.track;

  // Composite with mode-specific weighting
  const modeScore = p[mode] ?? p.score;
  return modeScore;
}

/**
 * Get top 5 indicators for a hex (for detail panel).
 */
export function getTopIndicators(hex: H3HexFeature): { name: string; value: number }[] {
  const p = hex.properties;
  const indicators = [
    { name: 'Food & Grocery', value: p.food },
    { name: 'Healthcare', value: p.health },
    { name: 'Education', value: p.edu },
    { name: 'Public Transit', value: p.transit },
    { name: 'Green Space', value: p.green },
    { name: 'Daily Services', value: p.services },
    { name: 'Gym & Fitness', value: p.gym },
    { name: 'Sports Fields', value: p.sports },
    { name: 'Swimming Pool', value: p.swim },
    { name: 'Yoga & Dance', value: p.yoga },
    { name: 'Fresh Market', value: p.market },
  ];

  return indicators
    .filter((i) => i.value !== undefined && !isNaN(i.value))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
