# EU License Plate Generator

A Next.js application for generating EU license plates as PNG images.

## Features

- 🇩🇪 **German License Plates**: Full support for German Kennzeichen
- 🏛️ **State Plakette**: Option to add the Landeswappen (state coat of arms)
- 🔄 **HU Plakette**: Option to add the TÜV/HU sticker with configurable year and month
- 📐 **Selectable Width**: Choose between standard (520mm) and compact width
- 🎨 **EuroPlate Font**: Authentic appearance with the official EuroPlate typeface
- 📥 **PNG Export**: Export at 420×100-200px (aspect ratio dependent)

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI**: React 18+ with Tailwind CSS
- **Font**: EuroPlate TTF

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Configure the plate**: Enter city code (e.g., M, B, HH), letters, and numbers
2. **Select state**: Choose the German Bundesland for the state plakette
3. **Set HU date**: Configure year and month for the HU (TÜV) plakette
4. **Choose width**: Standard (520mm) or compact
5. **Toggle options**: Show/hide state plakette and HU plakette
6. **Export**: Click "Als PNG exportieren" to download the image

## License Plate Specifications

- **Standard width**: 520mm
- **Height**: 110mm
- **Export dimensions**: 420 × 100-200 pixels (depending on aspect ratio)

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles + EuroPlate font
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   ├── EUBand.tsx       # Blue EU band with stars
│   ├── StatePlakette.tsx # German state coat of arms
│   ├── HUPlakette.tsx   # TÜV inspection sticker
│   ├── LicensePlate.tsx # Main plate component
│   └── PlateGenerator.tsx # Full UI with controls
└── types/
    └── plate.ts         # TypeScript types
```

## License

MIT
