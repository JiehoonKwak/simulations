export function drawStreet(ctx, v) {
  const { width, height, frame } = v;
  if (!frame || !width || !height) return [];
  const next = v.next || frame;
  const mix = Math.max(0, Math.min(1, v.mix || 0));
  const lerp = (a, b, t = mix) => a + (b - a) * t;
  const providers = frame.providers;
  const selected = Math.max(
    0,
    providers.findIndex((p) => p.id === v.selectedId),
  );
  const scale = Math.min(
    width < 600 ? 1.16 : 1.65,
    Math.max(0.55, (height - 70) / 330),
  );
  const ww = width / scale,
    hh = height / scale;
  const ground = hh - 57,
    pitch = 250;
  const push = v.reduced
    ? 0
    : Math.sin((v.sceneProgress || 0) * Math.PI - Math.PI / 2) *
      (width < 600 ? 12 : 29);
  const camera = selected * pitch + 100 - ww / 2 + push;
  const boxes = [];
  const nextPeople = new Map(next.physicians.map((p) => [p.id, p]));
  const nextProviders = new Map(next.providers.map((p) => [p.id, p]));
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  const line = (x, y, xx, yy, color, thickness = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.stroke();
  };
  const label = (t, x, y, size, color, align = "left") => {
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.font = `${size}px "Apple SD Gothic Neo", Arial, sans-serif`;
    ctx.fillText(t, x, y);
  };
  const ellipse = (x, y, rx, ry, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  function tree(x, y, size, phase) {
    const sway = v.reduced ? 0 : Math.sin((v.motion || 0) * 0.45 + phase) * 1.1;
    ellipse(x + 8, y + 3, 26 * size, 4, "#6a7f6420");
    line(x, y, x + sway, y - 58 * size, "#83927b", 2.5 * size);
    for (const [dx, dy, r, c] of [
      [-11, -71, 17, "#b1bea2"],
      [9, -82, 22, "#a3b493"],
      [18, -63, 15, "#b4c2a7"],
      [-12, -89, 13, "#c1ccb5"],
    ])
      ellipse(
        x + dx * size + sway,
        y + dy * size,
        r * size,
        r * 1.08 * size,
        c,
      );
    line(x, y - 21 * size, x + 10 * size + sway, y - 73 * size, "#82957a", 1);
    rect(x - 13 * size, y - 2, 26 * size, 5, "#b1b4a0");
  }
  function building(provider, index) {
    const large = provider.size === "large";
    const x = index * pitch,
      w = large ? 208 : 180,
      h = large ? 264 : 177,
      y = ground - h;
    const isSelected = provider.id === v.selectedId,
      hover = provider.id === v.hoverId;
    const np = nextProviders.get(provider.id) || provider;
    const adoption = lerp(provider.adoption, np.adoption);
    const people = frame.physicians.filter((p) => p.providerId === provider.id);
    const wall = ["#c7cec5", "#bfcbd0", "#c8cec7", "#c1cbc8"][index % 4];
    ctx.save();
    ctx.shadowColor = "#52696b25";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 5;
    rect(x, y, w, h, wall);
    ctx.restore();
    rect(x + w - 15, y, 15, h, "#9fafa9");
    rect(x + 2, y + 5, w - 18, 4, "#e0e5da");
    rect(x - 5, y - 7, w + 10, 8, "#5c777b");
    rect(x - 5, y - 9, w + 10, 2, "#92a4a1");
    for (let floor = y + 38; floor < ground - 44; floor += 42) {
      line(x + 4, floor, x + w - 20, floor, "#b4c0b9");
      line(x + 4, floor + 1, x + w - 20, floor + 1, "#d6ddd2");
    }
    if (large) {
      rect(x + 24, y - 23, 44, 16, "#9dafa9");
      rect(x + 22, y - 26, 48, 4, "#bcc8bc");
      for (let j = 0; j < 4; j++)
        line(x + 29, y - 19 + j * 3, x + 61, y - 19 + j * 3, "#7e9692");
      rect(x + 98, y - 15, 37, 7, "#aebfb8");
      line(x + 166, y - 9, x + 166, y - 37, "#7b9390", 1.4);
      line(x + 157, y - 31, x + 177, y - 31, "#7b9390", 1.2);
    } else {
      rect(x + 22, y - 20, 40, 11, "#a7b5aa");
      rect(x + 123, y - 25, 16, 16, "#9eafa5");
    }
    rect(x + 76, y - 20, 34, 9, "#657f7b");
    rect(x + 78, y - 18, 30, 5, "#849894");
    ctx.save();
    ctx.globalAlpha = adoption;
    rect(x + 78, y - 18, 30, 5, "#e4f1c7");
    ctx.restore();
    const cols = 4,
      winw = 23,
      winh = 28,
      gap = 15,
      start = x + (w - 15 - cols * winw - (cols - 1) * gap) / 2;
    people.forEach((person, j) => {
      const px = start + (j % cols) * (winw + gap),
        py = y + 45 + Math.floor(j / cols) * 42;
      const after = nextPeople.get(person.id) || person;
      const active = lerp(Number(person.employed), Number(after.employed));
      rect(px - 2, py - 2, winw + 4, winh + 4, "#698486");
      rect(px, py, winw, winh, "#7b9291");
      ctx.save();
      ctx.globalAlpha = active;
      const warm = ctx.createLinearGradient(px, py, px, py + winh);
      warm.addColorStop(0, "#f2dbaf");
      warm.addColorStop(1, "#dcc18b");
      ctx.fillStyle = warm;
      ctx.fillRect(px, py, winw, winh);
      const bob = v.reduced
        ? 0
        : Math.sin((v.motion || 0) * 0.8 + j * 1.7 + index) * 0.35;
      ellipse(px + 11.5, py + 11 + bob, 3, 3, "#777163");
      ctx.fillStyle = "#e6e4d2";
      ctx.beginPath();
      ctx.moveTo(px + 6, py + 25);
      ctx.lineTo(px + 8, py + 16 + bob);
      ctx.quadraticCurveTo(px + 11.5, py + 13 + bob, px + 15, py + 16 + bob);
      ctx.lineTo(px + 17, py + 25);
      ctx.fill();
      line(px + 11.5, py + 17 + bob, px + 11.5, py + 23, "#a6a899", 0.7);
      ctx.restore();
      rect(px, py, winw, 3, "#82979880");
      line(px + winw / 2, py, px + winw / 2, py + winh, "#82958e", 0.85);
      line(px, py + winh - 8, px + winw, py + winh - 8, "#82958e", 0.7);
      rect(px - 4, py + winh + 2, winw + 8, 3, "#e0e3d4");
    });
    rect(x + 11, y + 12, w - 46, 21, "#dce2d4");
    label(
      `${provider.id}  ${large ? "종합병원" : "의원"}`,
      x + 19,
      y + 27,
      12,
      "#3d6265",
    );
    rect(x + w - 31, y + 15, 12, 12, "#e3e7db");
    rect(x + w - 27, y + 16, 4, 10, "#77978c");
    rect(x + w - 30, y + 19, 10, 4, "#77978c");
    const door = ground - 42;
    rect(x + 19, door, 30, 42, "#627e7c");
    rect(x + 22, door + 3, 24, 32, "#abc1b8");
    line(x + 34, door + 3, x + 34, ground, "#698580");
    line(x + 31, door + 22, x + 31, door + 29, "#dce1d3", 1.2);
    rect(x + 62, door + 2, w - 94, 30, "#9fb7b0");
    rect(x + 66, door + 6, w - 102, 20, "#b8cac1");
    for (let a = 0; a < 5; a++)
      rect(
        x + 57 + (a * (w - 80)) / 5,
        door - 9,
        (w - 80) / 5,
        9,
        a % 2 ? "#d3d6bf" : "#73958a",
      );
    line(x + 58, door, x + w - 24, door, "#56796f", 1.2);
    rect(x - 4, ground - 1, w + 8, 5, "#a6b2a8");
    rect(x - 8, ground + 4, w + 16, 4, "#d2d8c9");
    if (provider.closed) {
      rect(x + 15, door - 4, w - 39, 44, "#748580");
      for (let ry = door; ry < ground; ry += 5)
        line(x + 16, ry, x + w - 25, ry, "#99a69b");
      rect(x + w / 2 - 25, door + 10, 50, 19, "#c9bfaa");
      label("폐업", x + w / 2, door + 24, 11, "#685d4b", "center");
    }
    if (isSelected || hover) {
      line(
        x - 9,
        ground + 12,
        x + w + 9,
        ground + 12,
        isSelected ? "#658778" : "#b3bea5",
        2,
      );
      ellipse(x + w / 2, ground + 12, 2.5, 2.5, "#547668");
    }
    if (index % 2 === 0) tree(x + w + 32, ground + 6, 0.8, index);
    else {
      line(x + w + 22, ground + 8, x + w + 22, ground - 88, "#8a9d91", 2);
      line(x + w + 22, ground - 88, x + w + 39, ground - 88, "#8a9d91", 2);
      rect(x + w + 32, ground - 91, 16, 4, "#829b8d");
      rect(x + w + 34, ground - 87, 12, 2, "#dfc899");
    }
    if (x + w >= camera && x <= camera + ww)
      boxes.push({
        kind: "provider",
        id: provider.id,
        x: (x - camera) * scale,
        y: y * scale,
        width: w * scale,
        height: h * scale,
      });
  }
  ctx.save();
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#f2f0e6");
  sky.addColorStop(0.68, "#e5e8da");
  sky.addColorStop(1, "#d5dfd1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  ctx.scale(scale, scale);
  for (let i = -10; i < 60; i++) {
    const x = i * 142 - camera * 0.21,
      bh = 54 + (((i + 40) * 31) % 67);
    rect(x, ground - bh - 12, 116, bh, "#d4ddd1");
    rect(x + 14, ground - bh - 21, 34, 10, "#d4ddd1");
  }
  rect(0, ground + 8, ww, 24, "#d8dccc");
  line(0, ground + 31, ww, ground + 31, "#a5b5a5", 2);
  rect(0, ground + 34, ww, hh - ground, "#aabbb2");
  line(0, ground + 36, ww, ground + 36, "#bac9ba", 2);
  ctx.save();
  ctx.translate(-camera, 0);
  for (let i = 0; i < providers.length; i++)
    if (i * pitch + 250 >= camera && i * pitch <= camera + ww + 100)
      building(providers[i], i);
  for (let x = Math.floor(camera / 80) * 80; x < camera + ww + 80; x += 80) {
    line(x, ground + 49, x + 37, ground + 49, "#d4ddcc", 1.8);
    line(x, ground + 12, x, ground + 28, "#bdc9b8", 0.8);
  }
  ctx.restore();
  ctx.restore();
  return boxes;
}
