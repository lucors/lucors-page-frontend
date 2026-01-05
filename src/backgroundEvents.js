import $ from "jquery";
import store from "./store/store";
import { setFullscreen, setMobile } from "./store/screenSlice";
import { updateWindow } from "./store/windowsSlice";
import {CORNER_APRX} from "#common/consts.js";

export const cursor = {
  startX: 0,
  startY: 0,
  x: -1,
  y: -1,
  dX: function () {
    return this.x - this.startX;
  },
  dY: function () {
    return this.y - this.startY;
  },
  togglePointer: function () {
    if (flags.dragging) {
      $("body").css({
        cursor: "grab",
      });
    } else {
      $("body").css({
        cursor: "",
      });
    }
  },
};

export const flags = {
  dragging: false,
  resizeType: 0,
  resize: false,
  selection: false,
  setCurrentBlock: false,
};

window.checkFullscreen = () => {
  let fs = !(
    (document.fullScreenElement !== undefined &&
      document.fullScreenElement === null) ||
    (document.msFullscreenElement !== undefined &&
      document.msFullscreenElement === null) ||
    (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
    (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
  );
  let fs2 =
    window.innerWidth == screen.width && window.innerHeight == screen.height;
  fs = fs || fs2;
  return fs;
};

function checkScreenSize() {
  if (window.desktopCanvas) {
    desktopCanvas.width = document.body.offsetWidth;
    desktopCanvas.height = document.body.offsetHeight;
  }
  const mobile = $(document.body).outerWidth() <= 768;
  store.dispatch(setMobile(mobile));
  mobile
    ? $(document.body).addClass("mobile")
    : $(document.body).removeClass("mobile");
}

function mouseMoveHandler(event) {
  const mobile = store.getState()?.screen?.mobile;
  cursor.x = event.pageX;
  cursor.y = event.pageY;
  const storedCurrentWindow = store.getState()?.windows?.current;

  if (flags.selection) {
    desktopCtx.clear();
    desktopCtx.drawSelection();
    return;
  }

  if (flags.dragging && flags.resizeType == 0) {
    desktopCtx.clear();
    if (!storedCurrentWindow) return;
    const currentWindow = $(`.window[data-id='${storedCurrentWindow.id}']`);
    const header = $("header");
    const footer = $("footer");
    // store.dispatch(updateWindow({
    //   id :currentWindow.id,
    //   x: store.getState().windows.current.startX + cursor.dX(),
    //   y: store.getState().windows.current.startY + cursor.dY(),
    // }));

    const move = (x, y) => {
      currentWindow.css({
        left: x,
        top: y,
      });
    };
    const draggable = currentWindow.find(".draggable");

    if (
      cursor.y > draggable.outerHeight() + header.outerHeight() &&
      cursor.y + currentWindow.outerHeight() + footer.outerHeight() <
        body.outerHeight()
    ) {
      move(
        store.getState().windows.current.startX + cursor.dX(),
        store.getState().windows.current.startY + cursor.dY()
      );
    } else {
      if (cursor.y <= draggable.outerHeight() + header.outerHeight()) {
        move(
          store.getState().windows.current.startX + cursor.dX(),
          header.outerHeight()
        );
      } else {
        move(
          store.getState().windows.current.startX + cursor.dX(),
          body.outerHeight() -
            currentWindow.outerHeight() -
            footer.outerHeight()
        );
      }
    }
    return;
  }

  if (!mobile && storedCurrentWindow && !storedCurrentWindow.expanded) {
    const win = $(`.window[data-id='${storedCurrentWindow.id}']`);
    const box = win?.[0]?.getBoundingClientRect();
    if (flags.resize) {
      const style = win[0].currentStyle || window.getComputedStyle(win[0]);
      let border = 0;
      let oldVal = 0;
      switch (flags.resizeType) {
        case 1:
          if (cursor.x < 0) return;
          border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
          const width = Math.round(box.right - cursor.x) - border;
          oldVal = win.width();
          win.width(width);
          if (width === win.width()) {
            win.css({
              left: cursor.x + "px",
            });
          }
          else {
            win.width(oldVal);
          }
          break;
        case 2:
          if (cursor.x > $("main").width()) return;
          win.width(cursor.x - box.x);
          break;
        case 3:
          if (cursor.y < 0) return;
          border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
          const height = Math.round(box.bottom - cursor.y) - border;
          oldVal = win.height();
          win.height(height);
          if (height === win.height()) {
            win.css({
              top: cursor.y + "px",
            });
          }
          else {
            win.height(oldVal);
          }
          break;
        case 4:
          if (cursor.y > $("footer").offset().top) return;
          win.height(cursor.y - box.y);
          break;
      }
    } else if (!mobile) {

      if (event.target.tagName === 'IFRAME') {
        mouseOutHandler();
        win.removeClass("resize-left resize-right resize-top resize-bottom");
        return;
      }

      if (flags.resizeType > 0) {
        mouseOutHandler();
        win.removeClass("resize-left resize-right resize-top resize-bottom");
        flags.resizeType = 0;
      }

      if (
        cursor.x > box.left - CORNER_APRX &&
        cursor.x < box.left + CORNER_APRX &&
        cursor.y > box.top - CORNER_APRX &&
        cursor.y < box.bottom + CORNER_APRX
      ) {
        $("main").addClass("resize-x");
        win.addClass("resize-left");
        flags.resizeType = 1;
        return;
      } else if (
        cursor.x > box.right - CORNER_APRX &&
        cursor.x < box.right + CORNER_APRX &&
        cursor.y > box.top - CORNER_APRX &&
        cursor.y < box.bottom + CORNER_APRX
      ) {
        $("main").addClass("resize-x");
        win.addClass("resize-right");
        flags.resizeType = 2;
        return;
      } else if (
        cursor.y > box.top - CORNER_APRX &&
        cursor.y < box.top + CORNER_APRX &&
        cursor.x > box.left - CORNER_APRX &&
        cursor.x < box.right + CORNER_APRX
      ) {
        $("main").addClass("resize-y");
        win.addClass("resize-top");
        flags.resizeType = 3;
        return;
      } else if (
        cursor.y > box.bottom - CORNER_APRX &&
        cursor.y < box.bottom + CORNER_APRX &&
        cursor.x > box.left - CORNER_APRX &&
        cursor.x < box.right + CORNER_APRX
      ) {
        $("main").addClass("resize-y");
        win.addClass("resize-bottom");
        flags.resizeType = 4;
        return;
      }
    }
  }
}

function mouseUpHandler(event) {
  $(document.body).removeClass("nonselect");
  $(".window.current .frame-block").removeClass("active");
  let prevent = false;

  if (flags.selection) {
    flags.selection = false;
    desktopCtx.clear();
    prevent = true;
  }

  const storedCurrentWindow = store.getState()?.windows?.current;
  if (flags.resizeType > 0 || flags.resize) {
    prevent = true;
    flags.resizeType = 0;
    flags.resize = false;
    $("main").removeClass("resize-x resize-y");
    const win = $(".window.current");
    win.removeClass("resize-left resize-right resize-top resize-bottom");
    store.dispatch(
      updateWindow({
        id: storedCurrentWindow.id,
        width: win.width(),
        height: win.height(),
      })
    );
  }

  if (flags.dragging) {
    const win = $(".window.current");
    prevent = true;
    flags.dragging = false;
    cursor.togglePointer();
    if (!storedCurrentWindow) return;
    store.dispatch(
      updateWindow({
        id: storedCurrentWindow.id,
        dragging: false,
        x: win.offset().left,
        y: win.offset().top,
        // x: store.getState().windows.current.startX + cursor.dX(),
        // y: store.getState().windows.current.startY + cursor.dY(),
      })
    );
  }

  if (prevent) {
    flags.setCurrentBlock = true;
    event.preventDefault();
  }
  return !prevent;
}

function mouseDownHandler(event) {
  const mobile = store.getState()?.screen?.mobile;
  flags.setCurrentBlock = false;
  if (mobile || flags.selection) {
    return;
  }
  cursor.startX = event.pageX;
  cursor.startY = event.pageY;
  const storedCurrentWindow = store.getState()?.windows?.current;

  if (
    flags.resizeType > 0 &&
    storedCurrentWindow &&
    !storedCurrentWindow.expanded
  ) {
    $(document.body).addClass("nonselect");
    $(`.window.current`).find(".frame-block").addClass("active");
    flags.resize = true;
    event.preventDefault();
    return false;
  }

  if (event.target === desktopCanvas) {
    flags.selection = true;
    $(document.body).addClass("nonselect");
  }
}

function mouseOutHandler() {
  $("main").removeClass("resize-x resize-y");
}

function resizeHandler() {
  bodyRect = document.body.getBoundingClientRect();
  if (window.desktopCtx) desktopCtx.clear();
  checkScreenSize();
  const fs = checkFullscreen();
  store.dispatch(setFullscreen(fs));
}

export const prepareWindow = () => {
  window.body = $(document.body);
  window.bodyRect = document.body.getBoundingClientRect();
};

export default () => {
  $(document).on("mousemove", mouseMoveHandler);
  $(document).on("mouseup", mouseUpHandler);
  $(document).on("mousedown", mouseDownHandler);
  $(document).on("mouseout", mouseOutHandler);
  $(window).on("resize", resizeHandler);
  resizeHandler();
};
