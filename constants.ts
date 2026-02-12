
import { Plot, ViolationType } from './types';

export const MOCK_REGIONS = ["Siltara", "Urla", "Sirgitti", "Tifra"];

export const MOCK_PLOTS: Plot[] = [
  {
    id: 'P-101',
    plotNumber: 'B-12',
    companyName: 'Adani Logistics',
    areaAllocated: 5000,
    areaCurrent: 5250,
    coordinates: [[21.365, 81.655], [21.365, 81.657], [21.367, 81.657], [21.367, 81.655]],
    status: 'active',
    violations: [ViolationType.ENCROACHMENT],
    riskScore: 75,
    lastPaymentDate: '2023-10-15',
    dues: 150000,
    region: 'Siltara',
    allotmentDate: '2020-05-20'
  },
  {
    id: 'P-102',
    plotNumber: 'A-05',
    companyName: 'Lafarge Holcim',
    areaAllocated: 12000,
    areaCurrent: 12000,
    coordinates: [[21.368, 81.658], [21.368, 81.662], [21.370, 81.662], [21.370, 81.658]],
    status: 'active',
    violations: [ViolationType.NONE],
    riskScore: 5,
    lastPaymentDate: '2024-01-10',
    dues: 0,
    region: 'Siltara',
    allotmentDate: '2015-08-12'
  },
  {
    id: 'P-103',
    plotNumber: 'C-22',
    companyName: 'Shree Cement',
    areaAllocated: 8000,
    areaCurrent: 8000,
    coordinates: [[21.362, 81.652], [21.362, 81.654], [21.364, 81.654], [21.364, 81.652]],
    status: 'unused',
    violations: [ViolationType.UNUSED_LAND, ViolationType.PAYMENT_DEFAULT],
    riskScore: 92,
    lastPaymentDate: '2022-06-30',
    dues: 450000,
    region: 'Urla',
    allotmentDate: '2021-11-05'
  },
  {
    id: 'P-104',
    plotNumber: 'D-09',
    companyName: 'JSW Steel',
    areaAllocated: 15000,
    areaCurrent: 15800,
    coordinates: [[21.372, 81.665], [21.372, 81.670], [21.375, 81.670], [21.375, 81.665]],
    status: 'under_construction',
    violations: [ViolationType.UNAUTHORIZED_CONSTRUCTION],
    riskScore: 60,
    lastPaymentDate: '2023-12-01',
    dues: 25000,
    region: 'Sirgitti',
    allotmentDate: '2022-01-15'
  }
];
