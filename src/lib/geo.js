import { geoConicConformal, geoMercator, geoPath, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'es-atlas/es/autonomous_regions.json';

export const WIDTH = 760;
export const HEIGHT = 660;

// INE codes: 05 Canarias, 18 Ceuta, 19 Melilla, 20 Gibraltar (not Spanish, dropped).
const CANARIAS = '05';
const CITIES = ['18', '19'];

export function buildMap() {
  const all = feature(topology, topology.objects.autonomous_regions).features.filter(
    (f) => f.id !== '20',
  );
  const canarias = all.find((f) => f.id === CANARIAS);
  const cities = all.filter((f) => CITIES.includes(f.id));
  const peninsula = {
    type: 'FeatureCollection',
    features: all.filter((f) => f.id !== CANARIAS && !CITIES.includes(f.id)),
  };

  // Mainland and the Balearics, leaving a band at the bottom for the inset.
  const projection = geoConicConformal()
    .parallels([36, 44])
    .rotate([3.5, 0])
    .fitExtent(
      [
        [8, 8],
        [WIDTH - 8, HEIGHT - 110],
      ],
      peninsula,
    );
  const path = geoPath(projection);

  // The Canary Islands sit far to the south-west, so they get their own box.
  const box = { x: 8, y: HEIGHT - 100, width: 182, height: 92 };
  const islandsProjection = geoMercator().fitExtent(
    [
      [box.x + 8, box.y + 8],
      [box.x + box.width - 8, box.y + box.height - 22],
    ],
    canarias,
  );
  const islandsPath = geoPath(islandsProjection);

  const regions = [
    ...peninsula.features.map((f) => ({ id: f.id, d: path(f) })),
    { id: CANARIAS, d: islandsPath(canarias) },
  ];

  // Ceuta and Melilla are too small to see as shapes, so they are drawn as dots.
  const markers = cities.map((f) => {
    const [x, y] = projection(geoCentroid(f));
    return { id: f.id, x, y };
  });

  return { width: WIDTH, height: HEIGHT, regions, markers, box };
}
