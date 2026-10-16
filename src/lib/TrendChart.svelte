<script>
  import { onMount } from 'svelte';
  import { scaleLinear } from 'd3-scale';
  import { line, curveMonotoneX } from 'd3-shape';
  import { trend, fmt } from './data.js';

  const series = [
    { key: 'secondHand', label: 'Second-hand', color: '#2a7f8e', width: 2 },
    { key: 'newHomes', label: 'New homes', color: '#d9622b', width: 2 },
    { key: 'all', label: 'All homes', color: 'var(--ink)', width: 3.6 },
  ];

  let width = $state(960);
  const narrow = $derived(width < 620);
  const height = $derived(narrow ? 340 : 440);
  const m = $derived({ top: 14, right: narrow ? 92 : 150, bottom: 30, left: 34 });
  const iw = $derived(width - m.left - m.right);
  const ih = $derived(height - m.top - m.bottom);

  const n = trend.length;
  const x = $derived(scaleLinear().domain([0, n - 1]).range([0, iw]));
  const y = $derived(scaleLinear().domain([0, 16]).range([ih, 0]));
  const path = (key) =>
    line().x((_, i) => x(i)).y((d) => y(d[key])).curve(curveMonotoneX)(trend);

  const idx = (q) => trend.findIndex((d) => d.quarter === q);
  const last = n - 1;

  // Year ticks sit on each first quarter.
  const years = trend.map((d, i) => ({ i, q: d.quarter })).filter((t) => t.q.endsWith('Q1'));
  const yTicks = [0, 4, 8, 12, 16];

  // Direct labels at the right edge, nudged so they never overlap.
  const labels = $derived.by(() => {
    const gap = 15;
    const items = series
      .map((s) => ({ ...s, y: y(trend[last][s.key]), v: trend[last][s.key] }))
      .sort((a, b) => a.y - b.y);
    for (let i = 1; i < items.length; i++) items[i].y = Math.max(items[i].y, items[i - 1].y + gap);
    return items;
  });

  const notes = [
    { id: 1, q: 'quarter', at: '2021 Q1', key: 'all', text: 'Annual growth for all homes falls to 0.9%, the lowest point for all homes in the series.' },
    { id: 2, q: 'quarter', at: '2024 Q4', key: 'all', text: 'Growth for all homes jumps to 11.3%, up from 8.1% in the previous quarter.' },
    { id: 3, q: 'quarter', at: '2026 Q2', key: 'all', text: 'Over the year to the second quarter of 2026, new homes rose 7.4% and second-hand homes rose 12.9%.' },
  ];

  // Wrap text to roughly `chars` per line.
  const wrap = (t, chars) => {
    const out = [];
    let cur = '';
    for (const w of t.split(' ')) {
      if ((cur + ' ' + w).trim().length > chars) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    }
    return [...out, cur];
  };

  const p1 = $derived(idx('2021 Q1'));
  const p2 = $derived(idx('2024 Q4'));
  const lineH = 16;

  // Hover: nearest quarter.
  let focus = $state(null);
  const shown = $derived(trend[focus ?? last]);
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(x.invert(e.clientX - r.left - m.left));
    focus = Math.max(0, Math.min(last, i));
  }

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let drawn = $state(reduced);
  onMount(() => { if (!reduced) requestAnimationFrame(() => requestAnimationFrame(() => (drawn = true))); });

  const alt =
    'Line chart of annual change in Spain’s housing price index by quarter, third quarter of 2016 to second quarter of 2026. Growth for all homes fell to 0.9% in the first quarter of 2021, jumped from 8.1% to 11.3% in the fourth quarter of 2024, and has stayed above 12% since the start of 2025, ending at 12.2%. Second-hand homes ended at 12.9% and new homes at 7.4%.';
</script>

