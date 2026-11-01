import React from "react";
import GoogleMapView from "./GoogleMapView";
import "../styles/PropertyMap.css";

const PropertyMap = ({ latitude, longitude, address, zoom = 15 }) => {
  if (!latitude || !longitude) {
    return (
      <div className="property-map-placeholder">
        <p>📍 Koordinat yoxdur</p>
      </div>
    );
  }

  return (
    <div className="property-map-container">
      <GoogleMapView
        latitude={latitude}
        longitude={longitude}
        address={address}
        zoom={zoom}
        height={320}
      />
      <p>📍 {address || `${latitude}, ${longitude}`}</p>
    </div>
  );
};

export default PropertyMap;
