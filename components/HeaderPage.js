'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCookies } from "next-client-cookies";

import { useTranslation } from "react-i18next";
import { useMain } from "@/context/MainContext";
import { useAuth } from "@/context/modules/AuthContext";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function HeaderPage() {
  const { breadcrumbs } = useMain();
  const { updateSession, status } = useAuth();
  const { t } = useTranslation();
  const [ sessionLoaded, setSessionLoaded ] = useState(false);
  const [ theme, setTheme ] = useState("theme-dark");
  const cookies = useCookies();

  useEffect(() => {
    if (status === "authenticated") {
      setSessionLoaded(true);
    }
  }, [ status ]);
  useEffect(() => {
    if (sessionLoaded) {
      setInterval(() => {
        updateSession();
      }, 60 * 60 * 1000);
    }
  }, [ sessionLoaded ]);

  useEffect(() => {
    const themeCookie = cookies.get('theme');
    if (themeCookie) {
      setTheme(themeCookie || 'theme-dark');
    }
  }, [ ]);

  useEffect(() => {
    cookies.set('theme', theme);
  }, [ theme ]);

  const switchTheme = async function() {
    const themeCookie = cookies.get('theme');
    const themeSet = themeCookie === 'theme-light' || !themeCookie ? 'theme-dark' : 'theme-light';
    cookies.set('theme', themeSet);
    window.location.reload();
  }
  
  return (
    <header className="header">
      <div className="header-components">
        <div className="header-item">
          <Link href={"/"}>
            <h1 className={"ext-base sm:text-lg textGradient "}>
              <i className="fa-solid fa-house"></i>
            </h1>
          </Link>
        </div>
        <div className="header-item">
          { t("theme") }&nbsp;<i className={(theme === "theme-dark" ? "fa-solid fa-sun" : "fa-solid fa-moon") + " theme-switcher"} onClick={() => {switchTheme()}}></i>
        </div>
        <div className="header-item">
          <LocaleSwitcher></LocaleSwitcher>
        </div>
      </div>
      <div className="breadcrumbs">
        { breadcrumbs.map((breadcrumb, breadcrumbIdx) => {
          return (
            <div key={breadcrumbIdx} className="breadcrumb-item">
              { breadcrumbIdx === breadcrumbs.length - 1 ? 
                breadcrumb.title
              : (
                <Link href={ breadcrumb.href }>
                  {breadcrumb.title}
                  
                    <i className="fa-solid fa-chevron-right"></i>
                </Link>
              ) }
            </div>
          )
        }) }
      </div>
    </header>
  )
}