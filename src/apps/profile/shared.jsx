import {cmds} from "#apps/console/shared.jsx";
import {AppMeta} from "#common/apps.js";
import {getSingletonAppCreator, parseJwt} from "#common/utils.js";
import {lazy} from "react";
import i18next from "i18next";
import localforage from "localforage";
import store from "#store/store.js";
import {clearUser, setUser} from "#store/authSlice.js";

const TYPE = "profile";

export const META = new AppMeta(
  TYPE,
  lazy(() => import("./WindowProfile")),
  getSingletonAppCreator(TYPE),
  "img/contacts.png");

i18next.addResourceBundle("en", TYPE, {
  title: "Profile",
  login_alert: "You must log in to access your profile.",
  login_placeholder: "Login",
  pass_placeholder: "Password",
  login_button: "Log in",
  logout_button: "Log out",
  login_error_request: "Authorization error.",
  login_error_token: "Error via token detection.",
  check_button: "Check",
});
i18next.addResourceBundle("ru", TYPE, {
  title: "Профиль",
  login_alert: "Для доступа к профилю необходимо авторизоваться.",
  login_placeholder: "Логин",
  pass_placeholder: "Пароль",
  login_button: "Войти",
  logout_button: "Выйти",
  login_error_request: "Ошибка авторизации.",
  login_error_token: "Ошибка при выявлении токена.",
  check_button: "Проверка",
});

cmds.set("profile", () => {
  META.createApp();
  return "Открываю профиль";
});

export async function setToken(token) {
  await localforage.setItem("token", token);
  store.dispatch(setUser(parseJwt(token)));
}

export async function getToken() {
  return localforage.getItem("token");
}

export async function clearToken() {
  await localforage.removeItem("token");
  store.dispatch(clearUser());
}
