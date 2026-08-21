'use client'

import React, { useState, useEffect } from 'react';

import { useTranslation } from "react-i18next";
import { ListBox, ListboxRootValueChangeEvent } from 'primereact/listbox';
import { useTournaments } from "@/context/modules/TournamentsContext";

export default function GroupsBaskets(props) {

  const { category } = props;

  const [ baskets, setBaskets ] = useState({});

  const { t } = useTranslation();

  const { currentTournament, playersByCategory, updateTournament, fetchTournamentFull } = useTournaments();

  useEffect(() => {
    if (category && category.id && category.drawBaskets.length > 0) {
      let newBaskets = {};
      category.drawBaskets.forEach((basket, basketIdx) => {
        newBaskets[basketIdx] = basket.reduce((acc, curr) => {
          let player = playersByCategory[category.id][0].players.find(pl => {
            return pl._id === curr;
          });
          if (player) {
            acc.push(player);
          }
          return acc;
        }, []);
      });
      setBaskets(newBaskets);
    }
  }, [ category ]);

  const countryTemplate = function (country) {
    return (
      <div className="item">
        { country.image ? (
          <img src={ '/images/' + country.image } />
        ) : '' }
        <div className="item-title">
          { country.title }
        </div>
      </div>
    )
  }

  const addToBasket = function (basketIdx, values) {
    let newBaskets = {...baskets};
    newBaskets[basketIdx] = values;
    setBaskets(newBaskets);
  }

  const disabledOptions = function (idx, option) {
    let isDiabled = false;
    Object.keys(baskets).forEach(i => {
      if (parseInt(i) !== idx && !isDiabled) {
        isDiabled = baskets[i].find(player => {
          return player._id === option._id;
        });
      }
    });
    return isDiabled;
  }

  const saveBaskets = async function () {
    const categoryIdx = currentTournament.categories.findIndex(cat => {
      return cat.id === category.id;
    });
    let newBaskets = [];
    Object.values(baskets).forEach(basket => {
      newBaskets.push(basket.reduce((acc, curr) => {
        acc.push(curr._id);
        return acc;
      }, []));
    })
    currentTournament.categories[categoryIdx].drawBaskets = newBaskets;
    await updateTournament(currentTournament._id, { categories: currentTournament.categories });
    await fetchTournamentFull(currentTournament._id);
  }

  return (
    <div>
      { Array.from({ length: category.groupsData.groupDrawBasketsCount }).map((el, idx) => {
        return (
          <div key={ idx } className="draw-basket">
            <div className="title">
              { t('basket') }&nbsp;{ idx + 1 }
            </div>
            <div className="items">
              <ListBox
                options={ playersByCategory[category.id][0].players }
                optionLabel="title"
                itemTemplate={ countryTemplate }
                className="-list"
                onChange={ (e) => addToBasket(idx, e.target.value) }
                value={ baskets[idx] }
                optionDisabled={(option) => disabledOptions(idx, option)}
                multiple />
            </div>
          </div>
        )
      }) }
      <button className="button -primary" onClick={() => saveBaskets()}>{ t('save') }</button>
    </div>
  )
}