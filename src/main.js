import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app') });

// When the page sits in an iframe, tell the parent how tall it is.
// getBoundingClientRect is used because scrollHeight never drops below
// the frame's own height, which leaves a blank gap under the embed.
if (window.parent !== window) {
  const post = () => {
    const height = Math.ceil(document.documentElement.getBoundingClientRect().height);
    window.parent.postMessage({ type: 'spain-housing-prices:height', height }, '*');
  };
  new ResizeObserver(post).observe(document.documentElement);
  window.addEventListener('load', post);
}
