'use client'

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/modules/AuthContext";

import LoaderMain from "@/components/LoaderMain";
import Login from "@/components/auth/Login";

export default function Dashboard() {

  const { status } = useAuth();
  const { t } = useTranslation();

  if (status === "loading") {
    return (
      <LoaderMain />
    )
  } else if (status === "unauthenticated") {
    return (
      <Login />
    )
  }
  return (
    <div className="flex flex-col">
      <div className="check-first grid grid-cols-3 gap-1 dashboard">
        <div className="dashboard-item">
          <Link href={"/tournaments/new"}>
            <i className="fa-solid fa-plus"></i>&nbsp;
            { t('add_tournament') }
          </Link>
        </div>
        <div className="dashboard-item">
          <Link href={"/teams/new"}>
            <i className="fa-solid fa-plus"></i>&nbsp;
            { t('add_team') }
          </Link>
        </div>
        <div className="dashboard-item">
          <Link href={"/players/new"}>
            <i className="fa-solid fa-plus"></i>&nbsp;
            { t('add_player') }
          </Link>
        </div>
      </div>
    </div>
  )
}