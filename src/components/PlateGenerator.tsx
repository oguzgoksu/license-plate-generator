'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { GermanPlateConfig, GermanState, STATE_NAMES, PlateWidth, PlateSuffix, PlateStyle, EUCountry, EU_COUNTRY_NAMES } from '@/types/plate';
import LicensePlate from './LicensePlate';
import { useTranslation, Language, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/i18n';


const CURRENT_YEAR = new Date().getFullYear();

// Country flag emojis
const COUNTRY_FLAGS: Record<EUCountry, string> = {
  'D': '🇩🇪',
  'A': '🇦🇹',
  'B': '🇧🇪',
  'BG': '🇧🇬',
  'HR': '🇭🇷',
  'CY': '🇨🇾',
  'CZ': '🇨🇿',
  'DK': '🇩🇰',
  'EST': '🇪🇪',
  'FIN': '🇫🇮',
  'F': '🇫🇷',
  'GR': '🇬🇷',
  'H': '🇭🇺',
  'IRL': '🇮🇪',
  'I': '🇮🇹',
  'LV': '🇱🇻',
  'LT': '🇱🇹',
  'L': '🇱🇺',
  'M': '🇲🇹',
  'NL': '🇳🇱',
  'PL': '🇵🇱',
  'P': '🇵🇹',
  'RO': '🇷🇴',
  'SK': '🇸🇰',
  'SLO': '🇸🇮',
  'E': '🇪🇸',
  'S': '🇸🇪',
};

// Country-specific default colors and settings
function getCountryDefaults(country: EUCountry): { fontColor: string; backgroundColor: string; rightBandText: string } {
  switch (country) {
    // Yellow plates
    case 'NL': // Netherlands - yellow
      return { fontColor: '#000000', backgroundColor: '#F7D117', rightBandText: '' };
    case 'L': // Luxembourg - yellow
      return { fontColor: '#000000', backgroundColor: '#FCD116', rightBandText: '' };
    case 'CY': // Cyprus - yellow
      return { fontColor: '#000000', backgroundColor: '#F4C430', rightBandText: '' };
    
    // Red text plates
    case 'B': // Belgium - white with red text
      return { fontColor: '#C8102E', backgroundColor: '#FFFFFF', rightBandText: '' };
    
    // Blue text plates
    case 'P': // Portugal - white with blue text + right band
      return { fontColor: '#003399', backgroundColor: '#FFFFFF', rightBandText: '' };
    
    // Countries with right band
    case 'F': // France - right band with region code
      return { fontColor: '#000000', backgroundColor: '#FFFFFF', rightBandText: '75' };
    case 'I': // Italy - right band with region code
      return { fontColor: '#000000', backgroundColor: '#FFFFFF', rightBandText: 'RM' };
    
    // White plates with black text (default for most EU countries)
    case 'D':   // Germany
    case 'A':   // Austria (+ red stripes handled in LicensePlate)
    case 'E':   // Spain
    case 'PL':  // Poland
    case 'CZ':  // Czech Republic
    case 'SK':  // Slovakia
    case 'H':   // Hungary
    case 'RO':  // Romania
    case 'BG':  // Bulgaria
    case 'HR':  // Croatia
    case 'SLO': // Slovenia
    case 'GR':  // Greece
    case 'DK':  // Denmark
    case 'S':   // Sweden
    case 'FIN': // Finland
    case 'EST': // Estonia
    case 'LV':  // Latvia
    case 'LT':  // Lithuania
    case 'IRL': // Ireland
    case 'M':   // Malta
    default:
      return { fontColor: '#000000', backgroundColor: '#FFFFFF', rightBandText: '' };
  }
}

const DEFAULT_CONFIG: GermanPlateConfig = {
  cityCode: 'N',
  letters: 'IK',
  numbers: '745',
  suffix: '',
  showStatePlakette: true,
  showHUPlakette: true,
  state: 'NW',
  city: 'Landeshauptstadt Düsseldorf',
  huYear: 2027,
  huMonth: 7,
  width: 'standard',
  plateStyle: 'normal',
  country: 'D',
  fontColor: '#000000',
  backgroundColor: '#FFFFFF',
  plateText: 'NIKLAS',
  rightBandText: '',
};

// Parse config from URL hash
function parseConfigFromHash(): GermanPlateConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  
  const hash = window.location.hash.slice(1); // Remove leading #
  const params = new URLSearchParams(hash);
  
  return {
    cityCode: params.get('code') || DEFAULT_CONFIG.cityCode,
    letters: params.get('letters') || DEFAULT_CONFIG.letters,
    numbers: params.get('numbers') || DEFAULT_CONFIG.numbers,
    suffix: (params.get('suffix') as PlateSuffix) || DEFAULT_CONFIG.suffix,
    showStatePlakette: params.get('wappen') !== '0',
    showHUPlakette: params.get('hu') !== '0',
    state: (params.get('state') as GermanState) || DEFAULT_CONFIG.state,
    city: params.get('city') || DEFAULT_CONFIG.city,
    huYear: parseInt(params.get('huYear') || String(DEFAULT_CONFIG.huYear)),
    huMonth: parseInt(params.get('huMonth') || String(DEFAULT_CONFIG.huMonth)),
    width: (params.get('width') as PlateWidth) || DEFAULT_CONFIG.width,
    plateStyle: (params.get('style') as PlateStyle) || DEFAULT_CONFIG.plateStyle,
    country: (params.get('country') as EUCountry) || DEFAULT_CONFIG.country,
    fontColor: params.get('fontColor') || DEFAULT_CONFIG.fontColor,
    backgroundColor: params.get('bgColor') || DEFAULT_CONFIG.backgroundColor,
    plateText: params.get('text') || DEFAULT_CONFIG.plateText,
    rightBandText: params.get('rightBand') || DEFAULT_CONFIG.rightBandText,
  };
}

