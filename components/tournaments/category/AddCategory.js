'use client'

import { useRouter } from "next/navigation";
import { useTournaments } from "@/context/modules/TournamentsContext";
import CategoryForm from "@/components/tournaments/category/CategoryForm";

export default function AddCategory(props) {

  const { hideForm } = props;

  const router = useRouter();
  const { currentTournament, updateTournament, fetchTournamentFull } = useTournaments();

  const handleAddCategory = async function (data) {
    currentTournament.categories = currentTournament.categories || [];
    currentTournament.categories.push(data);
    await updateTournament(currentTournament._id, { categories: currentTournament.categories });
    await fetchTournamentFull(currentTournament._id);
    router.push(`/tournaments/${currentTournament._id}`);
    hideForm();
  }

  return (
    <div>
      <CategoryForm action={handleAddCategory} categoryData={{}}></CategoryForm>
    </div>
  )
}