'use client'

import React, { useContext, useState } from "react";

const PlayersContext = React.createContext();

export function usePlayers() {
  return useContext(PlayersContext);
}

export function PlayersProvider({children}) {

  const [ players, setPlayers ] = useState([]);
  const [ currentPlayer, setCurrentPlayer ] = useState({});
  const [ filteredPlayers, setFilteredPlayers ] = useState([]);

  const fetchPlayers = async function () {
    const res = await fetch('/api/players');
    const data = await res.json();
    setPlayers(data.data);
  };

  const fetchPlayer = async function (id) {
    const res = await fetch(`/api/players/${id}`);
    const data = await res.json();
    setCurrentPlayer(data.data);
  };

  const createPlayer = async function (params) {
    return await fetch(`/api/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
  }

  const updatePlayer = async function (id, params) {
    return await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
  }

  const removePlayer = async function (id) {
    return await fetch(`/api/players/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const filterPlayers = async function (params = {}) {
    let query = [];
    Object.keys(params).forEach(field => {
      query.push(`${field}=${params[field]}`);
    })
    const res = await fetch(`/api/players/filter?${query.join('&')}`);
    const data = await res.json();

    //setFilteredPlayers(data.data);
    return data.data;
  }

  const uploadPlayers = async function (data) {
    return await fetch(`/api/players/upload`, {
      method: 'POST',
      body: data
    });
  }

  const value = {
    players,
    createPlayer,
    currentPlayer,
    setCurrentPlayer,
    fetchPlayer,
    updatePlayer,
    removePlayer,
    fetchPlayers,
    filterPlayers,
    filteredPlayers,
    uploadPlayers
  };

  return (
    <PlayersContext.Provider value={value}>
      { children }
    </PlayersContext.Provider>
  )
}