'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useTranslation } from "react-i18next";

import { useTournaments } from "@/context/modules/TournamentsContext";
import LoaderMain from "@/components/LoaderMain";

import { formatDate } from "@/utils/time_utils";

export default function TournamentsList() {
  const { tournaments, fetchTournaments } = useTournaments();
  const { t } = useTranslation();
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      setLoading(true);
      await fetchTournaments();
      setLoading(false);
    }
    loadList();
  }, [ ]);

  if (loading) {
    return <LoaderMain></LoaderMain>
  }

  return (
    <div>
      <h1 className="section-title">{ t('tournaments') }</h1>
      <Link className="button -primary" href={"/tournaments/new"}>
        <i className="fa-solid fa-plus"></i>&nbsp;{ t("add") }
      </Link>
      <div className="items-list">
        <div className="items-header item-row -rows-4">
          <div className="item-header">{ t('title') }</div>
          <div className="item-header">{ t('place') }</div>
          <div className="item-header">{ t('start') }</div>
          <div className="item-header">{ t('end') }</div>
        </div>
        { tournaments.map((tournament, tournamentIdx) => {
          return (
            <div key={tournamentIdx} className="item-row -rows-4">
              <div className="item-field">
                <Link href={`/tournaments/${tournament._id}`}>{ tournament.title }</Link>
              </div>
              <div className="item-field">{ tournament.place }</div>
              <div className="item-field">{ formatDate(tournament.date_start) }</div>
              <div className="item-field">{ formatDate(tournament.date_end) }</div>
            </div>
          )
        }) }
      </div>
    </div>
  )
}