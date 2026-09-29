import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY;

const DefaultIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

export default function MapPicker({ value, onPick }) {
  return (
    <div className="mapWrap">
      <MapContainer
        center={[31.5, 34.8]}
        zoom={5}
        minZoom={4}
        maxZoom={17}
        worldCopyJump={true}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
        className="map"
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${mapTilerKey}`}
          attribution="© MapTiler © OpenStreetMap contributors"
          tileSize={512}
          zoomOffset={-1}
          noWrap={true}
        />

        <ClickHandler onPick={onPick} />

        {value && (
          <Marker
            position={[value.lat, value.lon]}
            icon={DefaultIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const position = e.target.getLatLng();

                onPick({
                  lat: position.lat,
                  lon: position.lng,
                });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}