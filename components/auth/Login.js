import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/modules/AuthContext";

export default function Login() {
  const { t } = useTranslation();
  const { signIn, register } = useAuth();
  const [ mode, setMode ] = useState("login");
  const [ error, setError ] = useState("");

  const handleSubmitForm = async function (formData) {
    setError("");
    const data = Object.fromEntries(formData);
    if (mode === "register") {
      const res = await register(data);
      if (res.success === false) {
        setError("err_" + res.data.error);
      } else {
        switchMode();
      }
    } else {
      try {
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        console.log(res);
        if (res.error) {
          setError("err_" + res.error.replace(/Error\:\s*/, ''));
        }
      } catch (e) {
        console.log(e);
        setError("err_" + e.error.replace(/Error\:\s*/, ''));
      }
    }
  }
  const switchMode = function() {t
    setError("");
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login");
    }
  }
  return (
    <div className="register-form">
      <form action={ handleSubmitForm }>
        { mode === "login" ? (
          <div className="form-fields">
            <div className="form-row">
              <div className="form-field">
                <label>{ t('email') }</label>
              </div>
              <div className="form-field">
                <input type="text" name="email" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>{ t('password') }</label>
              </div>
              <div className="form-field">
                <input name="password" type="password" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
              </div>
              <div className="form-field">
                <button className="button -primary" type="submit">{ t('login') }</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="form-fields">
            <div className="form-row">
              <div className="form-field">
                <label>{ t('name') }</label>
              </div>
              <div className="form-field">
                <input type="text" name="name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>{ t('email') }</label>
              </div>
              <div className="form-field">
                <input type="text" name="email" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>{ t('password') }</label>
              </div>
              <div className="form-field">
                <input name="password" type="password" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
              </div>
              <div className="form-field">
                <button className="button -primary" type="submit">{ t('register') }</button>
              </div>
            </div>
          </div>
        ) }
      </form>
      { error.length > 0 ? (
        <div className="login-error">
          { t(error) }
        </div>
      ) : '' }
      <div className="switch-mode">
        <button onClick={() => {
          switchMode()
        }}>{ mode === "login" ? t("register_link") : t("login_link") }</button>
      </div>
    </div>
  )
}