import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* Fix Leaflet default marker icons (Vite) */
const DefaultIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* Handle map clicks */
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
      });
    },
  });
  return null;
}

function MapFocus({ value }) {
  const map = useMap();

  useEffect(() => {
    if (!value) return;
    map.flyTo([value.lat, value.lon], Math.max(map.getZoom(), 10), {
      duration: 0.7,
    });
  }, [map, value]);

  return null;
}

export default function MapPicker({ value, onPick }) {
  return (
    <div className="mapWrap">
      <MapContainer
        center={[31.5, 34.8]}
        zoom={5}

        /* 🔒 חשוב – מגבלות תנועה וזום */
        minZoom={4}
        maxZoom={17}
        worldCopyJump={true}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}

        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
          noWrap={true}
        />

        <ClickHandler onPick={onPick} />
        <MapFocus value={value} />

        {value && (
          <Marker
            position={[value.lat, value.lon]}
            icon={DefaultIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const p = e.target.getLatLng();
                onPick({
                  lat: p.lat,
                  lon: p.lng,
                });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
