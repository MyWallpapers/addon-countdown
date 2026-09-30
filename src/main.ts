import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import { card, el } from "./ui";
import { timer } from "./timing";
import "./style.css";
export function mount(context: CanvasAddonMountContext) {
  const view = card(context, "Compte à rebours"),
    number = el("div", "", "number"),
    units = el("div", "", "unit");
  view.body.append(number, units);
  let values = context.layer.settings.get();
  const render = () => {
    view.header.textContent = String(values.title || "Compte à rebours");
    const target = Date.parse(String(values.target ?? ""));
    if (!Number.isFinite(target)) {
      number.textContent = "—";
      units.textContent = "Date invalide";
      view.caption.textContent =
        "Utilisez une date ISO avec fuseau, par exemple 2027-01-01T00:00:00+01:00";
      return;
    }
    const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000)),
      days = Math.floor(remaining / 86400),
      hours = Math.floor((remaining % 86400) / 3600),
      minutes = Math.floor((remaining % 3600) / 60),
      seconds = remaining % 60;
    number.textContent = days
      ? String(days)
      : [hours, minutes, seconds]
          .map((v) => String(v).padStart(2, "0"))
          .join(":");
    units.textContent = days
      ? "jours · " + hours + " h " + minutes + " min"
      : remaining
        ? "heures · minutes · secondes"
        : "Date atteinte";
    view.caption.textContent = new Date(target).toLocaleString("fr-FR");
  };
  const stop = context.layer.settings.subscribe((next) => {
      values = next;
      render();
    }),
    stopTimer = timer(context, render);
  return () => {
    stop();
    stopTimer();
    view.section.remove();
  };
}
