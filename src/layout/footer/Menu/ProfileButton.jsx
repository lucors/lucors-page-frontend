import {META} from "#apps/profile/shared.jsx";
import "./ProfileButton.css";
import {useTranslation} from "react-i18next";

export default function ProfileButton({onClick}) {
  const {t} = useTranslation();

  return (
    <div id="profile-button" title={t("open_profile")} onClick={() => {
      META.createApp();
      onClick();
    }}>
      <div className="ico"></div>
    </div>
  );
}
