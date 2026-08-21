'use client'
import React, { useState, useEffect, useActionState } from "react";

import { Dropdown } from 'primereact/dropdown';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { useTeams } from "@/context/modules/TeamsContext";
import { useTranslation } from "react-i18next";

export default function PlayerForm(props) {

  const { playerData, action, isCreate } = props;
  const { teams, fetchTeams } = useTeams();
  const { t } = useTranslation();
  const [ creating, setCreating ] = useState(false);
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ teamId, setTeamId ] = useState("");
  const [ birth, setBirth ] = useState("");
  const [ grade, setGrade ] = useState("");
  const [ sex, setSex ] = useState("");
  const [ secondName, setSecondName ] = useState("");
  const [ weight, setWeight ] = useState(null);
  const [ teamList, setTeamList ] = useState([]);

  useEffect(() => {
    setFirstName(playerData.first_name || '');
    setLastName(playerData.last_name || '');
    setSecondName(playerData.second_name || '');
    setTeamId(playerData.team_id || '');
    setBirth(playerData.birth || '');
    setGrade(playerData.grade || '');
    setSex(playerData.sex || '');
    setWeight(playerData.weight || 0);
  }, [ playerData ]);

  useEffect(() => {
    setTeamList([{ _id: null, title: '' }].concat(teams));
  }, [ teams ])

  const handleSubmitForm = async function(prevState, data) {
    if (!creating) {
      setCreating(true);
      await action(Object.fromEntries(data));
    }
  }

  const [ state, formAction, pending ] = useActionState(handleSubmitForm, {});

  return (
    <div>
      <form action={formAction}>
        <div className="add-item">
          <div className="add-item-field">
            <div className="field-title">{ t('first_name') }</div>
            <div className="field-value">
              <input name="first_name" type="text" defaultValue={firstName} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('last_name') }</div>
            <div className="field-value">
              <input name="last_name" type="text" defaultValue={lastName} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('second_name') }</div>
            <div className="field-value">
              <input name="second_name" type="text" defaultValue={secondName} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('team') }</div>
            <div className="field-value">
              <Dropdown value={teamId} onChange={(e) => {
                setTeamId(e.value);
              }} options={teamList} optionValue="_id" optionLabel="title" placeholder={ t("team") } name="team_id" />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('birth') }</div>
            <div className="field-value">
              <DatePicker name="birth" value={birth} onChange={(e) => {
                setBirth(e);
              }} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('grade') }</div>
            <div className="field-value">
              <input name="grade" type="text" defaultValue={grade} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('weight') }</div>
            <div className="field-value">
              <input name="weight" type="number" defaultValue={weight} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('sex') }</div>
            <div className="field-value">
              <select name="sex" value={ sex } onChange={(e) => { setSex(e.target.value) }}>
                <option value=""></option>
                <option value="m">{ t('male') }</option>
                <option value="f">{ t('female') }</option>
              </select>
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