import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, memo, Suspense } from "react";
import $ from "jquery";
import {
  byId,
  deleteWindowById,
  isCurrent,
  setCurrentWindowById,
  updateWindow,
} from "#store/windowsSlice";
import "./Window.css";
import { cursor, flags } from "#/backgroundEvents";
import store from "#store/store";
import {DEFAULT_APP_ICON} from "#common/consts.js";

export function ContentLoadError({ message = "" }) {
  return (
    <>
      <div className="section error">
        <h1>{message === "" ? "?" : "Ошибка"}</h1>
        {message !== "" && <h2>{message}</h2>}
      </div>
    </>
  );
}

export default memo(function Window({
  data,
  title,
  titleHref,
  icon,
  menu,
  content,
  collapsible = true,
  closeable = true,
  expandable = true,
  className,
}) {
  const windowRef = useRef(null);
  const draggableRef = useRef(null);
  const menuRef = useRef(null);

  const collapsed = data?.collapsed;
  const expanded = data?.expanded;
  const dragging = data?.dragging;
  const id = data?.id;
  const x = data?.x;
  const y = data?.y;
  const width = data?.width;
  const height = data?.height;

  const dispatch = useDispatch();
  const current = useSelector((state) => isCurrent(state, id));
  const mobile = useSelector((state) => state.screen.mobile);

  function stored() {
    return byId(store.getState(), id);
  }

  function mouseDownHandler(event) {
    if (
      flags.resizeType > 0 ||
      store.getState().screen.mobile ||
      !windowRef?.current
    ) {
      return;
    }
    flags.dragging = true;
    $(windowRef.current).find(".frame-block").addClass("active");
    $(document.body).addClass("nonselect");
    dispatch(setCurrentWindowById(id));
    const updateEntity = {
      id,
      dragging: true,
      expanded: false,
      startX: $(windowRef.current).position().left,
      startY: $(windowRef.current).position().top,
    };
    if (stored()?.expanded) {
      updateEntity.startY = 0;
      updateEntity.startX = event.pageX - stored()?.width / 2;
      updateEntity.y = 0;
      updateEntity.x = event.pageX - stored()?.width / 2;
    }
    dispatch(updateWindow(updateEntity));
    cursor.togglePointer();
  }

  function close() {
    dispatch(deleteWindowById(id));
  }

  function collapseToggle() {
    dispatch(updateWindow({ id, collapsed: !collapsed }));
  }

  function expandToggle() {
    const updateEntity = { id, expanded: !expanded };
    if (!expanded) {
      updateEntity.startX = data.x;
      updateEntity.startY = data.y;
      updateEntity.x = 0;
      updateEntity.y = 0;
    } else {
      updateEntity.x = data.startX;
      updateEntity.y = data.startY;
    }
    dispatch(updateWindow(updateEntity));
  }

  function setCurrent() {
    dispatch(setCurrentWindowById(id));
  }

  function toggleMenu() {
    if (!menuRef?.current) return;
    $(menuRef.current).toggleClass("active");
  }

  useEffect(() => {
    if (!draggableRef?.current || !windowRef?.current) return;
    $(draggableRef.current).on("mousedown", mouseDownHandler);
    $(windowRef.current).on("mousedown", () => {
      if (flags.resizeType > 0 || !windowRef?.current) return;
      setCurrent();
      $(".window .frame-block").addClass("alt");
      $(windowRef.current).find(".frame-block").removeClass("alt");
    });
    windowRef.current.ontransitionend = () => {
      if (stored()?.collapsed) windowRef.current.style.visibility = "hidden";
    };

    if (!stored()?.expanded) {
      const width = $(windowRef.current).width();
      const height = $(windowRef.current).height();
      dispatch(updateWindow({ id, width, height }));
    }

    return () => {
      if (!draggableRef?.current || !windowRef?.current) return;
      windowRef.current.ontransitionend = undefined;
      $(draggableRef.current).off("mousedown");
      $(windowRef.current).off("mousedown");
    };
  }, []);

  useEffect(() => {
    if (mobile && !stored()?.expanded) expandToggle();
  }, [mobile]);

  useEffect(() => {
    if (!collapsed) windowRef.current.style.visibility = "visible";
  }, [collapsed]);

  const cssClass = [
    className,
    "window",
    current ? "current" : "",
    collapsed ? "collapsed" : "",
    expanded ? "expanded" : "",
    dragging ? "dragging" : "",
  ]
    .filter((v) => !!v)
    .join(" ");

  return (
    <div
      data-id={data.id}
      className={cssClass}
      style={{
        top: y,
        left: x,
        width,
        height,
      }}
      ref={windowRef}
    >
      <div className="body">
        <div className="header">
          <div className="title">
            <img className="icon" src={icon || data.icon || DEFAULT_APP_ICON} />
            {titleHref && (
              <a className="value draggable" target="_blank" href={titleHref}>
                {title || data.title}
              </a>
            )}
            {!titleHref && (
              <span className="value draggable">{title || data.title}</span>
            )}
          </div>
          <div className="wdz draggable" ref={draggableRef}></div>
          <div className="control">
            {collapsible && (
              <div className="wca collapse" onClick={collapseToggle}>
                <span>━</span>
              </div>
            )}
            {expandable && !mobile && (
              <div className="wca expand" onClick={expandToggle}>
                {expanded ? "❐" : "☐"}
              </div>
            )}
            {closeable && (
              <div className="wca close" onClick={close}>
                <span>✕</span>
              </div>
            )}
          </div>
        </div>
        <div className="main">
          {menu && mobile && (
            <img
              className="menu-button"
              src="img/menu.svg"
              onClick={toggleMenu}
            />
          )}
          {menu && (
            <div className="left" ref={menuRef}>
              {menu}
            </div>
          )}

          <div className="right">
            {!content && <ContentLoadError />}
            {content && (
              <Suspense
                fallback={
                  <img className="window-loader" src="img/loading.gif" />
                }
              >
                {content}
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
