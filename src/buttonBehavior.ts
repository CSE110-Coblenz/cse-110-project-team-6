import Konva from "konva"; 

export function addCenterHoverScale(
  node: Konva.Image,
  baseScale: number,
  hoverScale: number,
  sound: HTMLAudioElement
) {
  const origX = node.x();
  const origY = node.y();

  node.on("mouseover", () => {
    document.body.style.cursor = "pointer";

    const w = node.width();
    const h = node.height();

    const dx = (w * hoverScale - w * baseScale) / 2;
    const dy = (h * hoverScale - h * baseScale) / 2;

    node.x(origX - dx);
    node.y(origY - dy);
    node.scale({ x: hoverScale, y: hoverScale });

    sound.currentTime = 0;
    sound.play();
  });

  node.on("mouseout", () => {
    document.body.style.cursor = "default";
    node.x(origX);
    node.y(origY);
    node.scale({ x: baseScale, y: baseScale });
  });
}