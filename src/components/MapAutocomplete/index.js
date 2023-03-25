import { useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const MapAutocomplete = ({
  city,
  setCity,
  address,
  setAddress,
  addressLine,
  setAddressLine,
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 20.3255718,
    lng: 85.8102212,
  });
  const autocompleteRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    console.log("Selected place:", place);
    setSelectedPlace(place);

    setMarkerPosition({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });

    const marker = markerRef.current;
    if (marker) {
      marker.setPosition(place.geometry.location);
    }

    const map = mapRef.current;
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(place.geometry.location);
      map.fitBounds(bounds);
    }

    console.log("Latitude:", place.geometry.location.lat());
    console.log("Longitude:", place.geometry.location.lng());
    setAddress({
      ...address,
      coordinates: [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ],
    });

    renderMarkers();
  };

  const handleApiLoaded = (map, maps) => {
    mapRef.current = map;

    const marker = new maps.Marker({
      position: markerPosition,
      map: map,
      draggable: true,
    });

    markerRef.current = marker;

    maps.event.addListener(marker, "dragend", () => {
      const position = marker.getPosition();
      console.log("Latitude:", position.lat());
      console.log("Longitude:", position.lng());
      setMarkerPosition({
        lat: position.lat(),
        lng: position.lng(),
      });
      setAddress({
        ...address,
        coordinates: [position.lng(), position.lat()],
      });
    });

    renderMarkers();
  };

  const renderMarkers = () => {
    if (markerPosition && markerRef.current) {
      markerRef.current.setPosition(markerPosition);
      markerRef.current.setMap(mapRef.current);
    } else if (markerRef.current) {
      markerRef.current.setMap(null);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Enter your address"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          className="px-3 py-2 mt-3 border border-md w-full"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter City of the event"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 mt-3 border border-md w-full"
        />
      </div>
      <LoadScript
        libraries={["places"]}
        googleMapsApiKey={"AIzaSyCDCQBnv82-gPUl8bkOuTyQdoELx2nm8eI"}
      >
        <div style={{ height: "300px", width: "100%" }}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceSelect}
          >
            <div>
              <input
                className="w-full my-3 px-4 py-2 border rounded-md"
                type="text"
                placeholder="Enter a location"
              />
            </div>
          </Autocomplete>
          <GoogleMapReact
            key={`${markerPosition.lat}-${markerPosition.lng}`}
            defaultCenter={markerPosition}
            defaultZoom={13}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          />
        </div>
      </LoadScript>
    </>
  );
};

export default MapAutocomplete;
