<script>
  import { classesFor, NO_DATA, metricByKey } from './data.js';

  let { metric } = $props();
  const classes = $derived(classesFor(metric));
  const hasGaps = $derived(metric === 'newHomes' || metric === 'secondHand');
</script>

<ul class="legend" aria-label="Map colours">
  {#each classes as c}
    <li>
      <span class="swatch" style:background={c.fill}></span>
      <span class="label">{c.label}</span>
    </li>
  {/each}
</ul>
{#if hasGaps}
  <p class="gap"><span class="swatch" style:background={NO_DATA}></span> No figure for Ceuta and Melilla</p>
{/if}

<style>
  .legend {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .swatch {
    display: block;
    height: 10px;
    transition: background 500ms;
  }
  .label {
    display: block;
    margin-top: 6px;
    font-family: var(--mono);
    font-size: 11px;
    line-height: 1.3;
    color: var(--grey);
  }
  .gap {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px 0 0;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--grey);
  }
  .gap .swatch {
    width: 22px;
  }
</style>
