export type PlateWidth = 'compact' | 'standard';
export type PlateSuffix = '' | 'E' | 'H';  // E = Elektro, H = Historisch (Oldtimer)
export type PlateStyle = 'normal' | '3d-black-matte' | '3d-black-glossy' | '3d-carbon-matte' | '3d-carbon-glossy';

export const PLATE_STYLE_NAMES: Record<PlateStyle, string> = {
  'normal': 'Normal (Standard)',
  '3d-black-matte': '3D Schwarz Matt',
  '3d-black-glossy': '3D Schwarz Glänzend',
  '3d-carbon-matte': '3D Carbon Matt',
  '3d-carbon-glossy': '3D Carbon Glänzend',
};

// EU Countries
export type EUCountry = 
  | 'D'   // Germany
  | 'A'   // Austria
  | 'B'   // Belgium
  | 'BG'  // Bulgaria
  | 'HR'  // Croatia
  | 'CY'  // Cyprus
  | 'CZ'  // Czech Republic
  | 'DK'  // Denmark
  | 'EST' // Estonia
  | 'FIN' // Finland
  | 'F'   // France
  | 'GR'  // Greece
  | 'H'   // Hungary
  | 'IRL' // Ireland
  | 'I'   // Italy
  | 'LV'  // Latvia
  | 'LT'  // Lithuania
  | 'L'   // Luxembourg
  | 'M'   // Malta
  | 'NL'  // Netherlands
  | 'PL'  // Poland
  | 'P'   // Portugal
  | 'RO'  // Romania
  | 'SK'  // Slovakia
  | 'SLO' // Slovenia
  | 'E'   // Spain
  | 'S';  // Sweden

export const EU_COUNTRY_NAMES: Record<EUCountry, string> = {
  'D': 'Deutschland',
  'A': 'Österreich',
  'B': 'Belgien',
  'BG': 'Bulgarien',
  'HR': 'Kroatien',
  'CY': 'Zypern',
  'CZ': 'Tschechien',
  'DK': 'Dänemark',
  'EST': 'Estland',
  'FIN': 'Finnland',
  'F': 'Frankreich',
  'GR': 'Griechenland',
  'H': 'Ungarn',
  'IRL': 'Irland',
  'I': 'Italien',
  'LV': 'Lettland',
  'LT': 'Litauen',
  'L': 'Luxemburg',
  'M': 'Malta',
  'NL': 'Niederlande',
  'PL': 'Polen',
  'P': 'Portugal',
  'RO': 'Rumänien',
  'SK': 'Slowakei',
  'SLO': 'Slowenien',
  'E': 'Spanien',
  'S': 'Schweden',
};

export interface PlateConfig {
  // Common settings for all countries
  country: EUCountry;
  width: PlateWidth;
  plateStyle: PlateStyle;
  fontColor: string;       // Hex color for text
  backgroundColor: string; // Hex color for plate background
  plateText: string;       // Generic plate text for non-German plates
  
  // German-specific settings
  cityCode: string;        // e.g., "M", "B", "HH"
  letters: string;         // e.g., "AB"
  numbers: string;         // e.g., "1234"
  suffix: PlateSuffix;     // E for electric, H for historic
  showStatePlakette: boolean;
  showHUPlakette: boolean;
  state: GermanState;
  city: string;            // City name shown on state plakette
  huYear: number;          // Year for HU sticker
  huMonth: number;         // Month for HU sticker (1-12)
}

// Keep GermanPlateConfig for backward compatibility
export type GermanPlateConfig = PlateConfig;

export type GermanState =
  | 'BW'   // Baden-Württemberg
  | 'BY'   // Bayern
  | 'BE'   // Berlin
  | 'BB'   // Brandenburg
  | 'HB'   // Bremen
  | 'HH'   // Hamburg
  | 'HE'   // Hessen
  | 'MV'   // Mecklenburg-Vorpommern
  | 'NI'   // Niedersachsen
  | 'NW'   // Nordrhein-Westfalen
  | 'RP'   // Rheinland-Pfalz
  | 'SL'   // Saarland
  | 'SN'   // Sachsen
  | 'ST'   // Sachsen-Anhalt
  | 'SH'   // Schleswig-Holstein
  | 'TH';  // Thüringen

export const STATE_NAMES: Record<GermanState, string> = {
  BW: 'Baden-Württemberg',
  BY: 'Bayern',
  BE: 'Berlin',
  BB: 'Brandenburg',
  HB: 'Bremen',
  HH: 'Hamburg',
  HE: 'Hessen',
  MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen',
  NW: 'Nordrhein-Westfalen',
  RP: 'Rheinland-Pfalz',
  SL: 'Saarland',
  SN: 'Sachsen',
  ST: 'Sachsen-Anhalt',
  SH: 'Schleswig-Holstein',
  TH: 'Thüringen',
};
