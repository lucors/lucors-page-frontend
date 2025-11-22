import {useSelector} from "react-redux";
import Window from "./Window";
import {Suspense, useEffect} from "react";
import {appsMetas} from "#common/apps.js";
import WindowLoading from "#windows/WindowLoading.jsx";

let loaded = false;
let counter = 0;
const modules = import.meta.glob('../apps/*/shared.jsx');
for (const [path, loader] of Object.entries(modules)) {
  loader().then(() => {
    counter++;
    console.log(`Imported ${path}`);
    loaded = (Object.entries(modules).length === counter)
  });
}

export default function WindowsList() {
  const windowsList = useSelector((state) => state.windows.list) ?? [];

  useEffect(() => {}, [loaded]);

  if (!loaded) return;
  return (
    <div id="windows">
      {windowsList.map((v) => {
        const META = appsMetas.get(v.type);
        const WindowComponent = META?.component ?? Window;

        const props = {
          key: v.id,
          data: v,
          META: (META?.isRemote() ? META : null),
          Window: (META?.isRemote() ? Window : null),
        }

        return (
          <Suspense key={v.id} fallback={<WindowLoading/>}>
            <WindowComponent {...props} />
          </Suspense>
        );
      })}
    </div>
  );
}
