"use client";

import { WorldMap } from "@/components/map";

const networkConnections = [
  // North America
  {
    start: { lat: 40.7128, lng: -74.006, label: "New York" },
    end: { lat: 51.5074, lng: -0.1278, label: "London" }
  },
  {
    start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
    end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }
  },
  {
    start: { lat: 45.4215, lng: -75.6972, label: "Ottawa" },
    end: { lat: 55.7558, lng: 37.6173, label: "Moscow" }
  },
  // Asia
  {
    start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    end: { lat: 22.3193, lng: 114.1694, label: "Hong Kong" }
  },
  {
    start: { lat: 28.6139, lng: 77.2090, label: "New Delhi" },
    end: { lat: 39.9042, lng: 116.4074, label: "Beijing" }
  },
  {
    start: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    end: { lat: 25.2048, lng: 55.2708, label: "Dubai" }
  },
  // South America
  {
    start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
    end: { lat: -33.4489, lng: -70.6693, label: "Santiago" }
  },
  // Africa
  {
    start: { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
    end: { lat: 30.0444, lng: 31.2357, label: "Cairo" }
  },
  {
    start: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
    end: { lat: 5.6037, lng: -0.1870, label: "Accra" }
  },
  {
    start: { lat: -37.8136, lng: 144.9631, label: "Melbourne" },
    end: { lat: 21.3069, lng: -157.8583, label: "Honolulu" }
  }
];

export function NetworkMapSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Global Storage Network
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Glacier's decentralized network spans continents, ensuring your data is always accessible and secure
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-800 dark:border-gray-700 bg-black dark:bg-black">
          <WorldMap
            dots={networkConnections}
            lineColor="#3b82f6"
            showLabels={true}
            animationDuration={3}
            loop={true}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Storage Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
}