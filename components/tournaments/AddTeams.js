'use client'

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "primereact/checkbox";

export default function AddTeams(props) {

  const { hideForm, onAddTeams, filterTeams, sportsFilter } = props;

  const { t } = useTranslation();

  const [ titleFilter, setTitleFilter ] = useState("");
  const [ selectedTeams, setSelectedTeams ] = useState([]);
  const [ filteredTeams, setFilteredTeams ] = useState([]);

  const handleFilterTeams = async function () {
    let filter = {};
    if (titleFilter) {
      filter.title = titleFilter;
    }
    filter.sports = Array.isArray(sportsFilter) ? sportsFilter.reduce((acc, curr) => {
      acc.push(curr._id);
      return acc;
    }, []) : [];
    setFilteredTeams(await filterTeams(filter));
  }

  const onSelectTeam = async function(e) {
    let teamsSelected = [...selectedTeams];
    if (e.checked) {
      teamsSelected.push(e.value);
    } else {
      teamsSelected.splice(selectedTeams.indexOf(e.value), 1);
    }
    setSelectedTeams(teamsSelected);
  }

  const selectAll = async function (e) {
    if (e.checked) {
      let teamsSelected = filteredTeams.reduce((acc, curr) => {
        acc.push(curr._id);
        return acc;
      }, []);
      setSelectedTeams(teamsSelected);
    } else {
      setSelectedTeams([]);
    }
  }

  const handleAddTeams = async function() {
    onAddTeams(selectedTeams);
    hideForm(false);
  }

  return (
    <div>
      <div className="filter-header -add-teams">
        <div className="filter-head">
          <Checkbox onChange={ selectAll } checked={ filteredTeams.length > 0 && selectedTeams.length === filteredTeams.length } />
        </div>
        <div className="filter-head">
          <input type="text" placeholder={ t("title") } value={titleFilter} onChange={(e) => {
            setTitleFilter(e.target.value);
          }} />
        </div>
        { Array.isArray(sportsFilter) && sportsFilter.length > 0 ? (
          <div className="filter-head">
            { sportsFilter.map((sport, sportIdx) => {
              return (
                <span key={sport._id}>{ sport.name }{ sportIdx === sportsFilter.length - 1 ? '' : ', ' }</span>
              )
            }) }
          </div>
        ) : ('') }
        <div className="filter-head">
          <button className="button -primary" onClick={() => {
            handleFilterTeams();
          }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div className="items-list -add-players">
        { filteredTeams.map((team, teamIdx) => {
          return (
            <div key={teamIdx} className="item-row">
              <div className="item-field">
                <Checkbox name="teams" value={ team._id } onChange={onSelectTeam} checked={ selectedTeams.includes(team._id) } />
              </div>
              <div className="item-field">{ team.title }</div>
              <div className="item-field">{ team.hometown }</div>
            </div>
          )
        }) }
        {filteredTeams.length > 0 ? (
          <div className="items-list-actions -actions-1">
            <button className="button -primary" disabled={ selectedTeams.length === 0 } onClick={ handleAddTeams }>
              <i className="fa-solid fa-plus"></i>{ t('add_selected') }
            </button>
          </div>
        ) : ('')}
      </div>
    </div>
  )
}