'use client'

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "primereact/checkbox";

import { useTournaments } from "@/context/modules/TournamentsContext";
import { usePlayers } from "@/context/modules/PlayersContext";
import { useMain } from "@/context/MainContext";
import { useTeams } from "@/context/modules/TeamsContext";

import { TabView, TabPanel } from "primereact/tabview";
import AddPlayers from "@/components/tournaments/AddPlayers";
import AddTeams from "@/components/tournaments/AddTeams";
import CategoryDraw from "@/components/tournaments/category/CategoryDraw";
import CategoryDrawRound from "@/components/tournaments/category/CategoryDrawRound";
import GroupsBaskets from "@/components/tournaments/category/GroupsBaskets";
import CategoryGroups from "@/components/tournaments/category/CategoryGroups";

import LoaderMain from "@/components/LoaderMain";

export default function Category(props) {

  const { categoryId, tournamentId } = props;

  const { currentTournament, drawCategory, updateTournament, playersByCategory, fetchTournamentFull, currentTournamentPlayers, currentTournamentTeams } = useTournaments();
  const { filterPlayers } = usePlayers();
  const { filterTeams } = useTeams();
  const { setBreadcrumbs } = useMain();
  const { t } = useTranslation();

  const [ currentCategory, setCurrentCategory ] = useState({});
  const [ seedPlayers, setSeedPlayers ] = useState([]);
  const [ drawProgress, setDrawProgress ] = useState(false);
  const [ updateSeedsProgress, setUpdateSeedsProgress ] = useState(false);

  useEffect(() => {
    if (!currentTournament._id) {
      fetchTournamentFull(tournamentId);
    }
  }, []);
  useEffect(() => {
    if (currentTournament._id) {
      const categoryIdx = currentTournament.categories.findIndex(cat => {
        return cat.id === categoryId;
      });
      setCurrentCategory(currentTournament.categories[categoryIdx] ? currentTournament.categories[categoryIdx] : {});
      setBreadcrumbs([
        {
          href: `/tournaments/${currentTournament._id}`,
          title: currentTournament.title
        },
        {
          title: currentTournament.categories[categoryIdx] ? currentTournament.categories[categoryIdx].title: ''
        }
      ]);
    }
  }, [ currentTournament ]);
  useEffect(() => {
    searchPlayers({});
    setSeedPlayers(currentCategory.seedPlayers || []);
  }, [ currentCategory ]);

  const searchPlayers = async function (formFilter) {
    if (currentCategory.id) {
      let filter = {};
      if (formFilter.name) {
        filter.name = formFilter.name;
      }
      if (formFilter.team_id) {
        filter.team_id = formFilter.team_id;
      }
      if (currentCategory.sex) {
        filter.sex = currentCategory.sex;
      }
      if (currentCategory.ageFrom) {
        filter.ageFrom = currentCategory.ageFrom;
      }
      if (currentCategory.ageTo) {
        filter.ageTo = currentCategory.ageTo;
      }
      if (currentCategory.weightFrom) {
        filter.weightFrom = currentCategory.weightFrom;
      }
      if (currentCategory.weightTo) {
        filter.weightTo = currentCategory.weightTo;
      }
      filter.tournament_id = currentTournament._id;
      return await filterPlayers(filter);
    }
  }

  const searchTeams = async function () {
    if (currentCategory.id) {
      let filter = {
        tournament_id: currentTournament._id
      };
      return await filterTeams(filter);
    }
  }

  const addPlayers = async function(selectedPlayers) {
    let currentPlayers = (currentCategory.players || []).reduce((acc, curr) => {
      acc.push(curr);
      return acc;
    }, []);
    selectedPlayers.forEach(playerId => {
      if (!currentPlayers.includes(playerId)) {
        currentPlayers.push(playerId);
      }
    });
    currentCategory.players = currentPlayers;
    let categoryIdx = currentTournament.categories.find(category => {
      return category.id === currentCategory.id;
    });
    if (categoryIdx !== -1) {
      currentTournament.categories[categoryIdx] = currentCategory;
      await updateTournament(currentTournament._id, { categories: currentTournament.categories });
      await fetchTournamentFull(currentTournament._id);
    }
  }

  const addTeams = async function(selectedTeams) {
    let currentTeams = (currentCategory.teams || []).reduce((acc, curr) => {
      acc.push(curr);
      return acc;
    }, []);
    selectedTeams.forEach(teamId => {
      if (!currentTeams.includes(teamId)) {
        currentTeams.push(teamId);
      }
    });
    currentCategory.players = currentTeams;
    let categoryIdx = currentTournament.categories.find(category => {
      return category.id === currentCategory.id;
    });
    if (categoryIdx !== -1) {
      currentTournament.categories[categoryIdx] = currentCategory;
      await updateTournament(currentTournament._id, { categories: currentTournament.categories });
      await fetchTournamentFull(currentTournament._id);
    }
  }

  const onDrawCategory = async function () {
    setDrawProgress(true);
    await drawCategory(currentTournament._id, currentCategory.id);
    await fetchTournamentFull(currentTournament._id);
    setDrawProgress(false);
  }

  const onSetSeedPlayer = async function(e) {
    let playersSeed = [...seedPlayers];
    if (e.checked) {
      playersSeed.push(e.value);
    } else {
      playersSeed.splice(seedPlayers.indexOf(e.value), 1);
    }
    setSeedPlayers(playersSeed);
  }

  const updateCategorySeeds = async function () {
    setUpdateSeedsProgress(true);
    currentCategory.seedPlayers = seedPlayers;
    let categoryIdx = currentTournament.categories.findIndex(category => {
      return category.id === currentCategory.id;
    });
    if (categoryIdx !== -1) {
      currentTournament.categories[categoryIdx].seedPlayers = seedPlayers;
      await updateTournament(currentTournament._id, { categories: currentTournament.categories });
      await fetchTournamentFull(currentTournament._id);
    }
    setUpdateSeedsProgress(false);
  }

  return (
    <div>
      { currentCategory.id ? (
        <TabView>
          <TabPanel header={ t("category") } key="tab-category">
            <div className="items-list">
              <div className="item-row -rows-1">
                <div className="item-field">{ currentCategory.title } { currentCategory.ageFrom && currentCategory.ageTo ? `${currentCategory.ageFrom} - ${currentCategory.ageTo}` : (currentCategory.ageFrom ? `${currentCategory.ageFrom}+` : (currentCategory.ageTo ? `-${currentCategory.ageTo}` : '')) }, { t(currentCategory.type) }</div>
              </div>
            </div>
            <div>
              { !drawProgress ? (
              <button className="button -primary" onClick={() => {
                onDrawCategory();
              }}>{ t('draw') }</button>
              ) : (
                <span className="button">{ t('draw_progress') }</span>
              ) }
            </div>
            { currentCategory.type === "group" && currentCategory.groups.length > 0 ? (
              <CategoryGroups category={ currentCategory } />
            ) : (
              <>
                { playersByCategory[currentCategory.id].length > 0 ? (
                  <div className="items-list">
                    { currentCategory.type === "individual" ? (
                      <div className={"items-header item-row" + (currentCategory.seeds ? " -rows-3" : " -rows-2")}>
                        <div className="item-header">#</div>
                        <div className="item-header">{ t("name") }</div>
                        { currentCategory.seeds ? (
                          <div className="item-header">{ t("seeds") }</div>
                        ) : '' }
                      </div>
                    ) : (
                      <div className={"items-header item-row -teams-list" + (currentCategory.seeds ? " -rows-4" : " -rows-3")}>
                        <div className="item-header"></div>
                        <div className="item-header">{ t("title") }</div>
                        <div className="item-header">{ t("hometown") }</div>
                        { currentCategory.seeds ? (
                          <div className="item-header">{ t("seeds") }</div>
                        ) : '' }
                      </div>
                    ) }
                    { updateSeedsProgress ? (
                      <LoaderMain />
                    ) : (
                      <div>
                        { currentCategory.type === "individual" ? playersByCategory[currentCategory.id].map((playersInfo, playersInfoIdx) => {
                          return (
                            <div className="item-row-header" key={playersInfoIdx}>
                              <div className="title">
                                { playersInfo.team.title ? playersInfo.team.title : "No team" }
                              </div>
                              { playersInfo.players.map((player, playerIdx) => {
                                return (
                                  <div className={"item-row " +  (currentCategory.seeds ? "-rows-4" : "-rows-3") } key={ playerIdx }>
                                    <div className="item-field">{ player.index }</div>
                                    <div className="item-field">{ player.last_name } { player.first_name } { player.second_name }</div>
                                    <div className="item-field">{ player.team && player.team._id ? `${player.team.title}, ${player.team.hometown}` : '' }</div>
                                    { currentCategory.seeds ? (
                                      <div className="item-field">
                                        <Checkbox name="categorySeeds" value={ player._id } onChange={onSetSeedPlayer} checked={ seedPlayers.includes(player._id) } />
                                      </div>
                                    ) : ('') }
                                  </div>
                                )
                              }) }
                            </div>
                          )
                        }) : playersByCategory[currentCategory.id][0].players.map((team, teamIdx) => {
                          return (
                            <div className="item-row -rows-3 -teams-list" key={ teamIdx }>
                              <div className="item-field">
                                { team.image ? (
                                  <img src={ '/images/' + team.image } />
                                ) : '' }
                              </div>
                              <div className="item-field">{ team.title }</div>
                              <div className="item-field">{ team.hometown }</div>
                            </div>
                          )
                        }) }
                        { currentCategory.seeds ? (
                          <div className="items-list-actions -actions-1">
                            <button className="button -primary" onClick={ updateCategorySeeds }>{ t('save') }</button>
                          </div>
                        ) : ('') }
                      </div>
                    ) }
                  </div>
                ) : '' }
              </>
            ) }
            { drawProgress ? (
              <LoaderMain />
            ) : ( <div>
              <h1 className="print-section-1">{ currentTournament.chief ? `${t('chief')}: ${currentTournament.chief}` : '' }</h1>
              <h1 className="print-section">{ currentCategory.title } { currentCategory.ageFrom && currentCategory.ageTo ? `${currentCategory.ageFrom} - ${currentCategory.ageTo}` : (currentCategory.ageFrom ? `${currentCategory.ageFrom}+` : (currentCategory.ageTo ? `-${currentCategory.ageTo}` : '')) }, { t(currentCategory.type) }</h1>
              { currentCategory.draw ? 
                (
                  <TabView>
                    <TabPanel header="Style 2" key="style-2">
                      <CategoryDrawRound categoryDraw={ currentCategory.draw } players={ currentCategory.type === "individual" ? currentTournamentPlayers : currentTournamentTeams } seedPlayers={ seedPlayers ? seedPlayers : [] }></CategoryDrawRound>
                    </TabPanel>
                    <TabPanel header="Style 1" key="style-1">
                      <CategoryDraw categoryDraw={ currentCategory.draw } players={ playersByCategory[currentCategory.id] } seedPlayers={ seedPlayers ? seedPlayers : [] }></CategoryDraw>
                    </TabPanel>
                  </TabView>
                ) : '' }
            </div>) }
          </TabPanel>
          <TabPanel header={currentCategory.type === "individual" ? t("add_players") : t("add_teams")} key="tab-add-players">
            { currentCategory.type === "individual" ? (
              <AddPlayers filterPlayers={ searchPlayers } predefinedFilters={ ['age', 'sex', 'age_from', 'age_to', 'weight_from', 'weight_to'] } onAddPlayers={ addPlayers } hideForm={ () => {} }></AddPlayers>
            ) : (
              <AddTeams filterTeams={ searchTeams } onAddTeams={ addTeams } hideForm={ () => {} }></AddTeams>
            ) }
          </TabPanel>
          { currentCategory.hasGroups && currentCategory.groupsData.groupsCount > 0 ? (
            <TabPanel header={ t("baskets_edit") } key="tab-baskets">
              <GroupsBaskets category={ currentCategory } />
            </TabPanel>
          ) : '' }
        </TabView>
      ) : (
        <LoaderMain></LoaderMain>
      ) }
    </div>
  )
}