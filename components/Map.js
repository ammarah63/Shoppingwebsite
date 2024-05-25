import dynamic from "next/dynamic";
import { useEffect } from "react";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

function Map() {
  useEffect(() => {
    import("leaflet/dist/leaflet.css");
  }, []);

  return <MapComponent />;
}

export default Map;
