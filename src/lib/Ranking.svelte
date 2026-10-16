<script>
  import { flip } from 'svelte/animate';
  import { rankedBy, colorFor, fmt, metricByKey } from './data.js';

  let { active, metric, onhover, onleave, ontoggle } = $props();

  const m = $derived(metricByKey.get(metric));
  const list = $derived(rankedBy(metric));
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dur = reduced ? 0 : 650;
</script>

<ol class="ranking">
  {#each list as r (r.id)}
    <li animate:flip={{ duration: dur }}>
      <button
        type="button"
        class:dim={active && active !== r.id}
        class:on={active === r.id}
        onpointerenter={() => onhover(r.id)}
        onpointerleave={onleave}
        onfocus={() => onhover(r.id)}
        onblur={onleave}
        onclick={() => ontoggle(r.id)}
      >
        <span class="name">{r.name}</span>
        <span class="track">
          {#if r[metric] != null}
            <span class="bar" style:width="{(r[metric] / m.max) * 100}%" style:background={colorFor(metric, r[metric])}></span>
          {/if}
          {#if m.spain != null}
            <span class="ref" style:left="{(m.spain / m.max) * 100}%"></span>
          {/if}
        </span>
        <span class="value">{fmt(r[metric])}</span>
      </button>
    </li>
  {/each}
</ol>
{#if m.spain != null}
  <p class="key"><span class="tick"></span> Spain as a whole, {fmt(m.spain)}</p>
{/if}

<style>
  .ranking {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    display: grid;
    grid-template-columns: minmax(0, 11.5em) 1fr 3.6em;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 5px 0;
    border: 0;
    border-bottom: 1px solid var(--rule);
    background: none;
    color: inherit;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: opacity 120ms;
  }
  button.dim {
    opacity: 0.5;
  }
  button.on .name {
    font-weight: 600;
  }
  button:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: -2px;
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .track {
    position: relative;
    display: block;
    height: 10px;
  }
  .bar {
    display: block;
    height: 100%;
    transition: width 650ms cubic-bezier(0.22, 1, 0.36, 1), background 650ms;
  }
  .ref {
    position: absolute;
    top: -5px;
    bottom: -5px;
    width: 0;
    border-left: 1px dashed var(--ink);
    opacity: 0.55;
    transition: left 650ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .value {
    font-family: var(--mono);
    font-size: 12px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .key {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px 0 0;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--grey);
  }
  .tick {
    width: 0;
    height: 12px;
    border-left: 1px dashed var(--ink);
    opacity: 0.55;
  }
  @media (prefers-reduced-motion: reduce) {
    .bar, .ref { transition: none; }
  }
</style>
