'use client'

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";
import { usePlayers } from "@/context/modules/PlayersContext";
import { useTeams } from "@/context/modules/TeamsContext";

export default function UploadPlayers() {

  const { uploadPlayers } = usePlayers();
  const { teams, fetchTeams } = useTeams();
  const { t } = useTranslation();

  const [ uploading, setUploading ] = useState(false);
  const [ teamId, setTeamId ] = useState("");

  useEffect(() => {
    fetchTeams();
  }, [ ]);

  const handleSubmitForm = async function (formData) {
    setUploading(true);
    console.log(formData.get("file"));
    let data = new FormData();
    data.append("file", formData.get("file"));
    data.append("team_id", formData.get("team_id"));
    await uploadPlayers(data);
    setUploading(false);
  }

  return (
    <div>
      <form action={handleSubmitForm}>
        <div className="add-item">
          <div className="add-item-field">
            <div className="field-title">{ t('team') }</div>
            <div className="field-value">
              <Dropdown value={teamId} onChange={(e) => {
                setTeamId(e.value);
              }} options={teams} optionValue="_id" optionLabel="title" placeholder={ t("team") } name="team_id" />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title">{ t('add_file') }</div>
            <div className="field-value">
              <input name="file" type="file" />
            </div>
          </div>
          <div className="add-item-field">
            <div className="field-title"></div>
            <div className="field-value">
              <button type="submit" className="button -primary" disabled={uploading}>
                <i className="fa-solid fa-plus"></i>&nbsp;{ uploading ? '...' + t('adding') : t('add') }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}