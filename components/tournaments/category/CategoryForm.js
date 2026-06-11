'use client'
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import React, { useState, useEffect, useActionState } from "react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useTournaments } from "@/context/modules/TournamentsContext";
import { useTranslation } from "react-i18next";

export default function CategoryForm(props) {

  const { categoryData, action, isCreate } = props;

  const { currentTournament } = useTournaments();
  const { t } = useTranslation();

  const [ creating, setCreating ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ seeds, setSeeds ] = useState(false);
  const [ sex, setSex ] = useState("");
  const [ ageFrom, setAgeFrom ] = useState(null);
  const [ ageTo, setAgeTo ] = useState(null);
  const [ dateStart, setDateStart ] = useState(categoryData.dateStart ? categoryData.dateStart : (currentTournament.date_start || null));
  const [ dateEnd, setDateEnd ] = useState(categoryData.dateEnd ? categoryData.dateEnd : (currentTournament.date_end || null));
  const [ type, setType ] = useState("individual");

  useEffect(() => {
    setTitle(categoryData.title || '');
    setSeeds(categoryData.seeds || false);
    setSex(categoryData.sex || '');
    setAgeFrom(categoryData.ageFrom || null);
    setAgeTo(categoryData.ageTo || null);
    setType(categoryData.type || "individual");
  }, [ categoryData ]);

  const handleSubmitForm = async function(prevState, data) {
    if (!creating) {
      setCreating(true);
      let formData = Object.fromEntries(data);
      formData.seeds = formData.seeds === "on" ? true : false;
      formData.type = type;
      await action(formData);
      setCreating(false);
    }
  }

  const [ form, formAction, pending ] = useActionState(handleSubmitForm, {});

  return (
    <div>
      <form action={formAction}>
        <input type="text" value={ categoryData.id ? categoryData.id : "" } style={{display: "none"}} disabled/>
        <div className="add-item">
          <div className="add-item-field">
            <div className="field-title">{ t('title') }</div>
            <div className="field-value">
              <input name="title" type="text" defaultValue={title} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('seeds') }</div>
            <div className="field-value">
              <Checkbox name="seeds" checked={seeds} onChange={(e) => setSeeds(e.checked) } />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('sex') }</div>
            <div className="field-value">
              <select name="sex" value={sex} onChange={(e) => setSex(e.value)}>
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('age_from') }</div>
            <div className="field-value">
              <input name="ageFrom" type="numeric" defaultValue={ageFrom} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('age_to') }</div>
            <div className="field-value">
              <input name="ageTo" type="numeric" defaultValue={ageTo} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('type') }</div>
            <div className="field-value">
              <label>{ t('individual') }&nbsp;
                <RadioButton name="type" type="radio" value="individual" checked={ type === "individual" } onChange={() => setType("individual")} />
              </label>
              <br/>
              <label>{ t('group') }&nbsp;
                <RadioButton name="type" type="radio" value="group" checked={ type === "group" } onChange={() => setType("group")} />
              </label>
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('date_start') }</div>
            <div className="field-value">
              <DatePicker name="dateStart" value={dateStart} onChange={(e) => {
                setDateStart(e);
              }} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('date_end') }</div>
            <div className="field-value">
              <DatePicker name="dateEnd" value={dateEnd} onChange={(e) => {
                setDateEnd(e);
              }} />
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