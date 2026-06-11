'use client'

import React, { useContext, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}) {

  const { status, data, update } = useSession();

  const register = async function (data) {
    let response = await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  };

  const updateUser = async function (data) {
    return await fetch(`/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  const updatePassword = async function (data) {
    return await fetch(`/api/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  const value = {
    register,
    signIn,
    status,
    session: data,
    signOut,
    updateSession: update,
    updateUser,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  )
}