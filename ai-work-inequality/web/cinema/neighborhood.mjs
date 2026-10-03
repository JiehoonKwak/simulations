export function drawNeighborhood(ctx, v) {
  const w = v.width,
    h = v.height,
    hits = [],
    mobile = w < 600;
  ctx.save();
  ctx.fillStyle = "#f2f0e6";
  ctx.fillRect(0, 0, w, h);
  const cols = mobile ? 2 : 4,
    rows = 16 / cols,
    pitch = 128,
    W = cols * pitch,
    H = rows * pitch;
  const progress = v.reduced ? 0 : v.sceneProgress;
  const skew = mobile ? 0.065 : 0.43;
  const scale =
    Math.min((w - 34) / (W + H * skew + 34), (h - 36) / (H * 0.57 + 80)) *
    (1 + 0.024 * Math.sin(progress * Math.PI));
  const drift = v.reduced ? 0 : Math.sin(progress * Math.PI) * 3;
  const ox = (w - (W + H * skew) * scale) / 2 + drift,
    oy = (h - H * 0.57 * scale) / 2 + 23 * scale;
  const proj = (x, y, z = 0) => [
    ox + (x + y * skew) * scale,
    oy + (y * 0.57 - z) * scale,
  ];
  proj.scale = scale;
  const mix = (a, b, f) => a + (b - a) * f;
  function polygon(points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach((p, i) => {
      const q = proj(...p);
      i ? ctx.lineTo(...q) : ctx.moveTo(...q);
    });
    ctx.closePath();
    ctx.fill();
  }
  function ground(x, y, b, d, color, z = 0) {
    polygon(
      [
        [x, y, z],
        [x + b, y, z],
        [x + b, y + d, z],
        [x, y + d, z],
      ],
      color,
    );
  }
  function cube(x, y, b, d, z, front, side, roof) {
    polygon(
      [
        [x, y + d, 0],
        [x + b, y + d, 0],
        [x + b, y + d, z],
        [x, y + d, z],
      ],
      front,
    );
    polygon(
      [
        [x + b, y, 0],
        [x + b, y + d, 0],
        [x + b, y + d, z],
        [x + b, y, z],
      ],
      side,
    );
    ground(x, y, b, d, roof, z);
  }
  function tree(x, y, size = 9) {
    const p = proj(x, y, 0),
      q = proj(x, y, size * 1.7);
    ctx.strokeStyle = "#8d8f74";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(...p);
    ctx.lineTo(...q);
    ctx.stroke();
    ctx.fillStyle = "#9dad87";
    ctx.beginPath();
    ctx.ellipse(
      q[0],
      q[1],
      size * proj.scale,
      size * 1.12 * proj.scale,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = "#b1be98";
    ctx.beginPath();
    ctx.ellipse(
      q[0] - size * 0.24 * proj.scale,
      q[1] - size * 0.27 * proj.scale,
      size * 0.6 * proj.scale,
      size * 0.68 * proj.scale,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ground(-13, -13, W + 26, H + 26, "#e5e3d6");
  for (let r = 0; r <= rows; r++)
    ground(-13, r * pitch - 12, W + 26, 15, "#c5c9bf");
  for (let c = 0; c <= cols; c++)
    ground(c * pitch - 12, -13, 15, H + 26, "#c5c9bf");
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = c * pitch,
        y = r * pitch;
      ground(x + 6, y + 5, 103, 99, "#efede3");
      ground(x + 88, y + 18, 15, 55, "#c6ceaf");
      ground(x + 12, y + 93, 62, 5, "#d3ccbc");
      for (let k = 0; k < 4; k++)
        ground(x + 21 + k * 13, y - 10, 6, 10, "#efeee3");
    }
  const a = v.frame,
    b = v.next,
    f = v.mix;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c,
        pa = a.providers[i],
        pb = b.providers[i],
        people = a.physicians.filter((p) => p.providerId === pa.id),
        next = b.physicians.filter((p) => p.providerId === pa.id),
        large = people.length === 16,
        x = c * pitch + 15,
        y = r * pitch + 17,
        bw = large ? 65 : 55,
        depth = large ? 57 : 49,
        z = large ? 52 : 32,
        adoption = mix(pa.adoption, pb.adoption, f);
      const active = pa.id === v.selectedId || pa.id === v.hoverId;
      if (active)
        ground(
          x - 5,
          y - 5,
          bw + 10,
          depth + 10,
          pa.id === v.selectedId ? "#9aae91" : "#c1cbb0",
        );
      ground(x + 10, y + 9, bw + 10, depth + 12, "#d1d2c1");
      cube(
        x,
        y,
        bw,
        depth,
        z,
        pa.closed ? "#c0c2b6" : "#f9f7ed",
        pa.closed ? "#abae9f" : "#d7ccba",
        pa.closed ? "#b3b8a8" : "#e7dfce",
      );
      const corners = [
        [x, y, z],
        [x + bw, y, z],
        [x + bw, y + depth, 0],
        [x, y + depth, 0],
      ].map((p) => proj(...p));
      const xs = corners.map((p) => p[0]),
        ys = corners.map((p) => p[1]);
      hits.push({
        kind: "provider",
        id: pa.id,
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys),
      });
      if (active) {
        ctx.strokeStyle = pa.id === v.selectedId ? "#628674" : "#9aac8e";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        [
          [x, y, z + 0.5],
          [x + bw, y, z + 0.5],
          [x + bw, y + depth, z + 0.5],
          [x, y + depth, z + 0.5],
        ].forEach((p, i) =>
          i ? ctx.lineTo(...proj(...p)) : ctx.moveTo(...proj(...p)),
        );
        ctx.closePath();
        ctx.stroke();
      }
      people.forEach((p, j) => {
        const col = j % 4,
          row = Math.floor(j / 4),
          wx = x + 8 + (col * (bw - 16)) / 4,
          wz = z - 8 - row * 10,
          v = mix(+p.employed, +next[j].employed, f);
        polygon(
          [
            [wx, y + depth, wz],
            [wx + 7, y + depth, wz],
            [wx + 7, y + depth, wz - 6],
            [wx, y + depth, wz - 6],
          ],
          "#c6cfc6",
        );
        ctx.globalAlpha = v;
        polygon(
          [
            [wx, y + depth, wz],
            [wx + 7, y + depth, wz],
            [wx + 7, y + depth, wz - 6],
            [wx, y + depth, wz - 6],
          ],
          "#ca8059",
        );
        ctx.globalAlpha = 1;
      });
      polygon(
        [
          [x + bw * 0.43, y + depth, 0],
          [x + bw * 0.58, y + depth, 0],
          [x + bw * 0.58, y + depth, 9],
          [x + bw * 0.43, y + depth, 9],
        ],
        "#8eab9c",
      );
      ground(x + 9, y + 10, 22, 19, "#99aaa1", z + 0.5);
      ctx.globalAlpha = adoption;
      ground(x + 9, y + 10, 22, 19, "#61b99f", z + 1);
      ctx.globalAlpha = 1;
      for (let k = 0; k < 3; k++) {
        ctx.globalAlpha = 0.25 + 0.75 * adoption;
        ground(x + 12 + k * 6, y + 13, 3, 12, "#def8d7", z + 1.5);
        ctx.globalAlpha = 1;
      }
      ground(x + bw - 19, y + 12, 4, 14, "#b67760", z + 1);
      ground(x + bw - 24, y + 17, 14, 4, "#b67760", z + 1);
      tree(c * pitch + 96, r * pitch + 30, 9);
      tree(c * pitch + 96, r * pitch + 63, 7);
      tree(c * pitch + 21, r * pitch + 104, 6);
    }

  ctx.restore();
  return hits;
}
