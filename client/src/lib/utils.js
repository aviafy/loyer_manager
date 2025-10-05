export function parseAmount(text) {
  if (text == null) return 0.0;
  let t = String(text).trim();
  if (!t) return 0.0;
  t = t.replace(/[^0-9,.-]/g, "");
  if (t.includes(",") && !t.includes(".")) {
    t = t.replace(/,/g, ".");
  } else {
    t = t.replace(/,/g, "");
  }
  const v = parseFloat(t);
  return Number.isNaN(v) ? 0.0 : v;
}

export function parseDate(text) {
  if (!text) return null;
  const patterns = [
    {
      re: /^(\d{4})-(\d{2})-(\d{2})$/,
      map: (m) => new Date(`${m[1]}-${m[2]}-${m[3]}`),
    },
    {
      re: /^(\d{2})\.(\d{2})\.(\d{4})$/,
      map: (m) => new Date(`${m[3]}-${m[2]}-${m[1]}`),
    },
    {
      re: /^(\d{2})\/(\d{2})\/(\d{4})$/,
      map: (m) => new Date(`${m[3]}-${m[2]}-${m[1]}`),
    },
  ];

  for (const p of patterns) {
    const m = text.match(p.re);
    if (m) return p.map(m);
  }

  return null;
}
