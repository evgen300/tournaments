'use client'

import React, { useEffect } from "react"
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useTeams } from "@/context/modules/TeamsContext";

export default function TeamsList() {

  const { t } = useTranslation();
  const { fetchTeams, teams, removeTeam } = useTeams();

  useEffect(() => {
    fetchTeams();
  }, []);

  const confirmedRemove = async function(id) {
    await removeTeam(id);
  }

  const confirmRemove = async function(team) {
    confirmDialog({
      message: `Are you sure you want to remove ${team.title}?`,
      header: 'Remove team',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        await confirmedRemove(team._id);
        fetchTeams();
      },
      reject: () => {}
    });
  }

  return (
    <div>
      <ConfirmDialog />
      <h1 className="section-title">{ t('teams') }</h1>
      <Link className="button -primary" href={"/teams/new"}>
        <i className="fa-solid fa-plus"></i>&nbsp;{ t('add') }
      </Link>
      <div className="items-list -teams-list">
        <div className="items-header item-row -rows-4">
          <div className="item-header">{ t('title') }</div>
          <div className="item-header">{ t('hometown') }</div>
        </div>
        { teams.map((team, teamIdx) => {
          return (
            <div key={teamIdx} className="item-row -rows-4">
              <div className="item-field">
                { team.image ? (
                  <img src={ '/images/' + team.image } />
                ) : '' }
              </div>
              <div className="item-field">{ team.title }</div>
              <div className="item-field">{ team.hometown }</div>
              <div className="item-action">
                <Link href={`/teams/edit/${team._id}`}>
                  <i className="fa-solid fa-pencil"></i>
                </Link>
                <i onClick={() => {
                  confirmRemove(team);
                }} className="fa-solid fa-trash"></i>
              </div>
            </div>
          )
        }) }
      </div>
    </div>
  )
}