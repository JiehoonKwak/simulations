(() => {
  const widths = (s) => {
    const e = document.querySelector(s);
    return { client: e.clientWidth, scroll: e.scrollWidth };
  };
  return JSON.stringify({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    inspector: widths("#inspector"),
    settings: widths("#settings"),
  });
})();
