'use client'

import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

const TeamsContext = React.createContext();

export function useTeams() {
  return useContext(TeamsContext);
}

export function TeamsProvider({children}) {

  const [ teams, setTeams ] = useState([]);
  const [ allTeams, setAllTeams ] = useState([]);
  const [ currentTeam, setCurrentTeam ] = useState({});
  const [ sports, setSports ] = useState([]);
  const [ sportsList, setSportsList ] = useState([]);
  const { t } = useTranslation();

  const fetchTeams = async function () {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data.data);
  };

  const fetchTeam = async function (id) {
    const res = await fetch(`/api/teams/${id}`);
    const data = await res.json();
    setCurrentTeam(data.data);
  };

  const createTeam = async function (params) {
    return await fetch(`/api/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
  }

  const updateTeam = async function (id, params) {
    return await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
  }

  const removeTeam = async function (id) {
    return await fetch(`/api/teams/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const filterTeams = async function (params = {}) {
    let query = [];
    Object.keys(params).forEach(field => {
      if (Array.isArray(params[field])) {
        params[field].forEach(value => {
          query.push(`${field}=${value}`);
        });
      } else {
        query.push(`${field}=${params[field]}`);
      }
    });
    const res = await fetch(`/api/teams/filter?${query.join('&')}`);
    const data = await res.json();

    //setFilteredPlayers(data.data);
    return data.data;
  }

  const fetchSports = async function () {
    const res = await fetch('/api/sports');
    const data = await res.json();
    let list = [];
    data.data.forEach(sport => {
      list.push({
        _id: sport._id,
        name: t(sport.name)
      });
    });
    setSports(data.data);
    setSportsList(list);
  }

  const fetchAllTeams = async function() {
    const res = await fetch('/api/teams/all');
    const data = await res.json();
    setAllTeams(data.data);
  }

  const value = {
    fetchTeams,
    teams,
    createTeam,
    currentTeam,
    setCurrentTeam,
    fetchTeam,
    updateTeam,
    removeTeam,
    filterTeams,
    fetchSports,
    sports,
    sportsList,
    fetchAllTeams,
    allTeams
  };

  return (
    <TeamsContext.Provider value={value}>
      { children }
    </TeamsContext.Provider>
  )
}