<div class="chart">
  <p class="readout" aria-live="polite">
    <b>{shown.quarter.replace(' ', ' ')}</b>
    {#each [...series].reverse() as s (s.key)}
      <span><i style:background={s.color}></i>{s.label} <b>{fmt(shown[s.key])}</b></span>
    {/each}
  </p>

  <div class="plot" bind:clientWidth={width}>
    <svg {width} {height} role="img" aria-label={alt}>
      <g transform="translate({m.left},{m.top})">
        {#each yTicks as t}
          <line class="grid" x1="0" x2={iw} y1={y(t)} y2={y(t)} class:zero={t === 0} />
          <text class="tick" x="-8" y={y(t) + 4} text-anchor="end">{t}%</text>
        {/each}
        {#each years.filter((t) => !narrow || +t.q.slice(0, 4) % 2 === 0) as t}
          <text class="tick" x={x(t.i)} y={ih + 20} text-anchor="middle">{t.q.slice(0, 4)}</text>
        {/each}

        {#each series as s, k (s.key)}
          <path
            class="ln"
            class:drawn
            d={path(s.key)}
            pathLength="1"
            stroke={s.color}
            stroke-width={s.width}
            style:transition-delay="{k * 180}ms"
          />
        {/each}

        <!-- last quarter marker and annotation 3 -->
        <line class="ref" x1={x(last)} x2={x(last)} y1={narrow ? y(14.2) : y(14.3)} y2={y(0)} />
        {#if !narrow}
          {@const t = wrap(notes[2].text, 34)}
          <text class="note" text-anchor="end" x={x(last) + 4} y={y(16) + 6}>
            {#each t as l, i}<tspan x={x(last) + 4} dy={i ? lineH : 0}>{l}</tspan>{/each}
          </text>
        {/if}

        <!-- annotation 1 -->
        <circle class="mark" cx={x(p1)} cy={y(0.9)} r="4.5" />
        {#if !narrow}
          {@const t = wrap(notes[0].text, 46)}
          <text class="note" x={x(p1) + 34} y={y(1.9)}>
            {#each t as l, i}<tspan x={x(p1) + 34} dy={i ? lineH : 0}>{l}</tspan>{/each}
          </text>
        {/if}

        <!-- annotation 2 -->
        <circle class="mark" cx={x(p2)} cy={y(11.3)} r="4.5" />
        {#if !narrow}
          {@const t = wrap(notes[1].text, 30)}
          <line class="lead" x1={x(p2)} x2={x(p2)} y1={y(11.3) + 7} y2={y(5.3) - 13} />
          <text class="note" x={x(p2) + 10} y={y(5.3)}>
            {#each t as l, i}<tspan x={x(p2) + 10} dy={i ? lineH : 0}>{l}</tspan>{/each}
          </text>
        {/if}

        {#if narrow}
          {#each [[1, p1, 0.9], [2, p2, 11.3], [3, last, 12.9]] as [id, i, v]}
            <g class="num" transform="translate({x(i)},{y(v) + (id === 3 ? -22 : id === 1 ? 20 : 22)})">
              <circle r="9" /><text text-anchor="middle" y="4">{id}</text>
            </g>
          {/each}
        {/if}

        {#each labels as l (l.key)}
          <text class="lbl" class:small={narrow} x={iw + 10} y={l.y + 4} fill={l.color}>{narrow ? l.label : `${l.label} ${fmt(l.v)}`}</text>
        {/each}

        <!-- hover -->
        {#if focus !== null}
          <line class="cross" x1={x(focus)} x2={x(focus)} y1="0" y2={ih} />
          {#each series as s (s.key)}
            <circle cx={x(focus)} cy={y(trend[focus][s.key])} r="4" fill={s.color} stroke="#fff" stroke-width="1.5" />
          {/each}
        {/if}
        <rect class="hit" x="0" y="0" width={iw} height={ih} role="presentation"
          onpointermove={move} onpointerdown={move} onpointerleave={() => (focus = null)} />
      </g>
    </svg>
  </div>

  {#if narrow}
    <ol class="notes">
      {#each notes as nt (nt.id)}<li><span class="n">{nt.id}</span>{nt.text}</li>{/each}
    </ol>
  {/if}
</div>

<style>
  .chart { margin-top: 18px; }
  .readout {
    display: flex; flex-wrap: wrap; gap: 4px 18px; align-items: baseline;
    margin: 0 0 6px; min-height: 22px; font-size: 13px; color: var(--grey);
  }
  .readout > b { font-family: var(--mono); font-size: 12px; color: var(--ink); font-weight: 500; }
  .readout span b { color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
  .readout i { display: inline-block; width: 14px; height: 3px; margin-right: 6px; vertical-align: middle; }
  .plot { width: 100%; }
  svg { display: block; touch-action: pan-y; }
  .grid { stroke: var(--rule); }
  .grid.zero { stroke: var(--grey); }
  .tick { font-family: var(--mono); font-size: 11px; fill: var(--grey); }
  .ln {
    fill: none; stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 1; stroke-dashoffset: 1;
    transition: stroke-dashoffset 1400ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ln.drawn { stroke-dashoffset: 0; }
  .lbl { font-size: 13px; font-weight: 500; }
  .lbl.small { font-size: 11.5px; }
  .note { font-size: 12.5px; fill: var(--ink); }
  .ref { stroke: var(--grey); stroke-dasharray: 2 3; }
  .lead { stroke: var(--grey); }
  .mark { fill: #fff; stroke: var(--ink); stroke-width: 1.8; }
  .cross { stroke: var(--ink); stroke-opacity: 0.35; pointer-events: none; }
  .hit { fill: transparent; cursor: crosshair; }
  .num circle { fill: var(--ink); }
  .num text { fill: #fff; font-size: 11px; font-weight: 600; }
  .notes { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 8px; font-size: 13px; line-height: 1.45; color: var(--ink); }
  .notes li { display: grid; grid-template-columns: 22px 1fr; }
  .n { display: inline-grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 11px; font-weight: 600; margin-top: 1px; }
  @media (prefers-reduced-motion: reduce) { .ln { transition: none; } }
</style>
