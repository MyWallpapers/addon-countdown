import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
export function timer(
  context: CanvasAddonMountContext,
  refresh: () => void,
  period = 1000,
) {
  let handle: ReturnType<typeof setInterval> | undefined;
  const changed = () => {
    clearInterval(handle);
    handle = undefined;
    refresh();
    if (!document.hidden && context.runtime.mode !== "thumbnail")
      handle = setInterval(refresh, period);
  };
  document.addEventListener("visibilitychange", changed);
  changed();
  return () => {
    clearInterval(handle);
    document.removeEventListener("visibilitychange", changed);
  };
}
