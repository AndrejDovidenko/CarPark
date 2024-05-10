export function generateSvg(svg) {
  return new DOMParser().parseFromString(svg, "image/svg+xml");
}
