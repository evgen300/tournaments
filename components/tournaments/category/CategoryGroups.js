'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Dialog } from 'primereact/dialog';

import GameResults from "@/components/tournaments/category/GameResults";

export default function CategoryGroups(props) {
  const { category } = props;

  const [ editResults, setEditResults ] = useState({});
  const [ editResultsMode, setEditResultsMode ] = useState(false);

  const { t } = useTranslation();

  const startEditResults = function(playerA, playerB, groupIdx) {
    setEditResults({
      playerA: playerA,
      playerB: playerB,
      groupIdx: groupIdx
    });
    setEditResultsMode(true);
  }

  const showResult = function (groupIdx, playerA, playerB) {
    const group = category.groups[groupIdx];
    if (group) {
      let result = group.results.find(res => {
        return res.playerA === playerA && res.playerB === playerB;
      });
      if (result) {
        return (
          <span className="game-result">{ result.resultA } : { result.resultB }</span>
        )
      } else {
        result = group.results.find(res => {
          return res.playerB === playerA && res.playerA === playerB;
        });
        if (result) {
          return (
            <span className="game-result">{ result.resultB } : { result.resultA }</span>
          )
        }
      }
    }
    return '';
  }

  return (
    <div className="category-groups">
      { category.groups.map((group, groupIdx) => {
        return (
          <div key={groupIdx} className="category-group">
            <div className="title">{ t('group_label') }&nbsp;{ group.index + 3 }</div>
            <div className="group-table">
              <div className={"player-row -cols-" + (group.players.length + 3)}>
                <div></div>
                { Array.from({ length: group.players.length }).map((el, idx) => {
                  return (<div key={ idx }></div>)
                }) }
                <div>{ t('points_table') }</div>
                <div>{ t('scores_table') }</div>
              </div>
            { group.players.map((player, playerIdx) => {
              return (
                <div key={playerIdx} className={"player-row -cols-" + (group.players.length + 3)}>
                  <div className="player-name">{ player.title }</div>
                  { Array.from({ length: group.players.length }).map((el, idx) => {
                    return (
                      <div key={ idx } className={ "results " + (idx === playerIdx ? "-image" : "") }>
                        { idx === playerIdx ? 
                          player.image ? (
                            <img src={ '/images/' + player.image } />
                          ) : '' 
                         : (
                          <>
                            <i className="fa-solid fa-pencil" onClick={(e) => {
                              startEditResults(player, group.players[idx], groupIdx);
                            }}></i>
                            { showResult(groupIdx, player._id, group.players[idx]._id) }
                          </>
                         ) }
                      </div>
                    )
                  }) }
                  { group.positions[player._id] ? (
                    <>
                      <div className="table-positions">{ group.positions[player._id].points }</div>
                      <div className="table-positions">{ group.positions[player._id].scored }-{ group.positions[player._id].missed }</div>
                    </>
                  ) : (
                    <>
                      <div></div>
                      <div></div>
                    </>
                  ) }
                </div>
              )
            }) }
            </div>
          </div>
        )
      }) }
      <Dialog header= { t("edit_results") } visible={editResultsMode} style={{ width: '70vw' }} draggable={ false } onHide={() => {if (!editResultsMode) return; setEditResultsMode(false); }} className="game-results-dialog">
        <GameResults category={ category } players={ editResults }></GameResults>
      </Dialog>
    </div>
  )
}