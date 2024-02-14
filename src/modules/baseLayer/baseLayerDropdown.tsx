import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps } from "ol/source";
import { MapContext } from "../map/mapContext";

export function BaseLayerDropdown() {
  const { setBaseLayer } = useContext(MapContext);

  const baseLayersOptions = [
    {
      id: "osm",
      name: "Open Street Map",
      layer: new TileLayer({ source: new OSM() }),
    },
    {
      id: "stadia",
      name: "Stadia",
      layer: new TileLayer({
        source: new StadiaMaps({
          layer: "outdoors",
          retina: true,
        }),
      }),
    },
  ];

  const [selectedLayer, setSelectedLayer] = useState(baseLayersOptions[0]);

  useEffect(() => setBaseLayer(selectedLayer.layer), [selectedLayer]);

  return (
    <div>
      <select
        onChange={(e) =>
          setSelectedLayer(
            baseLayersOptions.find((l) => l.id === e.target.value)!,
          )
        }
        value={selectedLayer.id}
      >
        {baseLayersOptions.map(({ id, name }) => (
          <option value={id}>{name}</option>
        ))}
      </select>
    </div>
  );
}
