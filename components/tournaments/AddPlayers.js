'use client'

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTeams } from "@/context/modules/TeamsContext";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";

import LoaderMain from "@/components/LoaderMain";

export default function addPlayers(props) {

  const { hideForm, onAddPlayers, filterPlayers, predefinedFilters } = props;

  const { t } = useTranslation();

  const [ nameFilter, setNameFilter ] = useState("");
  const [ sexFilter, setSexFilter ] = useState("");
  const [ teamFilter, setTeamFilter ] = useState([]);
  const [ ageFromFilter, setAgeFromFilter ] = useState("");
  const [ ageToFilter, setAgeToFilter ] = useState("");
  const [ selectedPlayers, setSelectedPlayers ] = useState([]);
  const [ filteredPlayers, setFilteredPlayers ] = useState([]);
  const [ teamsById, setTeamsById ] = useState({});
  const [ searchProgress, setSearchProgress ] = useState(false);

  //const { filterPlayers } = usePlayers();
  const { fetchTeams, teams, fetchAllTeams, allTeams } = useTeams();

  useEffect(() => {
    fetchAllTeams();
  }, []);
  useEffect(() => {
    let byId = {};
    allTeams.forEach(team => {
      byId[team._id] = team;
    });
    setTeamsById(byId);
  }, [ allTeams ]);

  useEffect(() => {
    
  }, [ nameFilter, sexFilter, teamFilter, ageFromFilter, ageToFilter ]);

  const handleFilterPlayers = async function () {
    let filter = {};
    if (nameFilter) {
      filter.name = nameFilter;
    }
    if (sexFilter) {
      filter.sex = sexFilter;
    }
    if (ageFromFilter) {
      filter.age_from = ageFromFilter;
    }
    if (ageToFilter) {
      filter.age_to = ageToFilter;
    }
    if (teamFilter.length > 0) {
      filter.team_id = teamFilter.join(",");
    }
    setSearchProgress(true);
    const players = await filterPlayers(filter);
    setFilteredPlayers(players);
    setSearchProgress(false);
  }

  const onSelectPlayer = async function(e) {
    let playersSelected = [...selectedPlayers];
    if (e.checked) {
      playersSelected.push(e.value);
    } else {
      playersSelected.splice(selectedPlayers.indexOf(e.value), 1);
    }
    setSelectedPlayers(playersSelected);
  }

  const selectAll = async function (e) {
    if (e.checked) {
      let playersSelected = filteredPlayers.reduce((acc, curr) => {
        acc.push(curr._id);
        return acc;
      }, []);
      setSelectedPlayers(playersSelected);
    } else {
      setSelectedPlayers([]);
    }
  }

  const onSelectTeams = function (e) {
    let teamsSelected = e.value.reduce((acc, curr) => {
      acc.push(curr instanceof Object ? curr._id : curr);
      return acc;
    }, []);
    setTeamFilter(teamsSelected);
  }

  const handleAddPlayers = async function() {
    onAddPlayers(selectedPlayers);
    hideForm(false);
  }

  return (
    <div>
      <div className="filter-header -add-players">
        <div className="filter-head">
          <Checkbox onChange={ selectAll } checked={ filteredPlayers.length > 0 && selectedPlayers.length === filteredPlayers.length } />
        </div>
        <div className="filter-head">
          <input type="text" placeholder={ t("name") } value={nameFilter} onChange={(e) => {
            setNameFilter(e.target.value);
          }} />
        </div>
        { Array.isArray(predefinedFilters) && predefinedFilters.includes("sex") ? '' : (
          <div className="filter-head">
            <select value={sexFilter} placeholder={ t("sex") } onChange={(e) => {
              setSexFilter(e.target.value);
            }}>
              <option value=""></option>
              <option value="m">{ t('male') }</option>
              <option value="f">{ t('female') }</option>
            </select>
          </div>
        ) }
        <div className="filter-head">
          <MultiSelect placeholder={ t("teams") } value={ teamFilter } options={ allTeams } optionLabel="title" optionValue="_id" onChange={ onSelectTeams } className="teams-select" />
        </div>
        { Array.isArray(predefinedFilters) && predefinedFilters.includes("age_from") ? '' : (
          <div className="filter-head">
            <input type="number" value={ageFromFilter} placeholder={ t("age_from") } onChange={(e) => {
              setAgeFromFilter(e.target.value);
            }} />
          </div>
        ) }
        { Array.isArray(predefinedFilters) && predefinedFilters.includes('age_to') ? '' : (
          <div className="filter-head">
            <input type="number" value={ageToFilter} placeholder={ t("age_to") } onChange={(e) => {
              setAgeToFilter(e.target.value);
            }} />
          </div>
        ) }
        <div className="filter-head">
          <button className="button -primary" onClick={() => {
            handleFilterPlayers();
          }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      { searchProgress ? (
        <LoaderMain />
      ) : (
        <div className="items-list -add-players">
          { filteredPlayers.map((player, playerIdx) => {
            return (
              <div key={playerIdx} className="item-row">
                <div className="item-field">
                  <Checkbox name="players" value={ player._id } onChange={onSelectPlayer} checked={ selectedPlayers.includes(player._id) } />
                </div>
                <div className="item-field">{ player.last_name } { player.first_name } { player.second_name }</div>
                <div className="item-field">{ teamsById[player.team_id] ? `${teamsById[player.team_id].title}, ${teamsById[player.team_id].hometown}` : '' }</div>
                <div className="item-field">{ player.grade }</div>
                <div className="item-field">{ player.sex === "m" ? t('male') : (player.sex === "f" ? t('female') : '') }</div>
              </div>
            )
          }) }
          {filteredPlayers.length > 0 ? (
            <div className="items-list-actions -actions-1">
              <button className="button -primary" disabled={ selectedPlayers.length === 0 } onClick={ handleAddPlayers }>
                <i className="fa-solid fa-plus"></i>{ t('add_selected') }
              </button>
            </div>
          ) : ('')}
        </div>
      ) }
    </div>
  )
}