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

  const defaultGrousData = {
    groupsCount: 0,
    groupSize: 0,
    groupDrawBasketsCount: 0,
    rounds: 1
  };

  const [ creating, setCreating ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ seeds, setSeeds ] = useState(false);
  const [ sex, setSex ] = useState("");
  const [ ageFrom, setAgeFrom ] = useState(null);
  const [ ageTo, setAgeTo ] = useState(null);
  const [ weightFrom, setWeightFrom ] = useState(null);
  const [ weightTo, setWeightTo ] = useState(null);
  const [ dateStart, setDateStart ] = useState(categoryData.dateStart ? categoryData.dateStart : (currentTournament.date_start || null));
  const [ dateEnd, setDateEnd ] = useState(categoryData.dateEnd ? categoryData.dateEnd : (currentTournament.date_end || null));
  const [ type, setType ] = useState("individual");
  const [ hasPlayoff, setHasPlayoff ] = useState(true);
  const [ hasGroups, setHasGroups ] = useState(false);
  const [ groupsData, setGroupsData ] = useState(defaultGrousData);

  useEffect(() => {
    setTitle(categoryData.title || '');
    setSeeds(categoryData.seeds || false);
    setSex(categoryData.sex || '');
    setAgeFrom(categoryData.ageFrom || null);
    setAgeTo(categoryData.ageTo || null);
    setWeightFrom(categoryData.weightFrom || null);
    setWeightTo(categoryData.weightTo || null);
    setType(categoryData.type || "individual");
    setHasPlayoff(categoryData.hasPlayoff || false);
    setHasGroups(categoryData.hasGroups || false);
    setGroupsData(categoryData.groupsData || defaultGrousData);
  }, [ categoryData ]);

  const handleSubmitForm = async function(prevState, data) {
    if (!creating) {
      setCreating(true);
      let formData = Object.fromEntries(data);
      formData.seeds = formData.seeds === "on" ? true : false;
      formData.hasPlayoff = formData.hasPlayoff === "on" ? true : false;
      formData.hasGroups = formData.hasGroups === "on" ? true : false;
      formData.type = type;
      formData.groupsData = defaultGrousData;
      Object.keys(defaultGrousData).forEach(field => {
        formData.groupsData[field] = formData[field];
        delete formData[field];
      });
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
            <div className="field-title">{ t('weight_from') }</div>
            <div className="field-value">
              <input name="weightFrom" type="numeric" defaultValue={weightFrom} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('weight_to') }</div>
            <div className="field-value">
              <input name="weightTo" type="numeric" defaultValue={weightTo} />
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
            <div className="field-title">{ t('has_playoff') }</div>
            <div className="field-value">
              <Checkbox name="hasPlayoff" checked={hasPlayoff} onChange={(e) => setHasPlayoff(e.checked) } />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('has_groups') }</div>
            <div className="field-value">
              <Checkbox name="hasGroups" checked={hasGroups} onChange={(e) => setHasGroups(e.checked) } />
            </div>
          </div>
          { hasGroups ? (
            <>
              <div className="add-item-field">
                <div className="field-title">{ t('groups_count') }</div>
                <div className="field-value">
                  <input name="groupsCount" type="numeric" defaultValue={groupsData.groupsCount} />
                </div>
              </div>
              <div className="add-item-field">
                <div className="field-title">{ t('group_size') }</div>
                <div className="field-value">
                  <input name="groupSize" type="numeric" defaultValue={groupsData.groupSize} />
                </div>
              </div>
              <div className="add-item-field">
                <div className="field-title">{ t('group_draw_baskets_count') }</div>
                <div className="field-value">
                  <input name="groupDrawBasketsCount" type="numeric" defaultValue={groupsData.groupDrawBasketsCount} />
                </div>
              </div>
              <div className="add-item-field">
                <div className="field-title">{ t('group_rounds') }</div>
                <div className="field-value">
                  <input name="rounds" type="numeric" defaultValue={groupsData.rounds} />
                </div>
              </div>
            </>
          ) : '' }
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