// Lays out each .screen: data-src (image), data-crop="x,y,w,h" in capture CSS pixels.
// Children: .box data-rect="x,y,w,h" and .mark data-at="x,y" in the same coordinates.
for (const el of document.querySelectorAll(".screen")) {
  const [x, y, w, h] = el.dataset.crop.split(",").map(Number);
  const s = el.clientWidth / w;
  el.style.height = `${h * s}px`;
  const img = document.createElement("img");
  img.src = el.dataset.src;
  Object.assign(img.style, { width: `${(Number(el.dataset.width) || 1280) * s}px`, left: `${-x * s}px`, top: `${-y * s}px` });
  el.prepend(img);
  for (const box of el.querySelectorAll(".box")) {
    const [bx, by, bw, bh] = box.dataset.rect.split(",").map(Number);
    Object.assign(box.style, { left: `${(bx - x) * s - 5}px`, top: `${(by - y) * s - 5}px`, width: `${bw * s + 10}px`, height: `${bh * s + 10}px` });
  }
  for (const mark of el.querySelectorAll(".mark")) {
    const [mx, my] = mark.dataset.at.split(",").map(Number);
    Object.assign(mark.style, { left: `${(mx - x) * s}px`, top: `${(my - y) * s}px` });
  }
}
