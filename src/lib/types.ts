export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  totalUnits: number;
  yearBuilt: number;
  overallLevel: number; // 1-5 CMM level
  scores: AssessmentScores;
  compliance: ComplianceCert[];
  leedScore: number; // 0-100
  lastAssessed: string;
}

export interface AssessmentScores {
  structuralSafety: number;
  fireSafety: number;
  waterManagement: number;
  electricalSystems: number;
  wasteManagement: number;
  greenBuilding: number;
  accessibility: number;
  securitySystems: number;
  commonAreaMaintenance: number;
  governance: number;
}

export interface ComplianceCert {
  id: string;
  name: string;
  status: 'valid' | 'expired' | 'pending' | 'not_applicable';
  issuedDate?: string;
  expiryDate?: string;
  mandatory: boolean;
  category: string;
}

export const RATING_LEVELS = [
  { level: 1, name: 'Initial', description: 'Basic infrastructure with minimal compliance', color: 'level-1' },
  { level: 2, name: 'Developing', description: 'Standard safety and maintenance protocols', color: 'level-2' },
  { level: 3, name: 'Established', description: 'Good management practices and compliance', color: 'level-3' },
  { level: 4, name: 'Advanced', description: 'Quantitative management and sustainability', color: 'level-4' },
  { level: 5, name: 'Exemplary', description: 'LEED certified, best-in-class facilities', color: 'level-5' },
] as const;

export const ASSESSMENT_CATEGORIES = [
  { key: 'structuralSafety', label: 'Structural Safety', icon: 'Shield' },
  { key: 'fireSafety', label: 'Fire Safety', icon: 'Flame' },
  { key: 'waterManagement', label: 'Water Management', icon: 'Droplets' },
  { key: 'electricalSystems', label: 'Electrical Systems', icon: 'Zap' },
  { key: 'wasteManagement', label: 'Waste Management', icon: 'Recycle' },
  { key: 'greenBuilding', label: 'Green Building', icon: 'Leaf' },
  { key: 'accessibility', label: 'Accessibility', icon: 'Accessibility' },
  { key: 'securitySystems', label: 'Security Systems', icon: 'Lock' },
  { key: 'commonAreaMaintenance', label: 'Common Area Maintenance', icon: 'Wrench' },
  { key: 'governance', label: 'Governance & Compliance', icon: 'FileCheck' },
] as const;

export const COMPLIANCE_CERTIFICATES = [
  { name: 'Earthquake Resistance Certificate (Zone 3)', category: 'Structural', mandatory: true },
  { name: 'Earthquake Resistance Certificate (Zone 4)', category: 'Structural', mandatory: true },
  { name: 'Earthquake Resistance Certificate (Zone 5)', category: 'Structural', mandatory: true },
  { name: 'Structural Stability Certificate', category: 'Structural', mandatory: true },
  { name: 'Fire Safety NOC', category: 'Fire Safety', mandatory: true },
  { name: 'Fire Extinguisher Maintenance', category: 'Fire Safety', mandatory: true },
  { name: 'Building Completion Certificate', category: 'Legal', mandatory: true },
  { name: 'Occupancy Certificate', category: 'Legal', mandatory: true },
  { name: 'Property Tax Clearance', category: 'Legal', mandatory: true },
  { name: 'Water Quality Certificate', category: 'Utilities', mandatory: true },
  { name: 'Electrical Safety Audit', category: 'Utilities', mandatory: true },
  { name: 'Lift/Elevator Safety Certificate', category: 'Utilities', mandatory: true },
  { name: 'Environmental Clearance', category: 'Environmental', mandatory: true },
  { name: 'Rainwater Harvesting Compliance', category: 'Environmental', mandatory: false },
  { name: 'Solar Panel Installation Certificate', category: 'Environmental', mandatory: false },
  { name: 'Waste Management Compliance', category: 'Environmental', mandatory: true },
  { name: 'LEED Green Building Certification', category: 'Green Building', mandatory: false },
  { name: 'Energy Audit Certificate', category: 'Green Building', mandatory: false },
  { name: 'STP (Sewage Treatment Plant) Certificate', category: 'Environmental', mandatory: true },
  { name: 'Swimming Pool Safety Certificate', category: 'Amenities', mandatory: false },
] as const;
