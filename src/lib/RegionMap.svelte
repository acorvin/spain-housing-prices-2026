<script>
  import { buildMap } from './geo.js';
  import { onMount } from 'svelte';
  import { byId, colorFor, fmt, NO_DATA, rankedBy, metricByKey, reading } from './data.js';

  let { active, metric, onhover, onleave, ontoggle } = $props();

  // On first view the map is blank and fills in from the smallest increase to the largest.
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shown = $state(reduced);
  let intro = $state(!reduced);
  const order = new Map(rankedBy('all').reverse().map((r, i) => [r.id, i]));
  onMount(() => {
    if (reduced) return;
    const t1 = setTimeout(() => (shown = true), 350);
    const t2 = setTimeout(() => (intro = false), 350 + 20 * 90 + 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });
  const fill = (id) => (shown ? colorFor(metric, byId.get(id)[metric]) : NO_DATA);
  const delay = (id) => (intro ? `${order.get(id) * 90}ms` : '0ms');

  const geo = buildMap();
  const activeRegion = $derived(geo.regions.find((r) => r.id === active));

  const alt = $derived(`Map of Spain’s autonomous communities, shaded by the ${metricByKey.get(metric).title.toLowerCase()} in the second quarter of 2026. ${reading(metric)} Ceuta and Melilla are drawn as dots.`);

  function key(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ontoggle(id);
    }
  }
</script>

<svg viewBox="0 0 {geo.width} {geo.height}" role="group" aria-label={alt}>
  <rect
    class="inset"
    x={geo.box.x}
    y={geo.box.y}
    width={geo.box.width}
    height={geo.box.height}
  />
  <text class="inset-label" x={geo.box.x + 8} y={geo.box.y + geo.box.height - 7}>Canarias</text>

  {#each geo.regions as r (r.id)}
    {@const row = byId.get(r.id)}
    <path
      class="region"
      class:dim={active && active !== r.id}
      d={r.d}
      style:fill={fill(r.id)}
      style:transition-delay={delay(r.id)}
      tabindex="0"
      role="button"
      aria-label="{row.name}: {fmt(row[metric])}"
      onpointerenter={() => onhover(r.id)}
      onpointerleave={onleave}
      onfocus={() => onhover(r.id)}
      onblur={onleave}
      onclick={() => ontoggle(r.id)}
      onkeydown={(e) => key(e, r.id)}
    />
  {/each}

  {#each geo.markers as m (m.id)}
    {@const row = byId.get(m.id)}
    <circle
      class="city"
      class:dim={active && active !== m.id}
      class:on={active === m.id}
      cx={m.x}
      cy={m.y}
      r="6.5"
      style:fill={fill(m.id)}
      style:transition-delay={delay(m.id)}
      tabindex="0"
      role="button"
      aria-label="{row.name}: {fmt(row[metric])}"
      onpointerenter={() => onhover(m.id)}
      onpointerleave={onleave}
      onfocus={() => onhover(m.id)}
      onblur={onleave}
      onclick={() => ontoggle(m.id)}
      onkeydown={(e) => key(e, m.id)}
    />
    <text class="city-label" x={m.x + 11} y={m.y + 4}>{row.name}</text>
  {/each}

  {#if activeRegion}
    <path class="outline" d={activeRegion.d} />
  {/if}
</svg>

<style>
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .region,
  .city {
    stroke: #fff;
    stroke-width: 0.9;
    cursor: pointer;
    transition: opacity 120ms, fill 700ms ease;
    outline: none;
  }
  .city {
    stroke: var(--ink);
    stroke-width: 1;
  }
  .city.on {
    stroke-width: 2;
  }
  .dim {
    opacity: 0.5;
  }
  .region:focus-visible,
  .city:focus-visible {
    stroke: var(--ink);
    stroke-width: 2;
  }
  .outline {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.8;
    stroke-linejoin: round;
    pointer-events: none;
  }
  .inset {
    fill: none;
    stroke: var(--rule);
  }
  .inset-label,
  .city-label {
    font-family: var(--mono);
    font-size: 11px;
    fill: var(--grey);
    pointer-events: none;
  }
</style>
