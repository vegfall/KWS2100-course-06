import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";

const fylkeLayer = new VectorLayer({
  className: "fylker",
  source: new VectorSource({
    url: "fylker.json",
    format: new GeoJSON(),
  }),
});

export function FylkeLayerCheckbox() {
  const [checked, setChecked] = useState(false);

  useLayer(fylkeLayer, checked);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} fylker
      </label>
    </div>
  );
}
