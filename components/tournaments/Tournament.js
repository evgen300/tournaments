'use client'

import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useTranslation } from "react-i18next";

import { useTournaments } from "@/context/modules/TournamentsContext";
import { usePlayers } from "@/context/modules/PlayersContext";
import { useTeams } from "@/context/modules/TeamsContext";
import { useMain } from "@/context/MainContext";
import TournamentForm from "@/components/tournaments/TournamentForm";
import AddPlayers from "@/components/tournaments/AddPlayers";
import AddTeams from "@/components/tournaments/AddTeams";
import AddCategory from "@/components/tournaments/category/AddCategory";
import EditCategory from "@/components/tournaments/category/EditCategory";
import LoaderMain from "@/components/LoaderMain";

import { formatDateWithMonth, formatPeriod, formatDate } from "@/utils/time_utils";
import Link from "next/link";

export default function Tournament (params) {
  const { id } = params;
  const { currentTournament, fetchTournament, updateTournament, fetchTournamentFull, currentTournamentTeams, currentTournamentPlayers, currentTournamentPlayersByTeam } = useTournaments();
  const { filterPlayers } = usePlayers();
  const { filterTeams, sportsList, fetchSports } = useTeams();
  const { setBreadcrumbs } = useMain();
  const { t } = useTranslation();
  const [ addPlayersMode, setAddPlayersMode ] = useState(false);
  const [ addTeamsMode, setAddTeamsMode ] = useState(false);
  const [ addCategoryMode, setAddCategoryMode ] = useState(false);
  const [ editCategoryId, setEditCategoryId ] = useState(null);
  const [ sportsFilter, setSportsFilter ] = useState([]);

  useEffect(() => {
    fetchTournamentFull(id);
    fetchSports();
  }, [ ]);
  useEffect(() => {
    setBreadcrumbs([
      {
        title: currentTournament.title,
        href: `/tournaments/${currentTournament._id}`
      }
    ]);
    setTeamSportsFilter();
  }, [ currentTournament ]);
  const setTeamSportsFilter = function() {
    setSportsFilter(sportsList.filter(sport => {
      return currentTournament && currentTournament.sports ? currentTournament.sports.find(sp => {
        return sp === sport._id;
      }) : [];
    }));
  };

  useEffect(() => {
    setTeamSportsFilter();
  }, [ sportsList ]);

  const handleUpdateTournament = async function (data) {
    await updateTournament(currentTournament._id, data);
    fetchTournament(currentTournament._id);
  }

  const confirmedRemoveCatoegory = async function(categoryId) {
    let idx = currentTournament.categories.findIndex(cat => {
      return cat.id === categoryId;
    });
    currentTournament.categories.splice(idx, 1);
    await updateTournament(currentTournament._id, { categories: currentTournament.categories });
  }

  const confirmRemoveCategory = async function(categoryId) {
    const category = currentTournament.categories.find(cat => {
      return cat.id === categoryId;
    });
    confirmDialog({
      message: `${t('confirm_remove')} ${category.title}?`,
      header: t('remove_category'),
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        await confirmedRemoveCatoegory(categoryId);
        fetchTournamentFull(currentTournament._id);
      },
      reject: () => {},
      acceptClassName: "button -primary",
      acceptLabel: t('yes'),
      draggable: false,
      rejectClassName: "button",
      rejectLabel: t('no')
    });
  }

  const confirmedRemovePlayer = async function(playerId) {
    let idx = currentTournament.players.findIndex(player => {
      return player === playerId;
    });
    if (idx >= 0) {
      currentTournament.players.splice(idx, 1);
      await updateTournament(currentTournament._id, { players: currentTournament.players });
    }
  }

  const confirmRemovePlayer = async function(player) {
    confirmDialog({
      message: `${t('confirm_remove')} ${player.last_name} ${player.first_name}?`,
      header: t('remove_player'),
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        await confirmedRemovePlayer(player._id);
        fetchTournamentFull(currentTournament._id);
      },
      reject: () => {},
      acceptClassName: "button -primary",
      acceptLabel: t('yes'),
      draggable: false,
      rejectClassName: "button",
      rejectLabel: t('no')
    });
  }

  const confirmedRemoveTeam = async function(teamId) {
    let idx = currentTournament.teams.findIndex(team => {
      return team === teamId;
    });
    currentTournament.teams.splice(idx, 1);
    await updateTournament(currentTournament._id, { teams: currentTournament.teams });
  }

  const confirmRemoveTeam = async function(team) {
    confirmDialog({
      message: `${t('confirm_remove')} ${team.title}?`,
      header: t('remove_team'),
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: async () => {
        await confirmedRemoveTeam(team._id);
        await fetchTournamentFull(currentTournament._id);
      },
      reject: () => {},
      acceptClassName: "button -primary",
      acceptLabel: t('yes'),
      draggable: false,
      rejectClassName: "button",
      rejectLabel: t('no')
    });
  }

  const hideEditCategoryForm = function() {
    setEditCategoryId(null);
  }

  const addPlayers = async function(selectedPlayers) {
    let currentPlayers = (currentTournament.players || []);
    selectedPlayers.forEach(playerId => {
      if (!currentPlayers.includes(playerId)) {
        currentPlayers.push(playerId);
      }
    });
    await updateTournament(currentTournament._id, { players: currentPlayers });
    await fetchTournamentFull(currentTournament._id);
  }

  const addTeams = async function(selectedTeams) {
    let currentTeams = (currentTournament.teams || []);
    selectedTeams.forEach(teamId => {
      if (!currentTeams.includes(teamId)) {
        currentTeams.push(teamId);
      }
    });
    await updateTournament(currentTournament._id, { teams: currentTeams });
    await fetchTournamentFull(currentTournament._id);
  }

  return (
    <div>
      <ConfirmDialog />
      { currentTournament._id ? 
        (
          <TabView>
            <TabPanel header={ t("tournament_info") } key={"tab-tournament"}>
              <div className="tournament">
                <div className="tournament-data">
                  <h1>{ currentTournament.title }, ({ currentTournament.place }) { formatPeriod(currentTournament.date_start, currentTournament.date_end) }</h1>
                </div>
                <TournamentForm action={handleUpdateTournament} tournamentData={currentTournament} isCreate={false}></TournamentForm>
              </div>
            </TabPanel>
            <TabPanel header={ t("categories") } key={"tab-categories"}>
              <button onClick={() => {
                setAddCategoryMode(true);
              }} className="button -primary">
                <i className="fa-solid fa-plus"></i>&nbsp;{ t("add") }
              </button>
              <div className="items-header items-list">
                <div className="item-row -rows-5">
                  <div className="item-header">{ t('title') }</div>
                  <div className="item-header">{ t('age') }</div>
                  <div className="item-header">{ t('weight') }</div>
                  <div className="item-header">{ t('type') }</div>
                </div>
                { currentTournament.categories.map((category, categoryIdx) => {
                  return (
                    <div key={categoryIdx} className="item-row -rows-5">
                      <div className="item-field">
                        <Link href={`/tournaments/${currentTournament._id}/category/${category.id}`}>
                          { category.title }
                        </Link>
                      </div>
                      <div className="item-field">{ category.ageFrom && category.ageTo ? `${category.ageFrom} - ${category.ageTo}` : (category.ageFrom ? `${category.ageFrom}+` : `-`) }</div>
                      <div className="item-field">{ category.weightFrom && category.weightTo ? `${category.weightFrom} - ${category.weightTo}` : (category.weightFrom ? `${category.weightFrom}+` : `-`) }</div>
                      <div className="item-field">{ t(category.type) }</div>
                      <div className="item-action">
                        <i onClick={() => {
                          confirmRemoveCategory(category.id);
                        }} className="fa-solid fa-trash"></i>
                        <i onClick={() => {
                          setEditCategoryId(category.id);
                        }} className="fa-solid fa-pencil"></i>
                      </div>
                    </div>
                  )
                }) }
              </div>
            </TabPanel>
            <TabPanel header={ t("players") } key={"tab-players"}>
              <button onClick={() => {
                setAddPlayersMode(true);
              }} className="button -primary">
                <i className="fa-solid fa-plus"></i>&nbsp;{ t('add') }
              </button>
              <div className="items-header items-list">
                <div className="item-row -rows-5">
                  <div className="item-header">{ t('#') }</div>
                  <div className="item-header">{ t('name') }</div>
                  <div className="item-header">{ t('birth') }</div>
                  <div className="item-header">{ t('grade') }</div>
                </div>
                { currentTournamentPlayersByTeam.map((teamInfo, teamInfoIdx) => {
                  return (
                    <div className="item-row-header" key={teamInfoIdx}>
                      <div className="title">
                        { teamInfo.team.title ? teamInfo.team.title : "No team" }
                      </div>
                      { teamInfo.players.map((player, playerIdx) => {
                        return (
                          <div key={playerIdx} className="item-row -rows-5">
                            <div className="item-field">{ player.index }</div>
                            <div className="item-field">{ player.last_name } { player.first_name } { player.second_name }</div>
                            <div className="item-field">{ formatDate(player.birth) }</div>
                            <div className="item-field">{ player.grade }</div>
                            <div className="item-action">
                              <i onClick={() => {
                                confirmRemovePlayer(player);
                              }} className="fa-solid fa-trash"></i>
                            </div>
                          </div>
                        )
                      }) }
                    </div>
                  )
                })}
              </div>
            </TabPanel>
            <TabPanel header={ t("teams") } key={"tab-teams"}>
              <button onClick={() => {
                setAddTeamsMode(true);
              }} className="button -primary">
                <i className="fa-solid fa-plus"></i>&nbsp;{ t('add') }
              </button>
              <div className="items-header items-list">
                <div className="item-row -rows-3">
                  <div className="item-header">{ t('title') }</div>
                  <div className="item-header">{ t('hometown') }</div>
                </div>
                { currentTournamentTeams.map((team, teamIdx) => {
                  return (
                    <div key={teamIdx} className="item-row -rows-3">
                      <div className="item-field">{ team.title }</div>
                      <div className="item-field">{ team.hometown }</div>
                      <div className="item-action">
                        <i onClick={() => {
                          confirmRemoveTeam(team);
                        }} className="fa-solid fa-trash"></i>
                      </div>
                    </div>
                  )
                }) }
              </div>
            </TabPanel>
            { currentTournament.players_tournament && false ? 
              (
                <TabPanel header="Players">
                  { JSON.stringify(currentTournament.players) }
                </TabPanel>
              ) : ''
            }
          </TabView>
        ) : (
          <LoaderMain />
        )
      }
      <Dialog header= { t("add_players") } visible={addPlayersMode} style={{ width: '70vw' }} draggable={ false } onHide={() => {if (!setAddPlayersMode) return; setAddPlayersMode(false); }}>
        <AddPlayers hideForm={ setAddPlayersMode } onAddPlayers={ addPlayers } filterPlayers={ filterPlayers }></AddPlayers>
      </Dialog>
      <Dialog header={ t("add_teams") } visible={addTeamsMode} style={{ width: '50vw' }} draggable={ false } onHide={() => {if (!setAddTeamsMode) return; setAddTeamsMode(false); }}>
        <AddTeams hideForm={ setAddTeamsMode } onAddTeams={ addTeams } filterTeams={ filterTeams } sportsFilter={ sportsFilter }></AddTeams>
      </Dialog>
      <Dialog header={ t("add_category") } visible={addCategoryMode} style={{ width: '50vw' }} draggable={ false } onHide={() => {if (!setAddCategoryMode) return; setAddCategoryMode(false); }}>
        <AddCategory hideForm={ () => { setAddCategoryMode(false); } }></AddCategory>
      </Dialog>
      <Dialog header={ t("edit_category") } visible={editCategoryId !== null} style={{ width: '50vw' }} draggable={ false } onHide={() => { if (!setEditCategoryId) return; setEditCategoryId(null); }}>
        <EditCategory hideForm={ hideEditCategoryForm } categoryId={ editCategoryId }></EditCategory>
      </Dialog>
    </div>
  )
}