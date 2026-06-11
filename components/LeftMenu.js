'use client'

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/modules/AuthContext";
import { useMain } from "@/context/MainContext";

export default function LeftMenuPage() {

  const router = useRouter();
  const pathname = usePathname();
  
  const { t } = useTranslation();
  const { session, signOut } = useAuth();
  const { setBreadcrumbs } = useMain();

  const links = {
    'tournaments': {
      title: t('tournaments'),
      icon: 'fa-solid fa-trophy'
    },
    'teams': {
      title: t('teams'),
      icon: 'fa-solid fa-people-group'
    },
    'players': {
      title: t('players'),
      icon: 'fa-solid fa-person'
    },
    'profile': {
      title: t('profile'),
      icon: 'fa-solid fa-address-card'
    }
  };

  useEffect(() => {
    if (links.hasOwnProperty(`${pathname.replace(/^\//, '')}`)) {
      setBreadcrumbs([]);
    }
  } , [ pathname ]);

  const handleSignOut = async function () {
    await signOut({ redirect: false });
    router.push('/');
  }

  return (
    <div className="left-menu">
      { session ? (
        <div>
          { Object.keys(links).map((link, linkIndex) => {
            return (
              <div key={linkIndex} className={"menu-item " + (pathname.indexOf(link) === 1 ? " -selected" : "")}>
                <Link href={"/" + link}>
                <i className={links[link].icon}></i>&nbsp;
                  { links[link].title }
                </Link>
              </div>
            )
          }) }
          <div className="menu-item -logout">
            <span className="logout" onClick={handleSignOut}>
              { t('logout') }
            </span>
          </div>
        </div>
      ) : '' }
    </div>
  )
}