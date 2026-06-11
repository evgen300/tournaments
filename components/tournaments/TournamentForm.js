'use client'
import React, { useState, useEffect, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "primereact/multiselect";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useTeams } from "@/context/modules/TeamsContext";

export default function TournamentForm(props) {

  const { tournamentData, action, isCreate } = props;
  const { t } = useTranslation();
  const { sportsList, fetchSports } = useTeams();
  const [ creating, setCreating ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ place, setPlace ] = useState("");
  const [ dateStart, setDateStart ] = useState("");
  const [ dateEnd, setDateEnd ] = useState("");
  const [ chief, setChief ] = useState("");
  const [ tournamentSports, setTournamentSports ] = useState([]);

  useEffect(() => {
    setTitle(tournamentData.title || '');
    setPlace(tournamentData.place || '');
    setDateStart(tournamentData.date_start || '');
    setDateEnd(tournamentData.date_end || '');  
    setTournamentSports(tournamentData.sports || []);
    setChief(tournamentData.chief || "");
  }, [ tournamentData ]);

  useEffect(() => {
    fetchSports();
  }, [ ]);

  const onSelectSports = async function (e) {
    let sportsSelected = e.value.reduce((acc, curr) => {
      acc.push(curr instanceof Object ? curr._id : curr);
      return acc;
    }, []);
    setTournamentSports(sportsSelected);
  }

  const handleSubmitForm = async function(prevState, data) {
    if (!creating) {
      setCreating(true);
      let updateData = Object.fromEntries(data);
      updateData.sports = tournamentSports;
      await action(updateData);
      setCreating(false);
    }
  }

  const [ state, formAction, pending ] = useActionState(handleSubmitForm, {});

  return (
    <div>
      <form action={formAction}>
        <div className="add-item">
          <div className="add-item-field">
            <div className="field-title">{ t('title') }</div>
            <div className="field-value">
              <input name="title" type="text" defaultValue={title} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('place') }</div>
            <div className="field-value">
              <input name="place" type="text" defaultValue={place} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('date_start') }</div>
            <div className="field-value">
              <DatePicker name="date_start" value={dateStart} onChange={(e) => {
                setDateStart(e);
              }} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('date_end') }</div>
            <div className="field-value">
              <DatePicker name="date_end" value={dateEnd} onChange={(e) => {
                setDateEnd(e);
              }} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('chief') }</div>
            <div className="field-value">
              <input name="chief" type="text" defaultValue={chief} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('sports') }</div>
            <div className="field-value">
              <MultiSelect placeholder="sports" value={ tournamentSports } options={ sportsList } optionLabel="name" optionValue="_id" className="teams-select" onChange={onSelectSports} name="sports" />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title"></div>
            <div className="field-value">
                { isCreate ? (
                  <button type="submit" className="button -primary" disabled={pending}>
                    <i className="fa-solid fa-plus"></i>&nbsp;{ pending ? '...' + t('adding') : t('add') }
                  </button>
                ) : (
                  <button type="submit" className="button -primary" disabled={pending}>
                    <i className="fa-solid fa-save"></i>&nbsp;{ pending ? '...' + t('saving') : t('save') }
                  </button>
                ) }
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}