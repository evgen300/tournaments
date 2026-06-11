import Category from "@/components/tournaments/category/Category";

export default async function CategoryPage({params}) {
  const categoryIdx = (await params).idx;
  const tournamentId = (await params).id;
  return (
    <Category categoryId={categoryIdx} tournamentId={tournamentId}></Category>
  )
}