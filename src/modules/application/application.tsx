import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import "ol/ol.css";
import "./application.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";
import { SchoolLayerCheckbox } from "../school/schoolLayerCheckbox";
import { SchoolAside } from "../school/schoolAside";
import { BaseLayerDropdown } from "../baseLayer/baseLayerDropdown";

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  const [baseLayer, setBaseLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM() }),
  );

  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);

  const allLayers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  useEffect(() => {
    map.setLayers(allLayers);
  }, [allLayers]);

  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  return (
    <MapContext.Provider
      value={{
        map,
        layers: vectorLayers,
        setLayers: setVectorLayers,
        setBaseLayer,
      }}
    >
      <header>
        <h1>My Awesome Map!</h1>
      </header>
      <nav>
        <a href="#" onClick={handleFocusUser}>
          My location
        </a>
        <BaseLayerDropdown />
        <KommuneLayerCheckbox />
        <FylkeLayerCheckbox />
        <SchoolLayerCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
        <KommuneAside />
        <FylkeAside />
        <SchoolAside />
      </main>
    </MapContext.Provider>
  );
}
