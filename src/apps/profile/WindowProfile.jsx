import {memo, useRef, useState} from "react";
import Window from "#windows/Window";
import {clearToken, getToken, META, setToken} from "./shared";
import "./WindowProfile.css";
import {useTranslation} from "react-i18next";
import {API_PATH, TITLE_KEY} from "#common/consts.js";
import {useSelector} from "react-redux";
import Button from "#common/Button.jsx";
import axios from "axios";


function LoginForm() {
  const {t} = useTranslation(META.type);
  const [error, setError] = useState("");
  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  const doLogin = (e) => {
    setError("");
    e.preventDefault();
    if (!loginRef?.current?.value || !passwordRef?.current?.value) return;

    axios
      .post(`${API_PATH}/login`, {
        login: loginRef.current.value,
        password: passwordRef.current.value,
      })
      .then(async (response) => {
        try {
          const {data} = response;
          const token = data.token;
          if (!token) {
            throw new Error("Токен не найден в ответе на авторизацию");
          }
          await setToken(token);
        } catch (error) {
          console.error(error);
          setError("login_error_token");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("login_error_request");
      });
  };

  return (
    <>
      <div className="section login-form">
        <h2>{t("login_alert")}</h2>
        <form className="login-form">
          <input
            name="login"
            ref={loginRef}
            className="login"
            type="text"
            placeholder={t("login_placeholder")}
          />
          <input
            name="password"
            ref={passwordRef}
            className="password"
            type="password"
            placeholder={t("pass_placeholder")}
          />
          <Button className="login center" onClick={doLogin} primary={true}>
            {t("login_button")}
          </Button>
        </form>
        <div className="login-error">{!!error ? t(error) : ""}</div>
      </div>
    </>
  )
}

function LogoutButton() {
  const {t} = useTranslation(META.type);

  const doLogout = (e) => {
    e.preventDefault();
    void clearToken();
  };

  const doCheck = async (e) => {
    e.preventDefault();

    axios
      .get(`${API_PATH}/users/me`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      .then(async (response) => {
        const {data} = response;
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Button className="check center" onClick={doCheck} primary={true}>
        {t("check_button")}
      </Button>

      <Button className="logout center" onClick={doLogout} primary={true}>
        {t("logout_button")}
      </Button>
    </>
  )
}

function Content() {
  const {t} = useTranslation(META.type);
  const user = useSelector((state) => state.auth.user);
  if (!!!user) return <LoginForm/>;

  return (
    <div className="section">
      <div>User_id: {user?.user_id}</div>
      <div>Логин: {user?.login}</div>
      <div>Админ: {!!(user?.is_admin) ? "да" : "нет"}</div>
      <br/>
      <div>{JSON.stringify(user)}</div>
      <LogoutButton/>
    </div>
  );
}

export default memo(function WindowProfile({data}) {
  const {t} = useTranslation(META.type);
  return <Window data={data} title={t(TITLE_KEY)} icon={META.icon} content={<Content/>}/>;
});
