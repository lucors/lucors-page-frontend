import {setShutdown} from "#store/screenSlice.js";
import store from "#store/store.js";
import "./ShutdownButton.css";
import {useTranslation} from "react-i18next";

export default function ShutdownButton({onClick}) {
  const {t} = useTranslation();

  function shutdown() {
    store.dispatch(setShutdown(true));
  }

  return (
    <div id="shutdownButton" title={t("shutdown")} onClick={() => {
      shutdown();
      onClick();
    }}>
      <div className="ico"></div>
    </div>
  );
}
