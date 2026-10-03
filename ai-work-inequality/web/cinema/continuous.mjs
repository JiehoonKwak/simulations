export function drawContinuous(ctx, v) {
  const { width, height, frame, baseline } = v,
    next = v.next || frame;
  const m = Math.max(0, Math.min(1, v.mix || 0)),
    motion = v.reduced ? 0 : v.motion || 0;
  const blend = (a, b) => a + (b - a) * m;
  const mobile = width < 650,
    rw = mobile ? 66 : 116,
    rh = mobile ? 58 : 89,
    cols = mobile ? 2 : 4,
    lift = mobile ? 19 : 32;
  const bw = cols * rw + lift,
    gap = mobile ? 27 : 78,
    margin = mobile ? 20 : 47,
    worldW = bw * 2 + gap + margin * 2;
  const ids = v.providerIds || ["P1", "P2"];
  const providers = ids
    .map((id) => frame.providers.find((p) => p.id === id))
    .filter(Boolean);
  const teams = providers.map((p) =>
    frame.physicians.filter((d) => d.providerId === p.id),
  );
  const maxRows = Math.max(1, ...teams.map((t) => Math.ceil(t.length / cols)));
  const ground = maxRows * rh + 72,
    worldH = ground + 92;
  const scale = Math.min(width / worldW, height / worldH) * 0.98,
    ox = (width - worldW * scale) / 2,
    oy = (height - worldH * scale) / 2;
  const hits = [];
  const rect = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  const line = (x, y, u, w, c, n = 1) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(u, w);
    ctx.strokeStyle = c;
    ctx.lineWidth = n;
    ctx.stroke();
  };
  const circle = (x, y, r, c) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  };
  const poly = (points, c) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
  };
  function figure(
    x,
    y,
    color,
    phase,
    doctor = false,
    alpha = 1,
    s = 1,
    activity = 1,
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha = alpha;
    const step = v.reduced ? 0 : Math.sin(phase * 8) * 3 * activity;
    line(-2, -8, -3 + step, 0, "#414e45", 2.8);
    line(3, -8, 4 - step, 0, "#414e45", 2.8);
    rect(-5, -19, 10, 12, color);
    circle(0, -23, 4.2, "#c99573");
    ctx.beginPath();
    ctx.arc(0, -24, 4.2, Math.PI, Math.PI * 2);
    ctx.fillStyle = "#373e35";
    ctx.fill();
    line(-5, -17, -8 - step * 0.6, -10, color, 2.8);
    line(5, -17, 8 + step * 0.6, -11, color, 2.8);
    if (doctor) {
      line(0, -18, 0, -7, "#afb7a3");
      rect(2, -16, 2, 3, "#78988b");
    }
    ctx.restore();
  }
  function tree(x, y, r) {
    rect(x - 2, y - r * 0.4, 4, r * 1.2, "#9b9075");
    circle(x, y - r, r, "#a7b698");
    circle(x - r * 0.4, y - r * 0.7, r * 0.66, "#bec8ad");
    circle(x + r * 0.4, y - r * 0.72, r * 0.56, "#91a88a");
  }
  ctx.save();
  rect(0, 0, width, height, "#f2f0e6");
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  for (let j = 0; j < 7; j++) {
    const x = (j * worldW) / 6 - 35,
      h = 40 + (j % 3) * 28;
    rect(x, ground - h - 17, worldW / 10, h, "#e0e2d2");
    for (let a = 0; a < 3; a++)
      for (let b = 0; b < 2; b++)
        rect(x + 12 + a * 16, ground - h - 7 + b * 20, 7, 11, "#d0d7c4");
  }
  rect(0, ground + 26, worldW, 26, "#d8d5c2");
  rect(0, ground + 52, worldW, 40, "#b6bdac");
  line(0, ground + 52, worldW, ground + 52, "#e7e4d3", 2);
  for (let j = 0; j < worldW; j += 70)
    rect(j + 15, ground + 72, 32, 2, "#e7e8d7");
  const backdropTop = ground - maxRows * rh * 0.81;
  rect(
    margin + bw * 0.12,
    backdropTop,
    bw * 0.53,
    ground - backdropTop,
    "#e0e3d3",
  );
  rect(margin + bw * 0.12 - 4, backdropTop - 5, bw * 0.53 + 8, 5, "#d3d9c7");
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 4; col++)
      rect(
        margin + bw * 0.17 + col * bw * 0.11,
        backdropTop + 13 + row * 25,
        bw * 0.055,
        12,
        "#cbd5c1",
      );
  providers.forEach((p, k) => {
    const team = teams[k],
      pn = next.providers.find((q) => q.id === p.id) || p,
      rows = Math.ceil(team.length / cols),
      bh = rows * rh,
      bx = margin + k * (bw + gap),
      by = ground - bh - 13;
    const adoption = blend(p.adoption, pn.adoption),
      volume = blend(p.volume, pn.volume),
      base =
        baseline?.providers.find((q) => q.id === p.id)?.volume || p.volume || 1;
    const closed = p.closed && pn.closed,
      ratio = closed ? 0 : Math.max(0, volume / base);
    const retained = blend(p.retainedShare ?? 1, pn.retainedShare ?? 1);
    const work =
      blend(p.requiredWorkIndex ?? 100, pn.requiredWorkIndex ?? 100) / 100;
    const activity = Math.min(1, Math.max(0, work / Math.max(retained, 0.001)));
    const nextDocs = new Map(next.physicians.map((d) => [d.id, d]));
    const accent = k ? "#8c9f8a" : "#b48f74",
      wall = k ? "#bdc7ad" : "#d4bea3";
    poly(
      [
        [bx + bw, by],
        [bx + bw + 9, by + 8],
        [bx + bw + 9, ground + 18],
        [bx + bw, ground + 11],
      ],
      k ? "#9da98f" : "#b19a80",
    );
    rect(bx, by, bw, bh, wall);
    rect(bx, by - 17, bw, 17, accent);
    poly(
      [
        [bx, by - 17],
        [bx + 9, by - 24],
        [bx + bw + 9, by - 24],
        [bx + bw, by - 17],
      ],
      "#d9d9c5",
    );
    rect(bx + 15, by - 37, mobile ? 29 : 54, 13, "#bac1ac");
    for (let i = 0; i < 4; i++)
      line(
        bx + 19 + i * (mobile ? 6 : 12),
        by - 34,
        bx + 19 + i * (mobile ? 6 : 12),
        by - 27,
        "#8fa18b",
      );
    ctx.font = `${mobile ? 10 : 14}px Arial`;
    ctx.fillStyle = "#4d594c";
    ctx.textAlign = "left";
    ctx.fillText(
      p.label || (k ? "Salaried physicians" : "Practice proprietors"),
      bx,
      by - 46,
    );
    ctx.font = `${mobile ? 8 : 11}px Arial`;
    ctx.fillStyle = "#f8f6e8";
    ctx.fillText(
      `Staff ${Math.round((p.retainedShare ?? p.headcount / team.length) * 100)}% · AI ${Math.round(p.adoption * 100)}%`,
      bx + 5,
      by - 5,
    );
    rect(bx + 3, by + 3, lift - 6, bh - 6, "#c9d3bd");
    line(bx + lift / 2, by + 5, bx + lift / 2, ground - 15, "#a3b49b");
    team.forEach((d, i) => {
      const dn = nextDocs.get(d.id) || d,
        active = blend(d.presence ?? +d.employed, dn.presence ?? +dn.employed),
        x = bx + lift + (i % cols) * rw,
        y = by + Math.floor(i / cols) * rh;
      rect(
        x + 2,
        y + 2,
        rw - 4,
        rh - 5,
        `rgb(${Math.round(218 + active * 17)},${Math.round(219 + active * 14)},${Math.round(201 + active * 17)})`,
      );
      rect(x + 3, y + rh - 15, rw - 6, 12, "#c8b79b");
      poly(
        [
          [x + 3, y + rh - 18],
          [x + rw - 3, y + rh - 18],
          [x + rw - 9, y + rh - 12],
          [x + 3, y + rh - 12],
        ],
        "#d8c8ab",
      );
      rect(x + 7, y + 8, rw * 0.22, rh * 0.26, "#abc0ae");
      rect(x + 9, y + 10, rw * 0.22 - 4, rh * 0.26 - 4, "#dce9d4");
      line(
        x + 7 + rw * 0.11,
        y + 10,
        x + 7 + rw * 0.11,
        y + rh * 0.26 + 5,
        "#f7f4df",
      );
      rect(x + rw * 0.4, y + 9, rw * 0.21, 2, "#b4aa8b");
      rect(x + rw * 0.42, y + 4, 3, 5, "#b38c6e");
      rect(x + rw * 0.49, y + 3, 4, 6, "#92a588");
      const bedX = x + 7,
        bedY = y + rh - 23;
      rect(bedX, bedY, rw * 0.27, 5, "#eae8d7");
      rect(bedX + 1, bedY - 3, 6, 3, "#faf6e7");
      line(bedX + 3, bedY + 5, bedX + 3, bedY + 11, "#8e9e8b", 2);
      line(
        bedX + rw * 0.25,
        bedY + 5,
        bedX + rw * 0.25,
        bedY + 11,
        "#8e9e8b",
        2,
      );
      const deskX = x + rw * 0.72,
        deskY = y + rh - 23;
      rect(deskX, deskY, rw * 0.23, 4, "#a4876c");
      line(deskX + 3, deskY + 4, deskX + 3, deskY + 12, "#a4876c", 2);
      rect(deskX + 3, deskY - 13, rw * 0.17, 11, "#69826d");
      rect(
        deskX + 5,
        deskY - 11,
        rw * 0.17 - 4,
        7,
        `rgb(${Math.round(88 + 103 * adoption)},${Math.round(119 + 103 * adoption)},${Math.round(101 + 72 * adoption)})`,
      );
      ctx.save();
      ctx.globalAlpha = adoption;
      const scan = v.reduced ? 0.5 : (motion * 0.32 + i * 0.17) % 1;
      line(
        deskX + 5,
        deskY - 10 + scan * 6,
        deskX + rw * 0.17 - 1,
        deskY - 10 + scan * 6,
        "#f2fad9",
        1.4,
      );
      ctx.restore();
      const cycle = v.reduced
          ? 0
          : ((Math.sin(motion * 0.9 + i * 1.3) + 1) / 2) * activity,
        docX = x + rw * (0.46 + cycle * 0.19),
        docY = y + rh - 12;
      figure(
        docX,
        docY,
        "#fffcef",
        motion + i,
        true,
        active,
        mobile ? 0.68 : 0.92,
        activity,
      );
      rect(x, y + rh - 4, rw, 4, accent);
      rect(x, y, 3, rh, wall);
      rect(x + rw - 3, y, 3, rh, wall);
      if (v.hoverId === d.id) {
        ctx.strokeStyle = "#b77c54";
        ctx.lineWidth = 1.8;
        ctx.strokeRect(x + 3, y + 3, rw - 6, rh - 7);
      }
      hits.push({
        kind: "physician",
        id: d.id,
        providerId: p.id,
        x: ox + x * scale,
        y: oy + y * scale,
        width: rw * scale,
        height: rh * scale,
      });
    });
    rect(bx, ground - 13, bw, 32, wall);
    rect(bx + 3, ground - 9, lift - 6, 28, "#809d84");
    rect(bx + 6, ground - 6, lift - 12, 22, "#ccdcca");
    rect(bx - 4, ground + 19, bw + 8, 5, "#bdbea7");
    const baselinePatientCount = mobile ? 6 : 8;
    const patientCount = baselinePatientCount * 2;
    for (let i = 0; i < patientCount; i++) {
      const alpha = Math.min(1, Math.max(0, ratio * baselinePatientCount - i));
      if (alpha === 0) continue;
      const slot = (i * 5) % team.length,
        row = Math.floor(slot / cols),
        col = slot % cols;
      const targetX = bx + lift + col * rw + rw * 0.34,
        targetY = by + row * rh + rh - 11,
        doorX = bx + lift / 2,
        streetY = ground + 38;
      const route = [
        [-35 + k * worldW * 0.37, streetY],
        [doorX, streetY],
        [doorX, ground + 7],
        [doorX, targetY],
        [targetX, targetY],
        [targetX, targetY],
        [doorX, targetY],
        [doorX, ground + 7],
        [doorX, streetY],
        [worldW + 35, streetY],
      ];
      const phase =
        (((motion / 23 + i * 0.61803398875 + k * 0.29) % 1) + 1) % 1;
      const knots = [0, 0.16, 0.21, 0.32, 0.4, 0.64, 0.72, 0.83, 0.87, 1];
      let segment = 0;
      while (segment < 8 && phase > knots[segment + 1]) segment++;
      const u =
          (phase - knots[segment]) / (knots[segment + 1] - knots[segment]),
        a = route[segment],
        b = route[segment + 1],
        x = a[0] + (b[0] - a[0]) * u,
        y = a[1] + (b[1] - a[1]) * u;
      const fade = Math.min(1, phase * 30, (1 - phase) * 30),
        walking = segment !== 4;
      if (segment === 2 || segment === 6) {
        const cabScale = mobile ? 0.72 : 0.92;
        ctx.save();
        ctx.globalAlpha = alpha * fade;
        rect(
          x - 10 * cabScale,
          y - 29 * cabScale,
          20 * cabScale,
          32 * cabScale,
          "#dbe4ce",
        );
        ctx.strokeStyle = "#718b71";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          x - 10 * cabScale,
          y - 29 * cabScale,
          20 * cabScale,
          32 * cabScale,
        );
        line(
          x - 10 * cabScale,
          y + 3 * cabScale,
          x + 10 * cabScale,
          y + 3 * cabScale,
          "#637c62",
          2,
        );
        ctx.restore();
      }
      figure(
        x,
        y,
        ["#a96847", "#467e72", "#8a8450", "#69778c"][i % 4],
        walking ? motion + i : 0,
        false,
        alpha * fade,
        mobile ? 0.72 : 0.92,
      );
      if (segment === 4 && adoption > 0.05) {
        ctx.save();
        ctx.globalAlpha = adoption * 0.4;
        const sweep = v.reduced ? 0.5 : (motion * 0.5 + i * 0.19) % 1;
        line(
          x - 8,
          y - 20 + sweep * 15,
          x + 8,
          y - 20 + sweep * 15,
          "#9aa775",
          1.5,
        );
        ctx.restore();
      }
    }
    if (p.closed) {
      ctx.fillStyle = "#6c6859";
      ctx.font = `${mobile ? 9 : 13}px Arial`;
      ctx.fillText("Closed", bx + bw / 2, ground + 7);
    }
    hits.unshift({
      kind: "provider",
      id: p.id,
      providerId: p.id,
      x: ox + bx * scale,
      y: oy + (by - 24) * scale,
      width: bw * scale,
      height: (bh + 48) * scale,
    });
  });
  tree(margin + bw + gap * 0.53, ground + 16, mobile ? 10 : 21);
  ctx.restore();
  return hits;
}
