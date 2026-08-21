'use client'
import React, { useState, useEffect, useActionState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { useTranslation } from "react-i18next";
import { useTeams } from "@/context/modules/TeamsContext";

export default function TeamForm(props) {

  const { teamData, action, isCreate } = props;

  const { t } = useTranslation();

  const { sportsList, fetchSports } = useTeams();

  const [ creating, setCreating ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ hometown, setHometown ] = useState("");
  const [ teamSports, setTeamSports ] = useState([]);
  const [ image, setImage ] = useState("");

  useEffect(() => {
    setTitle(teamData.title || '');
    setHometown(teamData.hometown || '');
    setTeamSports(teamData.sports || []);
  }, [ teamData ]);

  useEffect(() => {
    fetchSports();
  }, [ ]);

  const onSelectSports = async function (e) {
    let sportsSelected = e.value.reduce((acc, curr) => {
      acc.push(curr instanceof Object ? curr._id : curr);
      return acc;
    }, []);
    setTeamSports(sportsSelected);
  }

  const handleSubmitForm = async function(prevState, data) {
    if (!creating) {
      setCreating(true);
      let formData = Object.fromEntries(data);
      formData.sports = teamSports;
      data.set('sports', teamSports);
      formData.image = data.get('image');
      await action(data);
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
            <div className="field-title">{ t('image') }</div>
            <div className="field-value">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
              />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('hometown') }</div>
            <div className="field-value">
              <input name="hometown" type="text" defaultValue={hometown} />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('sports') }</div>
            <div className="field-value">
              <MultiSelect placeholder="sports" value={ teamSports } options={ sportsList } optionLabel="name" optionValue="_id" className="teams-select" onChange={onSelectSports} name="sports" />
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