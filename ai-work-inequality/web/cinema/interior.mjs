export function drawInterior(ctx, v) {
  const { width, height, frame, next = frame, reduced } = v;
  const mix = Math.max(0, Math.min(1, v.mix || 0));
  const provider =
    frame.providers.find((p) => p.id === v.selectedId) || frame.providers[0];
  const following =
    next.providers.find((p) => p.id === provider.id) || provider;
  const team = frame.physicians.filter((p) => p.providerId === provider.id);
  const nextTeam = new Map(next.physicians.map((p) => [p.id, p]));
  const lerp = (a, b) => a + (b - a) * mix;
  const adoption = lerp(provider.adoption, following.adoption);
  const motion = reduced ? 0 : v.motion || 0;
  const narrow = width < 600;
  const columns = narrow ? 2 : 4;
  const rows = Math.ceil(team.length / columns);
  const rw = 190,
    rh = narrow ? 99 : 111;
  const bw = columns * rw,
    bh = rows * rh;
  const sceneWidth = bw + 116,
    sceneHeight = bh + 133;
  const push = reduced
    ? 1
    : 1 + Math.max(0, Math.min(1, v.sceneProgress || 0)) * 0.025;
  const scale =
    Math.min(width / sceneWidth, height / sceneHeight) * 0.95 * push;
  const ox = (width - bw * scale) / 2;
  const oy = (height - sceneHeight * scale) / 2 + 63 * scale;
  const hits = [];
  const rect = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  const line = (x, y, xx, yy, c, weight = 1) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = c;
    ctx.lineWidth = weight;
    ctx.stroke();
  };
  const circle = (x, y, r, c) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  };
  const polygon = (points, c) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
  };
  ctx.save();
  rect(0, 0, width, height, "#f2f0e6");
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  ctx.save();
  ctx.translate(bw / 2, bh + 49);
  ctx.scale(1, 0.085);
  circle(0, 0, bw * 0.62, "#e2dfd1");
  ctx.restore();
  polygon(
    [
      [bw, 0],
      [bw + 22, 13],
      [bw + 22, bh + 38],
      [bw, bh + 25],
    ],
    "#b4b49b",
  );
  rect(-5, -16, bw + 10, 16, "#9baa94");
  polygon(
    [
      [-5, -16],
      [10, -29],
      [bw + 23, -29],
      [bw + 5, -16],
    ],
    "#d3d8c5",
  );
  rect(15, -48, 74, 19, "#c6ccba");
  rect(19, -52, 67, 4, "#e2e5d6");
  for (let j = 0; j < 5; j++)
    line(24 + j * 11, -43, 24 + j * 11, -33, "#a7af9d", 2);
  rect(bw - 102, -39, 78, 10, "#d4d5c4");
  for (let j = 0; j < 4; j++) {
    rect(bw - 96 + j * 17, -39, 12, 4, "#b4bda8");
  }
  ctx.fillStyle = "#f6f4e8";
  ctx.font = "10px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`${provider.id}  MEDICAL`, 13, -5);
  rect(bw - 27, -13, 4, 10, "#f6f4e8");
  rect(bw - 30, -10, 10, 4, "#f6f4e8");
  team.forEach((doctor, i) => {
    const nxt = nextTeam.get(doctor.id) || doctor;
    const active = lerp(+doctor.employed, +nxt.employed);
    const x = (i % columns) * rw,
      y = Math.floor(i / columns) * rh;
    ctx.save();
    ctx.translate(x, y);
    rect(0, 0, rw, rh, "#c7c5ad");
    rect(
      6,
      4,
      rw - 12,
      rh - 11,
      `rgb(${Math.round(220 + active * 16)},${Math.round(222 + active * 12)},${Math.round(206 + active * 15)})`,
    );
    rect(6, rh - 29, rw - 12, 23, "#d4c3aa");
    polygon(
      [
        [6, rh - 29],
        [rw - 6, rh - 29],
        [rw - 20, rh - 19],
        [6, rh - 19],
      ],
      "#bfad94",
    );
    for (let k = 0; k < 5; k++)
      line(12 + k * 38, rh - 18, 23 + k * 38, rh - 7, "#c1af98", 0.7);
    rect(16, 15, 42, 32, "#a2b4a9");
    rect(19, 18, 36, 26, "#dbe5d7");
    polygon(
      [
        [19, 18],
        [39, 18],
        [19, 39],
      ],
      "#ecedde",
    );
    line(37, 18, 37, 44, "#f4f1df", 2);
    line(19, 31, 55, 31, "#f4f1df", 2);
    rect(67, 15, 39, 3, "#adad94");
    rect(71, 5, 5, 10, "#80958a");
    rect(78, 8, 5, 7, "#c29b84");
    rect(86, 7, 8, 8, "#eee8d4");
    rect(96, 10, 5, 5, "#b5b7a0");
    rect(rw - 48, 12, 27, 27, "#f0ebdc");
    rect(rw - 45, 15, 21, 21, "#d3d8c4");
    line(rw - 35, 19, rw - 35, 31, "#a98b73", 2);
    line(rw - 41, 25, rw - 29, 25, "#a98b73", 2);
    rect(16, rh - 47, 44, 8, "#edeedd");
    rect(19, rh - 52, 12, 5, "#faf5e7");
    rect(16, rh - 39, 44, 5, "#8b9e94");
    line(21, rh - 34, 21, rh - 21, "#84948a", 3);
    line(54, rh - 34, 54, rh - 21, "#84948a", 3);
    rect(rw - 59, rh - 43, 42, 6, "#aa8c75");
    rect(rw - 55, rh - 37, 4, 18, "#b69b7f");
    rect(rw - 24, rh - 37, 4, 18, "#b69b7f");
    rect(rw - 43, rh - 64, 26, 18, "#6c8176");
    rect(
      rw - 40,
      rh - 61,
      20,
      12,
      `rgb(${Math.round(99 + 76 * adoption)},${Math.round(122 + 87 * adoption)},${Math.round(108 + 62 * adoption)})`,
    );
    rect(rw - 32, rh - 46, 4, 3, "#6c8176");
    ctx.save();
    ctx.globalAlpha = adoption;
    line(rw - 38, rh - 56, rw - 34, rh - 56, "#f2f6d8");
    line(rw - 34, rh - 56, rw - 31, rh - 59, "#f2f6d8");
    line(rw - 31, rh - 59, rw - 28, rh - 53, "#f2f6d8");
    line(rw - 28, rh - 53, rw - 20, rh - 56, "#f2f6d8");
    const scan = reduced ? 0.5 : (motion * 0.17 + i * 0.13) % 1;
    rect(rw - 39, rh - 61 + scan * 10, 18, 1, "#e0ecc8");
    ctx.restore();
    rect(rw - 81, rh - 38, 18, 5, "#80968b");
    rect(rw - 78, rh - 33, 3, 12, "#80968b");
    rect(rw - 82, rh - 53, 5, 18, "#80968b");
    const px = rw - 72,
      py = rh - 47;
    ctx.save();
    ctx.globalAlpha = active;
    const hand = reduced ? 0 : Math.sin(motion * 1.8 + i * 0.9) * 1.3;
    rect(px - 6, py + 10, 4, 15, "#687c72");
    rect(px + 2, py + 10, 4, 15, "#687c72");
    rect(px - 8, py - 6, 16, 19, "#fffcef");
    line(px, py - 4, px, py + 11, "#bdc4ad");
    rect(px + 4, py, 3, 4, "#809a8b");
    circle(px, py - 13, 6, ["#c8997d", "#d5ad8c", "#bc8d72"][i % 3]);
    ctx.beginPath();
    ctx.arc(px, py - 14, 6, Math.PI, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0 ? "#6e6b5c" : "#5b5e50";
    ctx.fill();
    line(px - 7, py - 2, px - 12, py + 7, "#fffcef", 4);
    line(px + 7, py - 2, px + 14, py + 5 + hand, "#fffcef", 4);
    ctx.restore();
    rect(0, rh - 7, rw, 7, "#abb39a");
    rect(0, 0, 6, rh, "#bdc3ab");
    rect(rw - 6, 0, 6, rh, "#bdc3ab");
    rect(0, 0, rw, 4, "#eeeede");
    if (v.hoverId === doctor.id) {
      ctx.strokeStyle = "#b1795e";
      ctx.lineWidth = 2;
      ctx.strokeRect(7, 6, rw - 14, rh - 15);
    }
    ctx.restore();
    hits.push({
      kind: "physician",
      id: doctor.id,
      x: ox + x * scale,
      y: oy + y * scale,
      width: rw * scale,
      height: rh * scale,
    });
  });
  rect(0, bh, bw, 34, "#c8cbb5");
  rect(bw / 2 - 31, bh + 3, 62, 31, "#9eb5a5");
  rect(bw / 2 - 27, bh + 6, 23, 25, "#c7d7c3");
  rect(bw / 2 + 4, bh + 6, 23, 25, "#c7d7c3");
  line(bw / 2, bh + 3, bw / 2, bh + 34, "#f0efdd", 2);
  rect(bw / 2 - 38, bh - 1, 76, 5, "#b6bea6");
  rect(-7, bh + 34, bw + 14, 7, "#b9bea6");
  rect(-15, bh + 41, bw + 30, 6, "#d1d2bc");
  [-29, bw + 39].forEach((x, j) => {
    rect(x - 7, bh + 20, 14, 22, "#be9b7f");
    rect(x - 2, bh - 10, 4, 33, "#9f9577");
    circle(x, bh - 13, 15, "#a8b59a");
    circle(x - 7, bh - 5, 11, "#b6c0a5");
    circle(x + 6, bh - 4, 10, "#99ac91");
  });
  ctx.restore();
  return hits;
}
