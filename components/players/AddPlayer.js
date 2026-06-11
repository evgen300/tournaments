'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useTeams } from "@/context/modules/TeamsContext";
import { usePlayers } from "@/context/modules/PlayersContext";
import PlayerForm from "@/components/players/PlayerForm";

export default function AddPlayer() {

  const { fetchTeams } = useTeams();
  const { createPlayer } = usePlayers();

  const router = useRouter();

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreatePalyer = async function (data) {
    await createPlayer(data);
    router.push(`/players`);
  }

  return (
    <div>
      <PlayerForm action={handleCreatePalyer} playerData={{}} isCreate={true}></PlayerForm>
    </div>
  )
}