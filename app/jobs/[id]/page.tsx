import { notFound } from "next/navigation"
import JobsClient from "./JobsClient";

export default async function JobPage({ params }: { params: { id: string } }) {
  const jobId = params.id;

  if (!jobId) {
    notFound()
  }

  return (
    <JobsClient jobId={jobId} />
  )
}
