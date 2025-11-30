import {META} from "#apps/settings/shared.jsx";
import "./SettingsButton.css";
import {useTranslation} from "react-i18next";

export default function SettingsButton({onClick}) {
  const {t} = useTranslation();

  return (
    <div id="settings-button" title={t("open_settings")} onClick={() => {
      META.createApp();
      onClick();
    }}>
      <div className="ico"></div>
    </div>
  );
}
