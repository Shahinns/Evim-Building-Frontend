import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Vite/webpack ilə marker şəkilləri düzgün göstərilsin deyə
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = { lat: 39.2092, lng: 45.4128 };

export function GoogleMapView({
  latitude,
  longitude,
  address,
  zoom = 15,
  height = 360,
  markers = [],
  onMapClick,
  onMarkerClick,
  selectedId,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const onMapClickRef = useRef(onMapClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMapClickRef.current = onMapClick;
  onMarkerClickRef.current = onMarkerClick;

  const hasCoords = latitude && longitude;
  const list = markers.length
    ? markers
    : hasCoords
      ? [{ id: "main", lat: Number(latitude), lng: Number(longitude), title: address }]
      : [];

  const center = hasCoords
    ? { lat: Number(latitude), lng: Number(longitude) }
    : list[0]
      ? { lat: Number(list[0].lat), lng: Number(list[0].lng) }
      : DEFAULT_CENTER;

  // Xəritəni bir dəfə yarat
  useEffect(() => {
    const map = L.map(containerRef.current).setView([center.lat, center.lng], zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);

    map.on("click", (e) => {
      onMapClickRef.current?.({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    });

    mapRef.current = map;

    // Panel yığılanda/açılanda ölçü səhvi olmasın
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mərkəz və zoom dəyişəndə
  useEffect(() => {
    mapRef.current?.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom]);

  // Markerlər
  const listKey = JSON.stringify(list.map((m) => [m.id, m.lat, m.lng, m.title]));
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    list.forEach((m) => {
      const marker = L.marker([Number(m.lat), Number(m.lng)], {
        zIndexOffset: selectedId === m.id ? 1000 : 0,
      });
      if (m.title) marker.bindTooltip(m.title);
      marker.on("click", () => onMarkerClickRef.current?.(m));
      marker.addTo(layer);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey, selectedId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: 8,
      }}
    />
  );
}

export default GoogleMapView;