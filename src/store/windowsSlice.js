import { saveLocation } from "#common/utils.js";
import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

export const windowsSlice = createSlice({
  name: "windows",
  initialState: {
    ready: false,
    list: [],
    current: null,
  },
  reducers: {
    addWindow(state, { payload }) {
      const windowInstance = {
        title: "Окно",
        icon: "img/manager.svg",
        type: null,
        collapsed: false,
        dragging: false,
        expanded: false,
        x: 20,
        y: 20,
        startX: 0,
        startY: 0,
        // Значения по-умолчанию
        width: null,
        height: null,
        ...payload,
        id: v4(),
      };
      state.list = [...state.list, windowInstance];
      state.current = windowInstance;
      saveCurrentWindowToURI(state);
    },
    deleteWindowById(state, { payload }) {
      state.list = [...state.list.filter((v) => v.id != payload)];
      if (state.current?.id == payload) {
        state.current = null;
        saveLocation();
      }
    },
    deleteAllWindows(state, { payload }) {
      state.list = [];
      state.current = null;
      saveLocation();
    },
    updateWindow(state, { payload }) {
      state.list = [
        ...state.list.map((v) => {
          if (v.id != payload.id) return v;
          const newEntity = { ...v, ...payload };
          if (state.current?.id === payload.id) {
            state.current = newEntity;
          }
          return newEntity;
        }),
      ];
      saveCurrentWindowToURI(state);
    },
    setCurrentWindowById: (state, { payload }) => {
      if (state.current?.id === payload) return;
      state.current = state.list.find((v) => v.id === payload);
      saveCurrentWindowToURI(state);
    },
    setReady: (state, { payload }) => {
      state.ready = payload;
    },
  },
});

function saveCurrentWindowToURI(state) {
  /**
   * Пояснения для сокращений
   * i  = icon
   * tp = type
   * tt = title
   * m  = meta (query/href)
   */

  if (!state.current?.type) {
    return;
  }

  // Особенные условия для менеджера
  if (state.current?.type === "frame") {
    saveLocation({
      i: state.current?.icon,
      tt: state.current?.title,
      tp: state.current?.type,
      m: state.current?.query || state.current?.href || 0
    });
    return;
  }

  saveLocation({
    tp: state.current?.type
  });
}

export const byId = (state, id) => {
  return state.windows.list.find((v) => v.id === id);
};

export const byType = (state, type) => {
  return state.windows.list.findLast((v) => v.type === type);
};

export const isCurrent = (state, id) => {
  return state.windows.current?.id === id;
};

export const {
  addWindow,
  deleteWindowById,
  deleteAllWindows,
  updateWindow,
  setCurrentWindowById,
  setReady
} = windowsSlice.actions;

export default windowsSlice.reducer;
