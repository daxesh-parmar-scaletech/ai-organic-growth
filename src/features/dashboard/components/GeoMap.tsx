import { useEffect, useRef } from "react";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoDatum } from "@/types/geo";

interface GeoMapProps {
  data: GeoDatum[];
  focusedCountry: string | null;
}

function MapController({ focusedCountry, markerRefs }: { focusedCountry: string | null; markerRefs: React.RefObject<Record<string, LeafletCircleMarker | null>> }) {
  const map = useMap();

  useEffect(() => {
    if (!focusedCountry) return;
    const marker = markerRefs.current[focusedCountry];
    if (!marker) return;
    map.flyTo(marker.getLatLng(), 4, { animate: true });
    marker.openPopup();
  }, [focusedCountry, map, markerRefs]);

  return null;
}

export function GeoMap({ data, focusedCountry }: GeoMapProps) {
  const markerRefs = useRef<Record<string, LeafletCircleMarker | null>>({});
  const maxClicks = Math.max(...data.map((g) => g.clicks));

  return (
    <MapContainer
      center={[30, 0]}
      zoom={1.4}
      scrollWheelZoom={false}
      attributionControl={false}
      worldCopyJump
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" maxZoom={12} />
      {data.map((geo) => {
        const radius = 9 + Math.sqrt(geo.clicks / maxClicks) * 24;
        const color = geo.belowAverageCtr ? "#E0900B" : "#0B6B3C";
        return (
          <CircleMarker
            key={geo.country}
            ref={(marker) => {
              markerRefs.current[geo.country] = marker;
            }}
            center={[geo.lat, geo.lng]}
            radius={radius}
            pathOptions={{ color, weight: 2, fillColor: color, fillOpacity: 0.28 }}
          >
            <Popup>
              <b>{geo.country}</b>
              <br />
              {geo.clicks.toLocaleString()} clicks · {geo.impressions} impressions
              <br />
              CTR {geo.ctr} · avg pos {geo.position}
            </Popup>
          </CircleMarker>
        );
      })}
      <MapController focusedCountry={focusedCountry} markerRefs={markerRefs} />
    </MapContainer>
  );
}
