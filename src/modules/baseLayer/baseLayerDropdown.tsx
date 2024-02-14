import React, { useState } from "react";

export function BaseLayerDropdown() {
  const baseLayersOptions = [
    {
      id: "osm",
      name: "Open Street Map",
    },
    {
      id: "stadia",
      name: "Stadia",
    },
  ];

  const [selectedLayer, setSelectedLayer] = useState(baseLayersOptions[0]);

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
      {selectedLayer.name}
    </div>
  );
}
