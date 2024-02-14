import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";
import { Fill, Stroke, Style, Circle, Text } from "ol/style";
import { Feature, MapBrowserEvent } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../map/mapContext";

const schoolLayer = new VectorLayer({
  className: "schools",
  source: new VectorSource({
    url: "schools.json",
    format: new GeoJSON(),
  }),
  style: schoolStyle,
});

interface SchoolProperties {
  navn: string;
  antall_elever: number;
  eierforhold: "Offentlig" | "Private";
}

type SchoolFeature = {
  getProperties(): SchoolProperties;
} & Feature<Point>;

function schoolStyle(feature: FeatureLike) {
  const schoolFeature = feature as FeatureLike;
  const school = schoolFeature.getProperties();

  return new Style({
    image: new Circle({
      stroke: new Stroke({
        color: school.eierforhold === "Offentlig" ? "blue" : "red",
        width: 1,
      }),
      fill: new Fill({ color: "white" }),
      radius: 3 + school.antall_elever / 150,
    }),
  });
}

function activeSchoolStyle(feature: FeatureLike, resolution: number) {
  const schoolFeature = feature as FeatureLike;
  const school = schoolFeature.getProperties();

  return new Style({
    image: new Circle({
      stroke: new Stroke({
        color: school.eierforhold === "Offentlig" ? "blue" : "red",
        width: 4,
      }),
      fill: new Fill({ color: "white" }),
      radius: 3 + school.antall_elever / 150,
    }),
    text:
      resolution < 75
        ? new Text({
            text: school.navn,
            offsetY: -13,
            font: "bold 15px sans-serif",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "white", width: 5 }),
          })
        : undefined,
  });
}

export function SchoolLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(true);

  const [activeFeature, setActiveFeature] = useState<SchoolFeature>();

  function handlePointMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();

    if (!resolution || resolution > 100) {
      return;
    }

    const features: FeatureLike[] = [];

    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 1,
      layerFilter: (l) => l === schoolLayer,
    });

    if (features.length === 1) {
      setActiveFeature(features[0] as SchoolFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeSchoolStyle);

    return () => activeFeature?.setStyle(schoolStyle);
  }, [activeFeature]);

  useLayer(schoolLayer, checked);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointMove);
    }

    return () => map?.un("pointermove", handlePointMove);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} schools
      </label>
    </div>
  );
}
