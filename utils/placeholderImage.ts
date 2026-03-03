export function getPlaceholderImage(
  label: string,
  width = 960,
  height = 720
): string {
  const bg = encodeURIComponent("#e9efff");
  const fg = encodeURIComponent("#5965f3");
  const text = encodeURIComponent(label.length > 40 ? label.slice(0, 40) + "…" : label);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#fce7f3'/>
          <stop offset='50%' stop-color='#e9efff'/>
          <stop offset='100%' stop-color='#e0f2fe'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <rect x='0' y='0' width='100%' height='100%' fill='${bg}' opacity='0.35'/>
      <circle cx='70' cy='70' r='36' fill='${fg}' opacity='0.25'/>
      <rect x='40' y='140' width='${width - 80}' height='${height - 220}' rx='24' fill='#ffffff' opacity='0.25'/>
      <text x='50%' y='90%' dominant-baseline='middle' text-anchor='middle'
            font-family='system-ui,Segoe UI,Roboto' font-size='28' fill='#374151'>
        ${text}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
