"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

// A MapLibre GL map of the nearby fire departments. The heavy map library is
// dynamically imported so it only loads once a search has results. Tiles are
// keyless OpenStreetMap raster (attributed). The map is supplementary — the
// department LIST beside it carries the same info for assistive tech, so the map
// container is aria-hidden.
export type MapPoint = { name: string; lat: number; lng: number };

export function ResourceMap({ points }: { points: MapPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || points.length === 0) return;
    let cancelled = false;
    let map: import("maplibre-gl").Map | undefined;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !ref.current) return;
      map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: [points[0].lng, points[0].lat],
        zoom: 9,
      });

      const bounds = new maplibregl.LngLatBounds();
      for (const p of points) {
        new maplibregl.Marker({ color: "#d54309" })
          .setLngLat([p.lng, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 24 }).setText(p.name))
          .addTo(map);
        bounds.extend([p.lng, p.lat]);
      }
      if (points.length > 1) map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [points]);

  if (points.length === 0) return null;
  return <div ref={ref} className="obp-map" aria-hidden="true" />;
}
