"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
  timestamp: string;
  accuracy?: number;
}

interface MapComponentProps {
  locations: Location[];
  center: [number, number];
}

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to update map center
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function MapComponent({ locations, center }: MapComponentProps) {
  const pathCoordinates: [number, number][] = locations.map(loc => [loc.lat, loc.lng]);
  const latestLocation = locations[locations.length - 1];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater center={center} />

      {/* Draw path if multiple locations */}
      {pathCoordinates.length > 1 && (
        <Polyline
          positions={pathCoordinates}
          color="#3b82f6"
          weight={3}
          opacity={0.7}
        />
      )}

      {/* Show all location markers */}
      {locations.map((location, idx) => (
        <Marker
          key={idx}
          position={[location.lat, location.lng]}
          icon={icon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">
                {idx === locations.length - 1 ? "Current Location" : `Location ${idx + 1}`}
              </p>
              <p className="text-gray-600">
                Lat: {location.lat.toFixed(6)}
              </p>
              <p className="text-gray-600">
                Lng: {location.lng.toFixed(6)}
              </p>
              {location.accuracy && (
                <p className="text-gray-600">
                  Accuracy: ±{Math.round(location.accuracy)}m
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {new Date(location.timestamp).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Highlight current location with a circle */}
      {latestLocation && (
        <Marker
          position={[latestLocation.lat, latestLocation.lng]}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background-color: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
              "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">Current Location</p>
              <p className="text-gray-600">
                Lat: {latestLocation.lat.toFixed(6)}
              </p>
              <p className="text-gray-600">
                Lng: {latestLocation.lng.toFixed(6)}
              </p>
              {latestLocation.accuracy && (
                <p className="text-gray-600">
                  Accuracy: ±{Math.round(latestLocation.accuracy)}m
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {new Date(latestLocation.timestamp).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
