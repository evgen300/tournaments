import EditPlayer from "@/components/players/EditPlayer";

export default async function EditPlayerPage({params}) {
  const playerId = (await params).id
  return (
    <EditPlayer playerId={playerId}></EditPlayer>
  )
}