'use client'

import { useTournaments } from "@/context/modules/TournamentsContext";
import TournamentForm from "@/components/tournaments/TournamentForm";

export default function AddTournament() {

  const { createTournament } = useTournaments();

  const handleCreateTournament = async function (data) {
    await createTournament(data);
    window.location.replace(`/tournaments`);
  }

  return (
    <div>
      <TournamentForm action={handleCreateTournament} tournamentData={{}} isCreate={true}></TournamentForm>
    </div>
  )
}