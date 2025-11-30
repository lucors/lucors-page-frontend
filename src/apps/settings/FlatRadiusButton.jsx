import {useDispatch, useSelector} from "react-redux";
import {setRadius} from "#store/settingsSlice.js";
import Button from "#common/Button.jsx";
import {useTranslation} from "react-i18next";
import {META} from "./shared.jsx";

export function FlatRadiusButton() {
  const {t} = useTranslation(META.type);
  const radius = useSelector((state) => state.settings.radius);
  const dispatch = useDispatch();

  function onRadiusChange() {
    dispatch(setRadius((radius > 0) ? 0 : 0.2));
  }

  return (
    <Button className="primary" onClick={onRadiusChange}>
      {(radius > 0) ? t("radius2") : t("radius3")}
    </Button>
  );
}
