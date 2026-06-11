'use client'

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/modules/AuthContext";

import LoaderMain from "./LoaderMain";

export default function Profile(props) {

  const { t } = useTranslation();
  const { session, updateUser, updateSession, updatePassword } = useAuth();

  const [ updatingProfile, setUpdatingProfile ] = useState(false);
  const [ updatingPassword, setUpdatingPassword ] = useState(false);

  const handleUpdateProfile = async function (data) {
    setUpdatingProfile(true);
    let updateData = Object.fromEntries(data);
    await updateUser(updateData);
    await updateSession(updateData);
    setUpdatingProfile(false);
  }

  const handleUpdatePassword = async function (data) {
    setUpdatingPassword(true);
    let updateData = Object.fromEntries(data);
    await updatePassword(updateData);
    setUpdatingPassword(false);
  }

  return (
    <div>
      { session ? (
        <div>
          <div className="user-name">
            <span>{ t('welcome') }, { session.user.name }</span>
          </div>
          <div className="profile-form">
            <h1 className="form-title">{ t("user_data") }</h1>
            { !updatingProfile ? (
              <form action={handleUpdateProfile}>
                <div className="add-item">
                  <div className="add-item-field">
                    <div className="field-title">{ t("name") }</div>
                    <div className="field-value">
                      <input name="name" type="text" defaultValue={session.user.name} />
                    </div>
                  </div>
                  <div className="add-item-field">
                    <div className="field-title">{ t("email") }</div>
                    <div className="field-value">
                      <span>{ session.user.email }</span>
                    </div>
                  </div>
                  <div className="add-item-field">
                    <div className="field-title"></div>
                    <div className="field-value">
                      <button type="submit" className="button -primary">{ t("save") }</button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <LoaderMain />
            ) }
          </div>
          <div className="profile-form">
            <h1 className="form-title">{ t("change_password") }</h1>
            { !updatingPassword ? (
              <form action={handleUpdatePassword}>
                <div className="add-item">
                  <div className="add-item-field">
                    <div className="field-title">{ t("old_password") }</div>
                    <div className="field-value">
                      <input name="old_password" type="password" defaultValue="" />
                    </div>
                  </div>
                  <div className="add-item-field">
                    <div className="field-title">{ t("new_password") }</div>
                    <div className="field-value">
                      <input name="new_password" type="password" defaultValue="" />
                    </div>
                  </div>
                  <div className="add-item-field">
                    <div className="field-title">{ t("new_password_repeat") }</div>
                    <div className="field-value">
                      <input name="new_password_repeat" type="password" defaultValue="" />
                    </div>
                  </div>
                  <div className="add-item-field">
                    <div className="field-title"></div>
                    <div className="field-value">
                      <button type="submit" className="button -primary">{ t("save") }</button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <LoaderMain />
            ) }
          </div>
        </div>
      ) : (
        <LoaderMain />
      ) }
    </div>
  )
}