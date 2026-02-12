
export enum ViolationType {
  ENCROACHMENT = 'ENCROACHMENT',
  UNAUTHORIZED_CONSTRUCTION = 'UNAUTHORIZED_CONSTRUCTION',
  UNUSED_LAND = 'UNUSED_LAND',
  PAYMENT_DEFAULT = 'PAYMENT_DEFAULT',
  NONE = 'NONE'
}

export interface Plot {
  id: string;
  plotNumber: string;
  companyName: string;
  areaAllocated: number; // in sq meters
  areaCurrent: number; // as detected by GIS/AI
  coordinates: [number, number][]; // Polygon coordinates
  status: 'active' | 'under_construction' | 'unused' | 'disputed';
  violations: ViolationType[];
  riskScore: number; // 0-100
  lastPaymentDate: string;
  dues: number;
  region: string;
  allotmentDate: string;
}

export interface RegionSummary {
  name: string;
  totalPlots: number;
  violationsCount: number;
  totalDues: number;
}
