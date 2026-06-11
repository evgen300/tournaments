'use client'

import { useRouter } from "next/navigation";
import { useTeams } from "@/context/modules/TeamsContext";
import TeamForm from "@/components/teams/TeamForm";

export default function AddTeam() {

  const { createTeam } = useTeams();
  const router = useRouter();

  const handleCreateTeam = async function (data) {
    await createTeam(data);
    router.push(`/teams`);
  }

  return (
    <div>
      <TeamForm action={handleCreateTeam} teamData={{}} isCreate={true}></TeamForm>
    </div>
  )
}