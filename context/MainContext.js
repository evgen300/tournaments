'use client'

import React, { useContext, useState } from "react";

import { SessionProvider } from "next-auth/react";
import { PlayersProvider } from "@/context/modules/PlayersContext";
import { TeamsProvider } from "@/context/modules/TeamsContext";
import { TournamentsProvider } from "@/context/modules/TournamentsContext";
import { AuthProvider } from "@/context/modules/AuthContext";
import "@/i18n/config";

const MainContext = React.createContext();

export function useMain() {
  return useContext(MainContext);
}

export function MainProvider({children}) {

  const [ breadcrumbs, setBreadcrumbs ] = useState([]);

  const value = {
    breadcrumbs,
    setBreadcrumbs
  };

  return (
    <MainContext.Provider value={value}>
      <SessionProvider>
        <AuthProvider>
          <TournamentsProvider>
            <TeamsProvider>
              <PlayersProvider>
                { children }
              </PlayersProvider>
            </TeamsProvider>
          </TournamentsProvider>
        </AuthProvider>
      </SessionProvider>
    </MainContext.Provider>
  )
}