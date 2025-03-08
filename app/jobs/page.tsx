import JobsPageClient from "./JobsPageClient"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""

  return <JobsPageClient query={query} />
}
