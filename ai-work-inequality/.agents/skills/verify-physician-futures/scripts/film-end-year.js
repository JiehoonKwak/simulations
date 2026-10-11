(() => {
  const timeline = document.querySelector("#timeline");
  timeline.value = timeline.max;
  timeline.dispatchEvent(new Event("input", { bubbles: true }));
  return Number(timeline.value);
})();
