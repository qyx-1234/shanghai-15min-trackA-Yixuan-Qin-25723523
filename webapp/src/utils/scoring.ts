// Client-side scoring recomputation for the recommender system

import type { H3HexFeature, RecommenderWeights } from '../types';

// Default equal weights for all 15 indicators
const DEFAULT_INDICATOR_WEIGHTS: Record<keyof RecommenderWeights, string[]> = {
  green: ['green', 'ndvi'],
  fitness: ['gym', 'sports', 'swim', 'yoga', 'outdoor'],
  markets: ['market', 'food'],
  schools: ['edu'],
  transit: ['transit', 'tstops'],
};

const ALL_INDICATORS = [
  'food', 'health', 'edu', 'transit', 'green', 'services',
  'gym', 'outdoor', 'sports', 'swim', 'yoga', 'cycle',
  'market', 'ndvi', 'aqi',
];

/**
 * Recompute composite score for a set of hexagons based on user preference weights.
 * Returns hexes sorted by new score (descending).
 */
export function recomputeScores(
  hexes: H3HexFeature[],
  weights: RecommenderWeights
): { feature: H3HexFeature; score: number }[] {
  // Build per-indicator boost map
  const boostMap: Record<string, number> = {};
  for (const indicator of ALL_INDICATORS) {
    boostMap[indicator] = 1.0;
  }

  // Apply boosts based on which indicators each priority slider affects
  for (const [priority, indicators] of Object.entries(DEFAULT_INDICATOR_WEIGHTS)) {
    const weight = weights[priority as keyof RecommenderWeights];
    const boost = 1 + weight * 4; // slider 0→1 ⇒ boost 1x→5x
    for (const ind of indicators) {
      boostMap[ind] = boost;
    }
  }

  // Recompute for each hex
  const scored = hexes.map((hex) => {
    const p = hex.properties;
    let weightedSum = 0;
    let totalWeight = 0;

    for (const ind of ALL_INDICATORS) {
      const value = (p as unknown as Record<string, number>)[ind] ?? 0.5;
      const w = boostMap[ind];
      weightedSum += value * w;
      totalWeight += w;
    }

    const newScore = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
    return { feature: hex, score: newScore };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/**
 * Get display name for an indicator key.
 */
export function getIndicatorLabel(key: string): string {
  const labels: Record<string, string> = {
    food: 'Food & Grocery',
    health: 'Healthcare',
    edu: 'Education',
    transit: 'Public Transit',
    green: 'Green Space',
    services: 'Daily Services',
    gym: 'Gym & Fitness',
    outdoor: 'Outdoor Exercise',
    sports: 'Sports Fields',
    swim: 'Swimming Pool',
    yoga: 'Yoga & Dance',
    cycle: 'Cycling Lanes',
    market: 'Fresh Market',
    ndvi: 'NDVI (Greenery)',
    aqi: 'Air Quality',
    tstops: 'Transit Stops',
    bldg_cnt: 'Building Density',
  };
  return labels[key] ?? key;
}
