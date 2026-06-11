'use client'

import React, { useEffect } from "react";
import Link from "next/link";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { usePlayers } from "@/context/modules/PlayersContext";
import { useTeams } from "@/context/modules/TeamsContext";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/time_utils";

export default function PlayersList() {

  const { fetchTeams, teams } = useTeams();
  const { players, fetchPlayers, removePlayer } = usePlayers();
  const { t } = useTranslation();

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const getTeamTitle = function (player) {
    if (player.team_id) {
      let team = teams.find(team => {
        return team._id === player.team_id;
      })
      return team ? team.title : '';
    };
    return '';
  }

  const confirmedRemove = async function(id) {
    await removePlayer(id);
  }

  const confirmRemove = async function(player) {
    confirmDialog({
      message: `Are you sure you want to remove ${player.name}?`,
      header: 'Remove player',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        await confirmedRemove(player._id);
        fetchPlayers();
      },
      reject: () => {}
    });
  }

  return (
    <div>
      <h1 className="section-title">{ t('players') }</h1>
      <ConfirmDialog />
      <Link className="button -primary" href={"/players/new"}>
        <i className="fa-solid fa-plus"></i>&nbsp;{ t('add') }
      </Link>
      <Link className="button -primary" href={"/players/upload"}>
        <i className="fa-solid fa-plus"></i>&nbsp;{ t('add_list') }
      </Link>
      <div className="items-list -players-list">
        <div className="items-header item-row -rows-6">
          <div className="item-header">{ t('name') }</div>
          <div className="item-header">{ t('birth') }</div>
          <div className="item-header">{ t('grade') }</div>
          <div className="item-header">{ t('sex') }</div>
          <div className="item-header">{ t('team') }</div>
          <div className="item-header">{ t('actions') }</div>
        </div>
        { players.map((player, teamIdx) => {
          return (
            <div key={teamIdx} className="item-row -rows-6">
              <div className="item-field">{ player.last_name } { player.first_name } { player.second_name }</div>
              <div className="item-field">{ formatDate(player.birth) }</div>
              <div className="item-field">{ player.grade }</div>
              <div className="item-field">{ player.sex === "m" ? t("male") : (player.sex === "f" ? t("female") : "") }</div>
              <div className="item-field">{ getTeamTitle(player) }</div>
              <div className="item-action">
                <Link href={`/players/edit/${player._id}`}>
                  <i className="fa-solid fa-pencil"></i>
                </Link>
                <i onClick={() => {
                  confirmRemove(player);
                }} className="fa-solid fa-trash"></i>
              </div>
            </div>
          )
        }) }
      </div>
    </div>
  )
}