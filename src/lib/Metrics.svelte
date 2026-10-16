<script>
  import { metrics } from './data.js';

  let { metric, onselect } = $props();
</script>

<div class="seg" role="group" aria-label="What the map shows">
  {#each metrics as m (m.key)}
    <button type="button" aria-pressed={metric === m.key} onclick={() => onselect(m.key)}>{m.tab}</button>
  {/each}
</div>

<style>
  .seg {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  button {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 8px 14px;
    border: 1px solid var(--rule);
    border-radius: 999px;
    background: none;
    color: var(--grey);
    cursor: pointer;
    transition: background 200ms, color 200ms, border-color 200ms;
  }
  button:hover {
    border-color: var(--grey);
  }
  button[aria-pressed='true'] {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }
  button:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 2px;
  }
</style>
