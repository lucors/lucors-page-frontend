import { useEffect, useRef } from "react";
import $ from "jquery";
import WindowsList from "#windows/WindowsList";
import store from "#store/store";
import { setMenu } from "#store/menuSlice";
import "./Main.css";
import DesktopCanvas from "./DesktopCanvas";
import Clock from "#common/Clock.jsx";
import { useSelector } from "react-redux";

function Stars({ mobile }) {

  useEffect(() => {
    const starsContainer = document.getElementById('starsContainer');
    const starCount = mobile ? 50 : 150;

    for (let i = 0; i < starCount; i++) {
      createStar();
    }

    function createStar() {
      const star = document.createElement('div');
      star.classList.add('star');

      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      star.classList.add(size);

      const colors = ['white', 'blue', 'yellow'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      star.classList.add(color);

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      const duration = 2 + Math.random() * 3;
      star.style.animationDuration = `${duration}s`;

      star.style.animationDelay = `${Math.random() * 5}s`;

      starsContainer.appendChild(star);
    }
  },[])

  return (
    <div className="stars-container" id="starsContainer"></div>
  );
}

export default function Main() {
  const mainRef = useRef(null);
  const mobile = useSelector((state) => state.screen.mobile);

  useEffect(() => {
    if (!mainRef?.current) return;
    $(mainRef.current).on("click", function () {
      if (store.getState().menu.openned) store.dispatch(setMenu(false));
    });

    return () => {
      $(mainRef.current).off("click");
    };
  }, []);

  return (
    <main ref={mainRef}>
      <Stars mobile={mobile} />
      <DesktopCanvas />
      <WindowsList />
      {mobile && <Clock />}
    </main>
  );
}
