"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface Location {
  lat: number;
  lng: number;
  timestamp: string;
  accuracy?: number;
}

interface TrackingData {
  phoneNumber: string;
  createdAt: string;
  locations: Location[];
}

export default function TrackPage() {
  const params = useParams();
  const trackingId = params.id as string;
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load tracking data
    const data = localStorage.getItem(`tracking_${trackingId}`);
    if (data) {
      setTrackingData(JSON.parse(data));
    }

    // Generate share link
    const link = `${window.location.origin}/share/${trackingId}`;
    setShareLink(link);

    // Poll for location updates
    const interval = setInterval(() => {
      const updatedData = localStorage.getItem(`tracking_${trackingId}`);
      if (updatedData) {
        setTrackingData(JSON.parse(updatedData));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [trackingId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tracking session...</p>
        </div>
      </div>
    );
  }

  const latestLocation = trackingData.locations[trackingData.locations.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tracking Dashboard
              </h1>
              <p className="text-gray-600">
                Phone: <span className="font-semibold">{trackingData.phoneNumber}</span>
              </p>
              <p className="text-sm text-gray-500">
                Session started: {new Date(trackingData.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                latestLocation 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {latestLocation ? "Active" : "Waiting for location"}
              </span>
            </div>
          </div>
        </div>

        {/* Share Link Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Share Location Link
          </h2>
          <p className="text-gray-600 mb-4">
            Send this link to the person you want to track. They must open it and allow location sharing.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Updates</p>
                <p className="text-3xl font-bold text-gray-900">{trackingData.locations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Update</p>
                <p className="text-lg font-bold text-gray-900">
                  {latestLocation 
                    ? new Date(latestLocation.timestamp).toLocaleTimeString()
                    : "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                <p className="text-lg font-bold text-gray-900">
                  {latestLocation?.accuracy 
                    ? `±${Math.round(latestLocation.accuracy)}m`
                    : "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Live Location Map
          </h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            {latestLocation ? (
              <MapComponent 
                locations={trackingData.locations}
                center={[latestLocation.lat, latestLocation.lng]}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Waiting for location data...</p>
                  <p className="text-sm text-gray-500 mt-2">Share the link above to start tracking</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location History */}
        {trackingData.locations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location History
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {trackingData.locations.slice().reverse().map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(loc.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {loc.accuracy && (
                    <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      ±{Math.round(loc.accuracy)}m
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
