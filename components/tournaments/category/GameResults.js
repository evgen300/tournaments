'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import { useTeams } from "@/context/modules/TeamsContext";
import { useTournaments } from "@/context/modules/TournamentsContext";

const defaultResults = {
  "football": {
    playerA: "",
    playerB: "",
    resultA: 0,
    resulsB: 0,
    notes: ""
  }
};

export default function GameResults(props) {

  const { category, players } = props;

  const [ currentSport, setCurrentSport ] = useState({});
  const [ result, setResult ] = useState({});

  const { sports, fetchSports } = useTeams();
  const { saveGameResult } = useTournaments();
  const { t } = useTranslation();

  useEffect(() => {
    fetchSports();
  }, [ ]);

  useEffect(() => {
    if (sports.length > 0) {
      setCurrentSport(sports.find(sport => {
        return sport._id === category.sport;
      }))
    }
  }, [ sports, category ]);

  useEffect(() => {
    if (currentSport.name) {
      setResult(defaultResults[currentSport.name]);
    }
  }, [ currentSport ]);

  const renderForm = function() {
    switch (currentSport.name) {
      case "football":
        return (
          <div className="football-results">
            <div className="row-teams">
              <div className="team">
                { players.playerA.image ? (
                  <img src={ '/images/' + players.playerA.image } />
                ) : '' }
                {players.playerA.title}
              </div>
              <div className="team">
                { players.playerB.image ? (
                  <img src={ '/images/' + players.playerB.image } />
                ) : '' }
                {players.playerB.title}
              </div>
            </div>
            <div className="row-results">
              <div className="result">
                <input type="text" name="result-a" defaultValue={ result.playerA } onChange={(e) => {
                  setResult({...result,  playerA: players.playerA._id, resultA: parseInt(e.target.value) });
                }} />
              </div>
              <div className="result">
                <input type="text" name="result-b" defaultValue={ result.playerB } onChange={(e) => {
                  setResult({...result,  playerB: players.playerB._id, resultB: parseInt(e.target.value) });
                }} />
              </div>
            </div>
            <div className="notes">
              <textarea name="notes" defaultValue={result.notes} onChange={(e) => {
                  setResult({...result,  notes: e.target.value });
                }}></textarea>
            </div>
            <div className="footer">
              <button className="button -primary" onClick={() => saveResults()}>{ t("save") }</button>
            </div>
          </div>
        )
        break;
    }
  }

  const saveResults = async function () {
    await saveGameResult(category.id, result, players.groupIdx);
  }

  return (
    <div>{ renderForm() }</div>
  )
}