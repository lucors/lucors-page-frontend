import {cmds} from "#apps/console/shared.jsx";
import {AppMeta} from "#common/apps.js";
import {getSingletonAppCreator} from "#common/utils.js";
import {lazy} from "react";
import i18next from "i18next";

const TYPE = "settings";

export const META = new AppMeta(
  TYPE,
  lazy(() => import("./WindowSettings")),
  getSingletonAppCreator(TYPE),
  "img/settings.png");

i18next.addResourceBundle("en", TYPE, {
  title: "Settings",
  screen1: "Screen mode",
  screen2: "Fullscreen",
  screen3: "Tab",
  radius1: "Rounding radius",
  radius2: "Soft",
  radius3: "Sharp",
  lang1: "Language",
});
i18next.addResourceBundle("ru", TYPE, {
  title: "Настройки",
  screen1: "Режим экрана",
  screen2: "Полноэкранный",
  screen3: "Вкладка",
  radius1: "Радиус скругления",
  radius2: "Мягкий",
  radius3: "Острый",
  lang1: "Язык",
});

cmds.set("settings", () => {
  META.createApp();
  return "Открываю настройки";
});
