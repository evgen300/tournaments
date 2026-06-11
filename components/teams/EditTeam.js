'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeams } from "@/context/modules/TeamsContext";
import TeamForm from "@/components/teams/TeamForm";

export default function EditTeam(props) {
  const { teamId } = props;
  const router = useRouter();
  const { currentTeam, fetchTeam, updateTeam } = useTeams();

  useEffect(() => {
    fetchTeam(teamId);
  }, []);

  const handleUpdateTeam = async function (data) {
    await updateTeam(teamId, data);
    router.push(`/teams`);
  }

  return (
    <div>
      <TeamForm teamData={ currentTeam } isCreate={false} action={handleUpdateTeam}></TeamForm>
    </div>
  )
}