import EditTeam from "@/components/teams/EditTeam";

export default async function EditTeamPage({params}) {
  const teamId = (await params).id
  return (
    <EditTeam teamId={teamId}></EditTeam>
  )
}