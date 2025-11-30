import {memo} from "react";
import Window from "#windows/Window";
import {META} from "./shared";
import "./WindowSettings.css";
import {ChangeLanguageButton} from "#layout/footer/FooterRight.jsx";
import {useTranslation} from "react-i18next";
import {TITLE_KEY} from "#common/consts.js";
import {FlatRadiusButton} from "#apps/settings/FlatRadiusButton.jsx";
import {FullscreenButton} from "#apps/settings/FullscreenButton.jsx";

function Content() {
  const {t} = useTranslation(META.type);

  return (
    <div className="section">
      <div className="setting-row-wrapper">
        <label>{t("screen1")}</label>
        <div className="setting-row">
          <FullscreenButton/>
        </div>
      </div>
      <div className="setting-row-wrapper">
        <label>{t("radius1")}</label>
        <div className="setting-row">
          <FlatRadiusButton/>
        </div>
      </div>
      <div className="setting-row-wrapper">
        <label>{t("lang1")}</label>
        <div className="setting-row">
          <ChangeLanguageButton primary/>
        </div>
      </div>
    </div>
  );
}

export default memo(function WindowSettings({data}) {
  const {t} = useTranslation(META.type);
  return <Window data={data} title={t(TITLE_KEY)} icon={META.icon} content={<Content/>}/>;
});
