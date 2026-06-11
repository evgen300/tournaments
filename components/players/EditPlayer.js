'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeams } from "@/context/modules/TeamsContext";
import { usePlayers } from "@/context/modules/PlayersContext";
import PlayerForm from "@/components/players/PlayerForm";

export default function EditPlayer(props) {
  const { playerId } = props;
  const { fetchTeams } = useTeams();
  const { currentPlayer, fetchPlayer, updatePlayer } = usePlayers();

  const router = useRouter();

  useEffect(() => {
    fetchPlayer(playerId);
    fetchTeams();
  }, []);

  const handleUpdatePlayer = async function (data) {
    await updatePlayer(playerId, data);
    router.push(`/players`);
  }

  return (
    <div>
      <PlayerForm playerData={ currentPlayer } isCreate={false} action={handleUpdatePlayer}></PlayerForm>
    </div>
  )
}