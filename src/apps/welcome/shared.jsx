import {cmds} from "#apps/console/shared.jsx";
import {getSingletonAppCreator} from "#common/utils.js";
import {lazy} from "react";
import i18next from "i18next";
import {AppMeta} from "#common/apps.js";

const TYPE = "welcome";

export const META = new AppMeta(
  TYPE,
  lazy(() => import("./WindowWelcome")),
  getSingletonAppCreator(TYPE, null, null,
    {
      width: "50em",
      height: "20em",
    }),
  "img/index.png");

i18next.addResourceBundle("en", TYPE, {
  title: "Intro",
  w1: "Welcome!",
  w2: "Welcome to my website.",
  w3: "You have chose, or choose for you, this is the 'finest' remaining website. I thought so much of this site that I elected to post my contact information here, in the section",
  contacts: "\"about me\"",
  contactsTitle: "Contacts",
  w5: ", so thoughtfully provided by our developers.",
  w6: "I have been proud to call this website my home.",
  w7: "And so, whether you are here to stay, or passing through on your way to parts unknown, welcome to my website.",
  w8: "It's safer here.",
});
i18next.addResourceBundle("ru", TYPE, {
  title: "Вступление",
  w1: "Добро пожаловать!",
  w2: "Добро пожаловать на мой сайт.",
  w3: "Сами вы его выбрали, или его выбрали за вас — это 'лучший' сайт из оставшихся. Я такого высокого мнения об этом сайте, что решил разместить свои контактные данные здесь, в разделе",
  contacts: "\"обо мне\"",
  contactsTitle: "Контакты",
  w5: ", столь заботливо предоставленным нашим разработчиком.",
  w6: "Я горжусь тем, что называю этот сайт своим домом.",
  w7: "Итак, собираетесь ли вы остаться здесь, или же вас ждут неизвестные дали, добро пожаловать на этот сайт.",
  w8: "Здесь безопасно.",
});

cmds.set("about", () => {
  META.createApp();
  return "Открываю \"О сайте\"";
});
