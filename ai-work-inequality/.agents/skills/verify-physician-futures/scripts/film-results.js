(() => {
  const q = (s) => document.querySelector(s);
  const text = (s) => q(s).innerText.replace(/\s+/g, " ").trim();
  q("#break-even").open = true;
  return JSON.stringify({
    scenario: q("#current-scenario").textContent,
    preset: q("#preset").value,
    year: q("#year").textContent,
    readouts: {
      work: q("#working").textContent,
      care: q("#volume").textContent,
      earnings: q("#income").textContent,
    },
    groups: text("#group-results"),
    breakEven: text("#break-even-results"),
    signature: q("#signature").textContent,
  });
})();
