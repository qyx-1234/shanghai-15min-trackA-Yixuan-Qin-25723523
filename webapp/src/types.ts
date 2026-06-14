// Type definitions for the 15-Minute Shanghai web application

export interface H3HexProperties {
  h3: string;
  score: number;
  baseline: number;
  track: number;
  walk: number;
  bike: number;
  car: number;
  cells: number;
  // Baseline indicators
  food: number;
  health: number;
  edu: number;
  transit: number;
  green: number;
  services: number;
  // Track A indicators
  gym: number;
  outdoor: number;
  sports: number;
  swim: number;
  yoga: number;
  cycle: number;
  market: number;
  ndvi: number;
  aqi: number;
  // Context
  tstops: number;
  bldg_cnt: number;
}

export interface H3HexFeature {
  type: 'Feature';
  properties: H3HexProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface H3GeoJSON {
  type: 'FeatureCollection';
  features: H3HexFeature[];
}

export type TravelMode = 'walk' | 'bike' | 'transit' | 'car';
export type LayerType = 'baseline' | 'track' | 'composite';

export interface RecommenderWeights {
  green: number;    // 0-1
  fitness: number;  // 0-1
  markets: number;  // 0-1
  schools: number;  // 0-1
  transit: number;  // 0-1
}

export interface MapState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}
