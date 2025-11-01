"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SharePage() {
  const params = useParams();
  const trackingId = params.id as string;
  const [status, setStatus] = useState<"idle" | "requesting" | "tracking" | "error">("idle");
  const [error, setError] = useState("");
  const [locationCount, setLocationCount] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startSharing = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setStatus("error");
      return;
    }

    setStatus("requesting");

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setStatus("tracking");
        
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: position.coords.accuracy,
        };

        // Get existing tracking data
        const data = localStorage.getItem(`tracking_${trackingId}`);
        if (data) {
          const trackingData = JSON.parse(data);
          trackingData.locations.push(location);
          localStorage.setItem(`tracking_${trackingId}`, JSON.stringify(trackingData));
          setLocationCount(trackingData.locations.length);
        }
      },
      (err) => {
        setStatus("error");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Please allow location access.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Share Your Location
            </h1>
            <p className="text-lg text-gray-600">
              Someone wants to track your location
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {status === "idle" && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Your Consent is Required
                  </h2>
                  <p className="text-gray-600 mb-6">
                    By clicking the button below, you agree to share your real-time location. 
                    You can stop sharing at any time.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">What will be shared:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Your current GPS coordinates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Real-time location updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Location accuracy information</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={startSharing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
                >
                  Start Sharing Location
                </button>
              </div>
            )}

            {status === "requesting" && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Requesting Permission
                </h2>
                <p className="text-gray-600">
                  Please allow location access in your browser
                </p>
              </div>
            )}

            {status === "tracking" && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Location Sharing Active
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your location is being shared in real-time
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-green-700 mb-1">Status</p>
                      <p className="text-2xl font-bold text-green-900">Active</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 mb-1">Updates Sent</p>
                      <p className="text-2xl font-bold text-green-900">{locationCount}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={stopSharing}
                  className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg text-lg"
                >
                  Stop Sharing Location
                </button>

                <p className="text-sm text-gray-500 mt-4">
                  Keep this page open to continue sharing your location
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Unable to Share Location
                  </h2>
                  <p className="text-red-600 mb-6">{error}</p>
                </div>

                <button
                  onClick={() => {
                    setStatus("idle");
                    setError("");
                  }}
                  className="w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-lg"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Privacy & Safety</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You have full control and can stop sharing at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Location data is stored locally in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No personal information is collected or transmitted</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Closing this page will stop location sharing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
