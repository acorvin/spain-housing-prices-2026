import { csvParse } from 'd3-dsv';
import { scaleThreshold } from 'd3-scale';
import raw from '../../data/ipv_regions_2026q2.csv?raw';

const num = (v) => (v === '' ? null : +v);

export const rows = csvParse(raw, (d) => ({
  id: d.ine_code,
  name: d.region,
  all: +d.annual_change_all,
  newHomes: num(d.annual_change_new),
  secondHand: num(d.annual_change_second_hand),
  quarter: +d.quarterly_change_all,
  yearToDate: +d.ytd_change_all,
}));

export const byId = new Map(rows.map((r) => [r.id, r]));
export const ranked = [...rows].sort((a, b) => b.all - a.all);

// Spain as a whole, same quarter (INE series IPV1376, IPV1615, IPV1620, IPV1522, IPV1612).
export const spain = { name: 'Spain as a whole', all: 12.2, newHomes: 7.4, secondHand: 12.9, quarter: 3.4, yearToDate: 7.0 };

// Six warm classes, from pale sand to deep oxblood: the heat of prices climbing.
const ramp = ['#fbe6c2', '#f8c98a', '#f0a055', '#dd6b3a', '#b2392b', '#661528'];
export const NO_DATA = '#e9e7e2';

// The map and ranking can show any of five measures. Breaks are fixed per measure so the classes stay round.
export const metrics = [
  { key: 'all', tab: 'Past year', title: 'Annual change, all homes', breaks: [11, 12, 13, 14, 15], max: 16, spain: 12.2 },
  { key: 'newHomes', tab: 'New homes', title: 'Annual change, new homes', breaks: [4, 6, 8, 10, 12], max: 14, spain: 7.4 },
  { key: 'secondHand', tab: 'Second-hand', title: 'Annual change, second-hand homes', breaks: [11, 12, 13, 14, 15], max: 16, spain: 12.9 },
  { key: 'quarter', tab: 'Last quarter', title: 'Change on the previous quarter', breaks: [3, 3.5, 4, 4.5, 5], max: 6, spain: 3.4 },
  { key: 'yearToDate', tab: 'So far in 2026', title: 'Change since the end of 2025', breaks: [6, 7, 8, 9, 10], max: 11, spain: 7.0 },
];
export const metricByKey = new Map(metrics.map((m) => [m.key, m]));

const scales = new Map(metrics.map((m) => [m.key, scaleThreshold().domain(m.breaks).range(ramp)]));
export const colorFor = (key, v) => (v == null ? NO_DATA : scales.get(key)(v));

export const classesFor = (key) => {
  const { breaks } = metricByKey.get(key);
  const n = (b) => `${b}%`;
  return ramp.map((fill, i) => ({
    fill,
    label: i === 0 ? `Under ${n(breaks[0])}` : i === ramp.length - 1 ? `${n(breaks[i - 1])} or more` : `${breaks[i - 1]}–${n(breaks[i])}`,
  }));
};

export const rankedBy = (key) =>
  [...rows].sort((a, b) => (b[key] ?? -Infinity) - (a[key] ?? -Infinity));

// Communities only (Ceuta and Melilla are cities), for the one-line reading of each measure.
const cities = new Set(['18', '19']);
export function reading(key) {
  const list = rankedBy(key).filter((r) => r[key] != null && !cities.has(r.id));
  const p = (r) => `${r.name} (${fmt(r[key])})`;
  const top = list.slice(0, 2), low = list.slice(-2).reverse();
  const base = `${top[0].name} (${fmt(top[0][key])}) and ${p(top[1])} lead; ${p(low[0])} and ${low[1].name} (${fmt(low[1][key])}) trail.`;
  const range = `Across the communities the change runs from ${fmt(list.at(-1)[key])} to ${fmt(list[0][key])}.`;
  const extra = {
    all: 'Prices rose in every community.',
    newHomes: 'New homes tell a different story: Illes Balears and País Vasco rose only 3.0% and 3.1%, while Murcia rose 12.6%.',
    secondHand: 'Second-hand homes rose faster than new ones in every community but Canarias.',
    quarter: range,
    yearToDate: range,
  }[key];
  return `${extra} ${base}`;
}

export const fmt = (v) => (v == null ? 'n/a' : `${v.toFixed(1)}%`);

// National series, one row per quarter (INE IPV, annual change). Drives the line chart.
import trendRaw from '../../data/ipv_national_annual_change.csv?raw';

export const trend = csvParse(trendRaw, (d) => ({
  quarter: d.quarter,
  all: +d.all_homes,
  newHomes: +d.new_homes,
  secondHand: +d.second_hand_homes,
}));