// Generate URL hash from config
function configToHash(config: GermanPlateConfig): string {
  const params = new URLSearchParams();
  params.set('code', config.cityCode);
  params.set('letters', config.letters);
  params.set('numbers', config.numbers);
  if (config.suffix) params.set('suffix', config.suffix);
  if (!config.showStatePlakette) params.set('wappen', '0');
  if (!config.showHUPlakette) params.set('hu', '0');
  params.set('state', config.state);
  params.set('city', config.city);
  params.set('huYear', String(config.huYear));
  params.set('huMonth', String(config.huMonth));
  if (config.width !== 'standard') params.set('width', config.width);
  if (config.plateStyle !== 'normal') params.set('style', config.plateStyle);
  if (config.country !== 'D') params.set('country', config.country);
  if (config.fontColor !== '#000000') params.set('fontColor', config.fontColor);
  if (config.backgroundColor !== '#FFFFFF') params.set('bgColor', config.backgroundColor);
  if (config.plateText) params.set('text', config.plateText);
  if (config.rightBandText) params.set('rightBand', config.rightBandText);
  return params.toString();
}

export default function PlateGenerator() {
  const { t, language, changeLanguage } = useTranslation();
  const [config, setConfig] = useState<GermanPlateConfig>(DEFAULT_CONFIG);
  const [showGermanOptions, setShowGermanOptions] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [plateTexture, setPlateTexture] = useState<string | null>(null);
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [is3DEasterEgg, setIs3DEasterEgg] = useState(false);
  const plateRef = useRef<HTMLDivElement>(null);

  // Check for 3D easter egg in hash
  useEffect(() => {
    const checkEasterEgg = () => {
      const hash = window.location.hash;
      setIs3DEasterEgg(hash.includes('3d-render=true'));
    };
    checkEasterEgg();
    window.addEventListener('hashchange', checkEasterEgg);
    return () => window.removeEventListener('hashchange', checkEasterEgg);
  }, []);

  // Initialize from hash on mount (client-side only)
  useEffect(() => {
    const initialConfig = parseConfigFromHash();
    setConfig(initialConfig);
    setShowGermanOptions(initialConfig.country === 'D');
    setIsInitialized(true);

    // Listen for hash changes (e.g., browser back/forward)
    const handleHashChange = () => {
      const newConfig = parseConfigFromHash();
      setConfig(newConfig);
      setShowGermanOptions(newConfig.country === 'D');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when config changes
  useEffect(() => {
    if (!isInitialized) return;
    const newHash = configToHash(config);
    // Use replaceState to avoid polluting history on every keystroke
    window.history.replaceState(null, '', `#${newHash}`);
  }, [config, isInitialized]);

  // Generate plate texture for 3D preview
  useEffect(() => {
    if (!plateRef.current || !show3DPreview) return;
    
    const generateTexture = async () => {
      try {
        const dataUrl = await htmlToImage.toPng(plateRef.current!, {
          pixelRatio: 2,
          cacheBust: true,
        });
        setPlateTexture(dataUrl);
      } catch (error) {
        console.error('Failed to generate plate texture:', error);
      }
    };
    
    // Debounce texture generation
    const timeout = setTimeout(generateTexture, 300);
    return () => clearTimeout(timeout);
  }, [config, show3DPreview]);

  const handleChange = useCallback((field: keyof GermanPlateConfig, value: string | boolean | number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  const exportAsPNG = useCallback(async () => {
    if (!plateRef.current) return;

    try {
      // Use html-to-image to capture the element at high resolution
      const dataUrl = await htmlToImage.toPng(plateRef.current, {
        pixelRatio: 3, // Higher resolution for quality
        cacheBust: true,
        fetchRequestInit: {
          mode: 'cors',
        },
      });

      // Load the image to resize it
      const img = new Image();
      img.onload = () => {
        // Calculate export dimensions (420px width, proportional height 100-200px)
        const exportWidth = 420;
        const aspectRatio = img.width / img.height;
        const exportHeight = Math.min(200, Math.max(100, Math.round(exportWidth / aspectRatio)));

        // Create canvas at target size
        const canvas = document.createElement('canvas');
        canvas.width = exportWidth;
        canvas.height = exportHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw scaled image
        ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

        // Generate filename: only letters and numbers, max 31 chars (+ .png = 35 total, well under 32+4)
        const isGermany = config.country === 'D';
        let baseName: string;
        if (isGermany) {
          baseName = `${config.cityCode}${config.letters}${config.numbers}${config.suffix}`;
        } else {
          baseName = config.plateText || `${config.cityCode}${config.letters}${config.numbers}`;
        }
        // Remove any non-alphanumeric characters and limit length
        const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
        const filename = `Plate${cleanName}.png`;

        // Download the resized image
        const resizedDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = resizedDataUrl;
        link.click();
      };
      img.src = dataUrl;
    } catch (error) {
      console.error('Export failed:', error);
      alert(t.exportFailed);
    }
  }, [config, t]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value as Language)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_NAMES[lang]}
              </option>
            ))}
          </select>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          {t.pageTitle}
        </h1>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.configureTitle}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.country}
              </label>
              <select
                value={config.country}
                onChange={(e) => {
                  const newCountry = e.target.value as EUCountry;
                  const countryDefaults = getCountryDefaults(newCountry);
                  setConfig(prev => ({
                    ...prev,
                    country: newCountry,
                    fontColor: countryDefaults.fontColor,
                    backgroundColor: countryDefaults.backgroundColor,
                    rightBandText: countryDefaults.rightBandText,
                  }));
                  setShowGermanOptions(newCountry === 'D');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.entries(EU_COUNTRY_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {COUNTRY_FLAGS[code as EUCountry]} {name} ({code})
                  </option>
                ))}
              </select>
            </div>

            {/* Plate Text - for non-German plates */}
            {config.country !== 'D' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.plateText}
                </label>
                <input
                  type="text"
                  value={config.plateText}
                  onChange={(e) => handleChange('plateText', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="AB 123 CD"
                />
              </div>
            )}

            {/* Right band text - for France, Italy, Portugal */}
            {['F', 'I', 'P'].includes(config.country) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.rightBandText || 'Region/Code'}
                </label>
                <input
                  type="text"
                  value={config.rightBandText}
                  onChange={(e) => handleChange('rightBandText', e.target.value.toUpperCase().slice(0, 3))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  maxLength={3}
                  placeholder={config.country === 'F' ? '75' : config.country === 'I' ? 'RM' : ''}
                />
              </div>
            )}

            {/* German plate inputs - City Code */}
            {config.country === 'D' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.cityCode}
                </label>
                <input
                  type="text"
                  value={config.cityCode}
                  onChange={(e) => handleChange('cityCode', e.target.value.toUpperCase().slice(0, 3))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  maxLength={3}
                  placeholder="M, B, HH..."
                />
              </div>
            )}

            {/* German plate inputs - Letters */}
            {config.country === 'D' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.letters}
                </label>
                <input
                  type="text"
                  value={config.letters}
                  onChange={(e) => handleChange('letters', e.target.value.toUpperCase().slice(0, 2))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  maxLength={2}
                  placeholder="AB"
                />
              </div>
            )}

            {/* German plate inputs - Numbers */}
            {config.country === 'D' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.numbers}
                </label>
                <input
                  type="text"
                  value={config.numbers}
                  onChange={(e) => handleChange('numbers', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  maxLength={4}
                  placeholder="1234"
                />
              </div>
            )}

            {/* Width Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.plateWidth}
              </label>
              <select
                value={config.width}
                onChange={(e) => handleChange('width', e.target.value as PlateWidth)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="standard">{t.widthStandard}</option>
                <option value="compact">{t.widthCompact}</option>
              </select>
            </div>

            {/* Plate Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.plateStyle}
              </label>
              <select
                value={config.plateStyle}
                onChange={(e) => handleChange('plateStyle', e.target.value as PlateStyle)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="normal">{t.styleNormal}</option>
                <option value="3d-black-glossy">{t.style3DBlack}</option>
                <option value="3d-carbon-glossy">{t.style3DCarbon}</option>
                <option value="3d-black-matte">{t.style3DBlackMatte}</option>
                <option value="3d-carbon-matte">{t.style3DCarbonMatte}</option>
              </select>
            </div>

            {/* Font Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.fontColor}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.fontColor}
                  onChange={(e) => handleChange('fontColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer dark:border-gray-600"
                />
                <input
                  type="text"
                  value={config.fontColor}
                  onChange={(e) => handleChange('fontColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.backgroundColor}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer dark:border-gray-600"
                />
                <input
                  type="text"
                  value={config.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* Suffix Selection (E/H) - only for Germany */}
            {config.country === 'D' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.suffix}
                </label>
                <select
                  value={config.suffix}
                  onChange={(e) => handleChange('suffix', e.target.value as PlateSuffix)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Normal</option>
                  <option value="E">E (Elektro)</option>
                  <option value="H">H (Oldtimer)</option>
                </select>
              </div>
            )}
          </div>

          {/* German-specific options - collapsible */}
          {config.country === 'D' && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => setShowGermanOptions(!showGermanOptions)}
                className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className={`transform transition-transform ${showGermanOptions ? 'rotate-90' : ''}`}>▶</span>
                🇩🇪 {t.state} / {t.city}
              </button>
              
              {showGermanOptions && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* State Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.state}
                    </label>
                    <select
                      value={config.state}
                      onChange={(e) => handleChange('state', e.target.value as GermanState)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {Object.entries(STATE_NAMES).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.city}
                    </label>
                    <input
                      type="text"
                      value={config.city}
                      onChange={(e) => handleChange('city', e.target.value.slice(0, 35))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      maxLength={35}
                      placeholder="München, Düsseldorf..."
                    />
                  </div>

                  {/* HU Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.huYear}
                    </label>
                    <select
                      value={config.huYear}
                      onChange={(e) => handleChange('huYear', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* HU Month */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.huMonth}
                    </label>
                    <select
                      value={config.huMonth}
                      onChange={(e) => handleChange('huMonth', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {t.months.map((monthName, index) => (
                        <option key={index + 1} value={index + 1}>
                          {monthName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={config.showStatePlakette}
                        onChange={(e) => handleChange('showStatePlakette', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {t.showStatePlakette}
                    </label>
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={config.showHUPlakette}
                        onChange={(e) => handleChange('showHUPlakette', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {t.showHUPlakette}
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.previewTitle}
          </h2>
          <div className="p-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="flex justify-center min-w-fit">
              <LicensePlate ref={plateRef} config={config} scale={1.5} />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="text-center">
          <button
            onClick={exportAsPNG}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            📥 {t.exportPNG} (420px)
          </button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Export: 420 × 100-200 px
          </p>
        </div>
      </div>
    </div>
  );
}
