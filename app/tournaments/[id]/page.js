import Tournament from "@/components/tournaments/Tournament";

export default async function TournamentPage({params}) {
  const tournamentId = (await params).id
  return (
    <Tournament id={tournamentId}></Tournament>
  )
}