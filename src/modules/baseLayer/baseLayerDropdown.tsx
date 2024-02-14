import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS } from "ol/source";
import { MapContext } from "../map/mapContext";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { WMTSCapabilities } from "ol/format";

const ortoPhotoLayer = new TileLayer();
const parser = new WMTSCapabilities();

async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}

async function loadFlyfotoLayer() {
  const url =
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities";
  const config = {
    layer: "Nibcache_web_mercator_v2",
    matrixSet: "default028mm",
  };
  return await loadWtmsSource(url, config);
}

export function BaseLayerDropdown() {
  const { setBaseLayer } = useContext(MapContext);

  useEffect(() => {
    loadFlyfotoLayer().then((source) => ortoPhotoLayer.setSource(source));
  }, []);

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
    {
      id: "stadia_dark",
      name: "Stadia Dark",
      layer: new TileLayer({
        source: new StadiaMaps({
          layer: "alidade_smooth_dark",
          retina: true,
        }),
      }),
    },
    {
      id: "ortophoto",
      name: "Flyfoto",
      layer: ortoPhotoLayer,
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
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
