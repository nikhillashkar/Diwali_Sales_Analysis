# Location Tracker

A modern, privacy-focused location tracking web application built with Next.js, TypeScript, and Tailwind CSS.

## ⚠️ Important Legal Notice

**This application is designed for educational and demonstration purposes only.**

- Real phone number tracking requires carrier-level access and is heavily regulated by law
- Tracking someone's location without their explicit consent is **illegal in most jurisdictions**
- This application implements **voluntary location sharing** with user consent
- Always obtain proper authorization before tracking anyone's location

## Features

- 🗺️ **Real-time Location Tracking** - View location updates on an interactive map
- 🔒 **Privacy First** - Consent-based sharing with secure, temporary links
- 📱 **Mobile Friendly** - Responsive design that works on all devices
- 🎯 **High Accuracy** - Uses GPS for precise location tracking
- 📊 **Location History** - View past location updates with timestamps
- 🔗 **Easy Sharing** - Generate shareable links for location tracking

## How It Works

1. **Create a Tracking Session**: Enter a phone number to generate a unique tracking link
2. **Share the Link**: Send the generated link to the person you want to track
3. **User Consent**: The recipient must open the link and explicitly allow location sharing
4. **Real-time Updates**: View location updates on the tracking dashboard in real-time

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet & React-Leaflet
- **Geolocation**: Browser Geolocation API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd location-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a Tracking Session

1. Go to the home page
2. Enter a phone number (for reference only)
3. Click "Generate Tracking Link"
4. You'll be redirected to the tracking dashboard

### Sharing Location

1. Copy the sharing link from the tracking dashboard
2. Send it to the person whose location you want to track
3. They must open the link and click "Start Sharing Location"
4. They must allow location access in their browser

### Viewing Location

- The tracking dashboard shows real-time location updates
- View the current location on an interactive map
- See location history with timestamps and accuracy
- Monitor statistics like total updates and last update time

## Privacy & Security

- All location data is stored locally in the browser (localStorage)
- No data is sent to external servers
- Users have full control and can stop sharing at any time
- Location sharing stops when the sharing page is closed
- No personal information is collected

## Browser Compatibility

This application requires:
- Modern browser with Geolocation API support
- HTTPS connection (required for geolocation in most browsers)
- JavaScript enabled

## Development

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
location-tracker/
├── app/
│   ├── page.tsx              # Home page - create tracking session
│   ├── track/[id]/page.tsx   # Tracking dashboard
│   ├── share/[id]/page.tsx   # Location sharing page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── MapComponent.tsx      # Leaflet map component
├── public/                   # Static assets
└── next.config.ts           # Next.js configuration
```

## Contributing

This is an educational project. Feel free to fork and modify for your own learning purposes.

## License

This project is provided as-is for educational purposes.

## Disclaimer

The developers of this application are not responsible for any misuse. Always comply with local laws and regulations regarding location tracking and privacy. Obtain proper consent before tracking anyone's location.
