import qrcode from "qrcode-generator";

/** QR code as a boolean grid, so it can be drawn as SVG on the page and in the PDF. */
export function qrMatrix(text: string) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const size = qr.getModuleCount();
  return { size, dark: (row: number, col: number) => qr.isDark(row, col) };
}

/** One SVG path for every dark module (1 unit each), with a 4-module quiet zone. */
export function qrPath(text: string) {
  const { size, dark } = qrMatrix(text);
  let d = "";
  for (let row = 0; row < size; row++) for (let col = 0; col < size; col++) if (dark(row, col)) d += `M${col + 4} ${row + 4}h1v1h-1z`;
  return { d, viewBox: size + 8 };
}
