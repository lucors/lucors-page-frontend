import {cmds} from "#apps/console/shared.jsx";
import {AppMeta} from "#common/apps.js";
import {getSingletonAppCreator} from "#common/utils.js";
import {lazy} from "react";
import i18next from "i18next";

const TYPE = "gallery";

export const META = new AppMeta(
  TYPE,
  lazy(() => import("./WindowGallery")),
  getSingletonAppCreator(TYPE),
  "img/gallery.png");

i18next.addResourceBundle("en", TYPE, {
  title: "Gallery",
  h1: "It's empty for now",
});
i18next.addResourceBundle("ru", TYPE, {
  title: "Галерея",
  h1: "Пока тут пусто",
});

cmds.set("gallery", () => {
  META.createApp();
  return "Открываю галерею";
});
