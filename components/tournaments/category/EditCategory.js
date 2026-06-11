'use client'

import { useTournaments } from "@/context/modules/TournamentsContext";
import CategoryForm from "@/components/tournaments/category/CategoryForm";

export default function EditCategory(props) {

  const { categoryId, hideForm } = props;

  const { currentTournament, updateTournament, fetchTournamentFull } = useTournaments();
  const categoryIdx = currentTournament.categories.findIndex(cat => {
    return cat.id === categoryId;
  });

  if (categoryId === null) {
    return (
      <div></div>
    )
  }

  const handleUpdateCategory = async function (data) {
    currentTournament.categories[categoryIdx] = data;
    await updateTournament(currentTournament._id, { categories: currentTournament.categories });
    await fetchTournamentFull(currentTournament._id);
    hideForm();
  }

  return (
    <div>
      <CategoryForm action={handleUpdateCategory} categoryData={currentTournament.categories[categoryIdx]}></CategoryForm>
    </div>
  )
}