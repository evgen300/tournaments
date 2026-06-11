import React, { useState, useEffect } from "react";
import lodash from "lodash";

import { useTranslation } from "react-i18next";

import "@/app/style/draw.scss";

export default function CategoryDrawRound(props) {
  const { categoryDraw, players, seedPlayers } = props;

  const { t } = useTranslation();
  const [ drawData, setDrawData ] = useState([]);

  useEffect(() => {
    if (Array.isArray(categoryDraw.games) && categoryDraw.games.length > 0) {
      let drawFullData = [];
      let currentRound = categoryDraw.games[0].round;
      for (let i = 0; i < categoryDraw.totalRounds; ++i) {
        let games;
        if (categoryDraw.games[i]) {
          currentRound = categoryDraw.games[i].round;
          games = lodash.cloneDeep(categoryDraw.games[i]);
        } else {
          currentRound = currentRound / 2;
          games = {
            round: currentRound,
            games: []
          };
          for (let j = 0; j < currentRound; ++j) {
            games.games.push({
              red: "RED",
              white: "WHITE"
            });
          }
        }
        drawFullData.push(games);
      }
      drawFullData.forEach((round, roundIdx) => {
        round.games.forEach((game, gameIdx) => {
          game.red = players.find((player) => {
            return player._id === game.red;
          }) || {};
          game.white = players.find((player) => {
            return player._id === game.white;
          }) || {};
          ["red", "white"].forEach(player => {
            if (!(game[player].hasOwnProperty("first_name")) && game[player].hasOwnProperty("title")) {
              game[player].name = game[player].title;
            } else {
              let fullName = game[player].last_name;
              if (game[player].first_name) {
                fullName = fullName.length > 0 ? fullName + ` ${game[player].first_name.split('').shift().toUpperCase()}.` : game[player].first_name;
              }
              if (game[player].second_name) {
                fullName = fullName.length > 0 ? fullName + ` ${game[player].second_name.split('').shift().toUpperCase()}.` : game[player].last_name;
              }
              game[player].name = fullName;
            }
          });
        });
      });
      setDrawData(drawFullData);
    }
  }, [ categoryDraw ]);

  return (
    <div className={"draw-grid-round print-section " + `-rounds-${categoryDraw.totalRounds}`}>
      { [...Array(categoryDraw.totalRounds)].map((idx, roundIdx) => {
        return (
          <div key={ roundIdx }>
            { drawData[roundIdx] ? (
              <div className="draw-round">
                <div className="draw-round-title">{ drawData[roundIdx].round === 1 ? t(`final`) : `1/${drawData[roundIdx].round}` }</div>
              </div>
            ) : '' }
          </div>
        )
      }) }
      { [...Array(categoryDraw.totalRounds)].map((idx, roundIdx) => {
        return (
          <div key={ roundIdx }>
            { drawData[roundIdx] ? (
              <div className={"draw-round " + `-round-${roundIdx}`}>
                { drawData[roundIdx].games.map((game, gameIdx) => {
                  return (
                    <div key={ `round-${drawData[roundIdx].round}-game-${gameIdx}` } className={ "draw-round-game games-" + drawData[roundIdx].games.length }>
                      { roundIdx > 0 ? (
                        <div className="before-game-grid"></div>
                      ) : '' }
                      <div className="game-player">
                        { game.red.name || "" }
                        { seedPlayers.includes(game.red._id) ? (
                          <i className="fa-solid fa-check seed-player"></i>
                        ) : '' }
                      </div>
                      <div className="game-player">
                        { game.white.name || "" }
                        { seedPlayers.includes(game.white._id) ? (
                          <i className="fa-solid fa-check seed-player"></i>
                        ) : '' }
                      </div>
                      { roundIdx < categoryDraw.totalRounds - 1 ? (
                        <div className={"after-game-grid -grid-" + gameIdx % 2}></div>
                      ) : '' }
                    </div>
                  )
                }) }
              </div>
            ) : '' }
          </div>
        )
      }) }
    </div>
  )
}