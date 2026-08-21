'use client'

import React, { useContext, useState } from "react";
import Login from "@/components/auth/Login";

const TournamentsContext = React.createContext();

export function useTournaments() {
  return useContext(TournamentsContext);
}

export function TournamentsProvider({children}) {

  const [ tournaments, setTournaments ] = useState([]);
  const [ currentTournament, setCurrentTournament ] = useState({});
  const [ currentTournamentTeams, setCurrentTournamentTeams ] = useState([]);
  const [ currentTournamentPlayers, setCurrentTournamentPlayers ] = useState([]);
  const [ currentTournamentPlayersByTeam, setCurrentTournamentPlayersByTeam ] = useState([]);
  const [ playersByCategory, setPlayersByCategory ] = useState({});

  const fetchTournaments = async function () {
    const res = await fetch('/api/tournaments');
    const data = await res.json();
    setTournaments(data.data);
  };

  const fetchTournament = async function (id) {
    const tournament = await (await fetch(`/api/tournaments/${id}`)).json();
    setCurrentTournament(tournament.data);
  }

  const fetchTournamentFull = async function (id) {
    const tournament = await (await fetch(`/api/tournaments/${id}/full`)).json();
    setCurrentTournament(tournament.data.tournament);
    setCurrentTournamentTeams(tournament.data.teams);
    setCurrentTournamentPlayers(tournament.data.players);
    setCurrentTournamentPlayersByTeam(tournament.data.playersByTeam);
    /*let playersByCategory = tournament.data.playersByCategory;
    Object.keys(playersByCategory).forEach(categoryId => {
      playersByCategory[categoryId].forEach(player => {
        let team = tournament.data.teams.find(pteam => {
          return pteam._id === player.team_id;
        });
        player.team = team ? team : {};
      });
    });*/
    setPlayersByCategory(tournament.data.playersByCategory);
  }

  const createTournament = async function (params) {
    return await fetch(`/api/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
  }

  const updateTournament = async function (id, params) {
    return await fetch(`/api/tournaments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
  }

  const drawCategory = async function (tournament_id, category_id) {
    return await fetch(`/api/tournaments/${tournament_id}/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_id: category_id })
    });
  }

  const saveGameResult = async function(category_id, result, groupIdx) {
    const response = await fetch(`/api/tournaments/${currentTournament._id}/game_result`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_id: category_id, result: result, groupIdx: groupIdx })
    });
    await fetchTournamentFull(currentTournament._id);
    return response.data;
  }

  const value = {
    tournaments,
    fetchTournaments,
    currentTournament,
    updateTournament,
    fetchTournament,
    createTournament,
    fetchTournamentFull,
    currentTournamentTeams,
    currentTournamentPlayers,
    playersByCategory,
    drawCategory,
    currentTournamentPlayersByTeam,
    saveGameResult
  };

  return (
    <TournamentsContext.Provider value={value}>
      { children }
    </TournamentsContext.Provider>
  )
}