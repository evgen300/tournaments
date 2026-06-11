'use client'

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";
import { supportedLngs } from "@/i18n/config";

import { useAuth } from "@/context/modules/AuthContext";

export default function LocaleSwitcher() {

  const { i18n } = useTranslation();
  const { updateUser, session } = useAuth();

  useEffect(() => {
    if (session && session.user && session.user.lang) {
      i18n.changeLanguage(session.user.lang);
    }
  }, [ session ]);

  const langsList = Object.keys(supportedLngs);
  const langOptionTemplate = function (option) {
    return (
      <div className={"locale-option -lang-" + option}></div>
    )
  }

  const changeLanguage = async function (e) {
    i18n.changeLanguage(e.value);
    if (session && session.user) {
      await updateUser({ lang: e.value });
    }
  }

  return (
    <div>
      <div>
        <Dropdown value={i18n.resolvedLanguage} onChange={changeLanguage} options={langsList} itemTemplate={langOptionTemplate} valueTemplate={langOptionTemplate} className="locale-switcher" panelClassName="locale-switcher-panel" />
      </div>
    </div>
  )
}