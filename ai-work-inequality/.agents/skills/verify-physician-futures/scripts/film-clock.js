(() => {
  const film = document.querySelector("#film").dataset;
  const pressed = (s) => document.querySelector(s).getAttribute("aria-pressed");
  return JSON.stringify({
    time: film.time,
    motion: film.motion,
    playing: pressed("#play"),
    loop: pressed("#loop"),
    speed: document.querySelector("#speed").value,
    year: document.querySelector("#year").textContent,
  });
})();
