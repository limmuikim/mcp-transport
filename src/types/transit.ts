export type CrowdLevel = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing

export interface BusArrivalInfo {
  etaSeconds: number; // e.g. 135 -> 02:15
  load: CrowdLevel;
  type: 'Single Deck' | 'Double Deck' | 'Bendy';
  wab: boolean;
}

export interface BusStopNode {
  code: string;
  name: string;
  road: string;
  relativeTimeMin: number;
  isPassed: boolean;
  isCurrent: boolean;
  coords: { x: number; y: number }; // Relative map coordinates
}

export interface VehicleTelemetry {
  plate: string;
  speedKmH: number;
  distanceMeters: number;
  heading: number; // degrees
  street: string;
  model: string;
  isElectric: boolean;
  isEuro6: boolean;
  hasUsbCharging: boolean;
  hasFreeWifi: boolean;
  wheelchairAccessible: boolean;
  crowdPercent: number;
}

export interface BusService {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT Buses' | 'Tower Transit' | 'Go-Ahead Singapore';
  destinationTo: string;
  originFrom: string;
  via: string;
  category: 'Trunk' | 'Feeder' | 'Express';
  isDoubleDecker: boolean;
  isWab: boolean;
  currentStop: {
    code: string;
    name: string;
    road: string;
    directionDesc: string;
    walkTimeMin: number;
    walkDistanceM: number;
  };
  directions: [
    { label: string; terminus: string; active: boolean },
    { label: string; terminus: string; active: boolean }
  ];
  arrivals: [BusArrivalInfo, BusArrivalInfo, BusArrivalInfo];
  vehicle: VehicleTelemetry;
  progressStops: BusStopNode[];
  corridorStats: {
    avgSpeed: number;
    headwayMin: string;
    fleetWabPercent: number;
  };
}

export interface AdjacentStop {
  id: string;
  code: string;
  name: string;
  road: string;
  walkDistanceM: number;
  buses: string[];
  nextArrivalMin: number;
  load: CrowdLevel;
  loadText: string;
}

export interface TransitAlert {
  id: string;
  type: 'Normal' | 'Delay' | 'Route Diversion' | 'ERP Update';
  lineOrService: string;
  message: string;
  time: string;
}
