// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
export interface GlobePoint {
    lat: number;
    lng: number;
    name: string;
    value: number;
    region: string;
}

export interface GlobeArc {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
}

export interface GlobeStats {
    countries: number;
    properties: number;
    clients: number;
}
