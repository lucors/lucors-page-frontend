import {memo} from "react";
import Window from "#windows/Window";
import {META} from "./shared";
import "./WindowGallery.css";
import {useTranslation} from "react-i18next";
import {TITLE_KEY} from "#common/consts.js";
import {useSelector} from "react-redux";
import Button from "#common/Button.jsx";
import {Plus} from 'lucide-react';

function addMedia() {
  return;
}

function Content() {
  const {t} = useTranslation(META.type);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="section gallery">
      {!!(user?.is_admin) &&
        <div className="toolbar">
          <Button icon={<Plus/>} onClick={addMedia}>Добавить вложение</Button>
        </div>
      }
      <div className="photo-gallery">
        <h2>{t("h1")}</h2>
      </div>
    </div>
  );
}

export default memo(function WindowGallery({data}) {
  const {t} = useTranslation(META.type);
  return <Window data={data} title={t(TITLE_KEY)} icon={META.icon} content={<Content/>}/>;
});
