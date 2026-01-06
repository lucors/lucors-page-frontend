import $ from "jquery";
import {useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import store from "#store/store";
import "./Menu.css";
import ShutdownButton from "./ShutdownButton";
import SettingsButton from "./SettingsButton";
import {setMenu} from "#store/menuSlice.js";
import FrameButton from "#apps/frame/FrameButton.jsx";
import {useTranslation} from "react-i18next";
import Button from "#common/Button.jsx";
import i18next from "i18next";
import {META as appMetaWelcome} from "#apps/welcome/shared.jsx";
import {META as appMetaContacts} from "#apps/contacts/shared.jsx";
import {META as appMetaAppsList} from "#apps/apps-list/shared.jsx";
import {META as appMetaProjects} from "#apps/projects/shared.jsx";
import {META as appMetaAbout} from "#apps/about/shared.jsx";
import {META as appMetaTesting} from "#apps/testing/shared.jsx";
import ProfileButton from "#layout/footer/Menu/ProfileButton.jsx";

export const MENU_I18_KEY = "_menu";

i18next.addResourceBundle("en", MENU_I18_KEY, {
  menuSectionTitle: "Common",
  menu1: "Intro",
  menu2: "About me",
  menu3: "Projects",
  menu8: "About page",
  menu9: "Apps",
  menu10: "About tests",
});
i18next.addResourceBundle("ru", MENU_I18_KEY, {
  menuSectionTitle: "Общее",
  menu1: "Вступление",
  menu2: "Обо мне",
  menu3: "Проекты",
  menu8: "О сайте",
  menu9: "Приложения",
  menu10: "О тестах",
});

export const contentMenu = [
  {
    id: 1,
    title: "menu1",
    action: appMetaWelcome.createApp,
  },
  {
    id: 3,
    title: "menu9",
    action: appMetaAppsList.createApp,
  },
  {
    id: 4,
    title: "menu3",
    action: appMetaProjects.createApp,
  },
  {
    id: 2,
    title: "menu2",
    action: appMetaContacts.createApp,
  },
  {
    id: 10,
    title: "menu10",
    action: appMetaTesting.createApp,
  },
  {
    id: 8,
    title: "menu8",
    action: appMetaAbout.createApp,
  },
];

function MenuSection({icon, title, children, renderTitle = true}) {
  return (
    <div className="menu-section">
      {renderTitle && (
        <div className="section-title">
          <img src={icon}/>
          <span>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function MenuSectionManager({hideMenu}) {
  const {t} = useTranslation(MENU_I18_KEY);

  return (
    <MenuSection renderTitle={false}>
      {contentMenu
        .filter((v) => !v.hide)
        .map((v) => {
          const title = t(v.title);
          if (v.action) {
            return (
              <Button
                key={v.id}
                title={title}
                onClick={() => {
                  v.action();
                  hideMenu();
                }}
              >
                {title}
              </Button>
            );
          }
          return (
            <FrameButton
              key={v.id}
              title={title}
              href={v.href}
              icon={v.icon}
              onClick={hideMenu}
            >
              {title}
            </FrameButton>
          );
        })}
    </MenuSection>
  );
}

export default function Menu() {
  const openned = useSelector((state) => state.menu.openned);
  const menuBoxRef = useRef(null);

  const hideToLeft = () => {
    menuBoxRef.current.style.left = `-${$(menuBoxRef.current).outerWidth(
      true
    )}px`;
    menuBoxRef.current.style.opacity = 0;
  };

  useEffect(() => {
    if (!menuBoxRef?.current) return;
    const observer = new ResizeObserver(() => {
      if (store.getState().menu.openned) hideMenu();
    });
    observer.observe(menuBoxRef.current);

    return () => {
      if (menuBoxRef?.current) menuBoxRef.current.ontransitionend = undefined;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuBoxRef?.current) return;
    if (openned) {
      // menuBoxRef.current.style.left = `${$("#footer-body").offset().left}px`;
      menuBoxRef.current.style.left = `${$("#startButt").position().left}px`;
      menuBoxRef.current.style.opacity = 1;
      return;
    }
    hideToLeft();
  }, [openned]);

  const hideMenu = () => {
    if (store.getState().menu.openned) store.dispatch(setMenu(false));
  };

  return (
    <div id="menuBox" ref={menuBoxRef}>
      <div className="menuLeft">
        {/*<div id="logoPlace">*/}
        {/*  <img className="logoType" src="img/lucors-heart-crop-alpha.png"/>*/}
        {/*</div>*/}
        <div className="actions">
          <ProfileButton onClick={hideMenu}/>
          <SettingsButton onClick={hideMenu}/>
          <ShutdownButton onClick={hideMenu}/>
        </div>
      </div>
      <div id="menuContent">
        <MenuSectionManager hideMenu={hideMenu}/>
      </div>
    </div>
  );
}
