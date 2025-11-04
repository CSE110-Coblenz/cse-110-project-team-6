export const Assets: Record<string, HTMLImageElement> = {};

export async function loadAssets(paths: string[]): Promise<void> {
  const loaders = paths.map(path => new Promise<void>((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      Assets[path] = img;
      resolve();
    };
  }));
  await Promise.all(loaders);
}