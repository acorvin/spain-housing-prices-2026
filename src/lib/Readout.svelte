<script>
  import { fmt, metricByKey } from './data.js';

  let { row, isRegion, metric } = $props();
  const m = $derived(metricByKey.get(metric));
  const others = $derived(
    [
      ['all', 'Past year'],
      ['newHomes', 'New homes'],
      ['secondHand', 'Second-hand'],
      ['quarter', 'Last quarter'],
      ['yearToDate', 'So far in 2026'],
    ].filter(([k]) => k !== metric && (isRegion || ['all', 'newHomes', 'secondHand'].includes(k)) && row[k] !== undefined),
  );
</script>

<div class="readout" aria-live="polite">
  <div class="main">
    <p class="name">{row.name}</p>
    <p class="big">{fmt(row[metric])}</p>
    <p class="cap">{m.title}</p>
  </div>
  <dl>
    {#each others as [k, label] (k)}
      <div>
        <dt>{label}</dt>
        <dd>{fmt(row[k])}</dd>
      </div>
    {/each}
  </dl>
</div>

<style>
  .readout {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px 32px;
    min-height: 92px;
    padding: 14px 0 16px;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--rule);
  }
  p {
    margin: 0;
  }
  .name {
    font-size: 15px;
    font-weight: 500;
  }
  .big {
    font-size: 38px;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .cap {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--grey);
  }
  dl {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 28px;
    margin: 0;
  }
  dt {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--grey);
  }
  dd {
    margin: 2px 0 0;
    font-size: 16px;
    font-variant-numeric: tabular-nums;
  }
</style>
