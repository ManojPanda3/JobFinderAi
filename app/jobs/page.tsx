import JobsPageClient from "./JobsPageClient"
import { searchJobs } from "@/lib/data"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""
  const jobs = await searchJobs(query) // Assuming searchJobs can be made async

  return <JobsPageClient query={query} jobs={jobs} />
}
