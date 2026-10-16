<script>
  import RegionMap from './lib/RegionMap.svelte';
  import Legend from './lib/Legend.svelte';
  import Readout from './lib/Readout.svelte';
  import Ranking from './lib/Ranking.svelte';
  import TrendChart from './lib/TrendChart.svelte';
  import Metrics from './lib/Metrics.svelte';
  import { byId, spain, reading } from './lib/data.js';

  let hovered = $state(null);
  let pinned = $state(null);
  let metric = $state('all');

  const active = $derived(hovered ?? pinned);
  const row = $derived(active ? byId.get(active) : spain);

  const note = $derived(reading(metric));

  const onhover = (id) => (hovered = id);
  const onleave = () => (hovered = null);
  const ontoggle = (id) => (pinned = pinned === id ? null : id);
</script>

<main>
  <header>
    <p class="eyebrow">Spain · House prices · Second quarter of 2026</p>
    <h1>House prices rose in every region of Spain</h1>
    <p class="dek">
      Annual change in the Instituto Nacional de Estadística’s housing price index for all homes, by
      autonomous community, in the second quarter of 2026. Among the 17 communities, Asturias and
      Castilla y León rose most and Navarra least.
    </p>
  </header>

  <div class="controls">
    <Metrics {metric} onselect={(k) => (metric = k)} />
    <p class="reading" aria-live="polite">{note}</p>
  </div>

  <Readout {row} {metric} isRegion={!!active} />

  <div class="grid">
    <figure>
      <RegionMap {active} {metric} {onhover} {onleave} {ontoggle} />
      <Legend {metric} />
    </figure>
    <Ranking {active} {metric} {onhover} {onleave} {ontoggle} />
  </div>

  <section class="trend" aria-labelledby="trend-h">
    <h2 id="trend-h">Second-hand home prices in Spain are rising almost 13% a year, while new homes have slowed</h2>
    <p class="sub">
      Annual change in INE’s housing price index, by quarter, from the third quarter of 2016 to the
      second quarter of 2026. Growth for all homes fell to 0.9% in early 2021 and has stayed above
      12% since the start of 2025.
    </p>
    <TrendChart />
    <p class="fine">Notes: INE measures the prices at which homes were actually sold, not asking prices.</p>
    <p class="fine">
      Source:
      <a href="https://www.ine.es/dyngs/Prensa/IPV2T26.pdf" target="_blank" rel="noopener"
        >Instituto Nacional de Estadística (INE), Índice de Precios de Vivienda, quarterly series, 2016
        to 2026</a
      >. Chart by Alex Corvin.
    </p>
  </section>

  <footer>
    <p>
      Ceuta (15.2%) and Melilla (13.8%) are autonomous cities. They are drawn as dots because they
      are too small to show as shapes at this scale, and the Canary Islands are moved into the box
      at the bottom left. INE measures the prices of homes that were actually sold, so the index
      does not follow asking prices.
    </p>
    <p>
      Source:
      <a href="https://www.ine.es/dyngs/Prensa/IPV2T26.pdf" target="_blank" rel="noopener"
        >Instituto Nacional de Estadística (INE), Índice de Precios de Vivienda, second quarter of
        2026</a
      >. Map outlines from the Instituto Geográfico Nacional via es-atlas. Chart by Alex Corvin.
    </p>
  </footer>
</main>

<style>
  main {
    max-width: 1040px;
    margin: 0 auto;
    padding: 28px 20px 32px;
  }
  .eyebrow {
    margin: 0 0 10px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--grey);
  }
  h1 {
    margin: 0;
    font-size: clamp(26px, 4.4vw, 40px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.02em;
  }
  .dek {
    max-width: 62ch;
    margin: 12px 0 22px;
    font-size: 15px;
    line-height: 1.55;
    color: var(--grey);
  }
  .controls {
    margin-bottom: 18px;
  }
  .reading {
    max-width: 62ch;
    min-height: 3.1em;
    margin: 14px 0 0;
    font-size: 15px;
    line-height: 1.5;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 28px 40px;
    align-items: start;
    margin-top: 22px;
  }
  figure {
    margin: 0;
  }
  figure :global(.legend) {
    margin-top: 14px;
  }
  .trend {
    margin-top: 48px;
    padding-top: 22px;
    border-top: 1px solid var(--ink);
  }
  h2 {
    max-width: 30ch;
    margin: 0;
    font-size: clamp(22px, 3.2vw, 30px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  .sub {
    max-width: 66ch;
    margin: 12px 0 0;
    font-size: 15px;
    line-height: 1.55;
    color: var(--grey);
  }
  .fine {
    max-width: 78ch;
    margin: 12px 0 0;
    font-size: 12px;
    line-height: 1.55;
    color: var(--grey);
  }
  .fine a { color: var(--ink); }
  footer {
    margin-top: 26px;
    padding-top: 14px;
    border-top: 1px solid var(--rule);
  }
  footer p {
    max-width: 78ch;
    margin: 0 0 8px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--grey);
  }
  footer a {
    color: var(--ink);
  }
  @media (max-width: 760px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
