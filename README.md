# House prices in Spain by region, second quarter of 2026

An interactive map of how much house prices rose in each of Spain's autonomous communities in the year to the second quarter of 2026. Prices rose everywhere. Among the 17 communities the increase runs from 9.5% in Navarra to 15.0% in Asturias, and across Spain as a whole it was 12.2%.

Live page: https://acorvin.github.io/spain-housing-prices-2026/

## What the page shows

The map shades each community by the change in the Instituto Nacional de Estadística's housing price index, in six classes from pale sand to deep oxblood. Five tabs switch the measure: the past year (all homes), new homes, second-hand homes, the last quarter, and the change so far in 2026. The map colors, ranking bars and ranking order animate to the new measure, and a dashed line marks Spain as a whole where INE publishes it. On first view the map fills in from the smallest increase to the largest (skipped for people who prefer reduced motion). Hovering over a region on the map, or its row in the ranking, shows all its figures. Clicking a region keeps it selected.

Ceuta and Melilla are autonomous cities and too small to read as shapes, so they are drawn as dots at their true positions. The Canary Islands sit in a box at the bottom left. Gibraltar appears in the map outlines and is left out.

## The line chart

Below the map, a line chart shows INE's national annual change by quarter from the third quarter of 2016 to the second quarter of 2026, for all homes (thickest line, in ink), new homes and second-hand homes. The lines are labelled directly, the y-axis starts at zero, and three annotations mark the 0.9% low in early 2021, the jump to 11.3% in the fourth quarter of 2024 and the latest quarter. Hovering over or touching the chart reads off any quarter. On a narrow screen the annotations become numbered markers with the text underneath. The data is `data/ipv_national_annual_change.csv`.

## Data

The figures are in `data/ipv_regions_2026q2.csv`, one row per community or city:

| Column | Meaning |
| --- | --- |
| `ine_code` | INE's two-digit code, which the map uses to match each shape to its row |
| `region`, `iso_code` | Name and ISO 3166-2 code |
| `annual_change_all` | Annual change, all homes, in percent |
| `annual_change_new`, `annual_change_second_hand` | Annual change for new and for second-hand homes. Blank for Ceuta and Melilla, where INE publishes no split |
| `quarterly_change_all` | Change on the previous quarter, all homes |
| `ytd_change_all` | Change since the end of 2025, all homes |

The source is INE's Índice de Precios de Vivienda (housing price index), second quarter of 2026, from table 80270 of the INE data service and the press release at https://www.ine.es/dyngs/Prensa/IPV2T26.pdf. The national figures in the page (12.2% for all homes, 7.4% for new and 12.9% for second-hand) come from INE series IPV1376, IPV1615 and IPV1620 (the quarterly 3.4% and year-to-date 7.0% come from IPV1522 and IPV1612). Every regional figure was checked against INE's raw data after it was copied.

The index follows the prices of homes that were actually sold, not asking prices, and its base year is 2025.

## Running it

You need Node 20.19 or newer.

```
npm install
npm run dev      # local preview
npm run build    # writes the site to docs/
```

The build writes to `docs/` with relative paths, and GitHub Pages serves that folder from the main branch. Commit `docs/` after every build.

The page is Svelte and D3 (`d3-geo` for the projections, `d3-scale` for the colour classes). The map outlines come from the `es-atlas` package, which converts the Instituto Geográfico Nacional's data to TopoJSON.

## Embedding

`embed/snippet.html` holds the iframe and a short script for a Code Block on alexcorvin.io. The page posts its height to the parent as `spain-housing-prices:height`, and the script sets the frame to match.

## Credits

Housing data: Instituto Nacional de Estadística. Map outlines: Instituto Geográfico Nacional, through [es-atlas](https://github.com/martgnz/es-atlas) (MIT). Typeface: Geist and Geist Mono (SIL Open Font License).

© Alex Corvin
