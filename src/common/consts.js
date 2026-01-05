/**
 * Наименование ключа в i18n для заголовка ключа
 */
export const TITLE_KEY = "title";

/**
 * Иконка для окна по-умолчанию
 */
export const DEFAULT_APP_ICON = "img/unknown-app.svg";

/**
 * Путь до API
 */
export const API_PATH = (window.location.origin ?? "").includes("http://") ? "http://localhost:3000" : window.location.origin + "/api";

/**
 * Погрешность расстояния курсора от края окна для растягивания
 */
export const CORNER_APRX = 6;
