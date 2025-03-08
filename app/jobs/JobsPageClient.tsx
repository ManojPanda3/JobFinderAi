"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import JobList from "@/components/job-list"
import { fetcheJobs, Job, searchJobs } from "@/lib/data"
import { useEffect, useState } from "react"

interface JobsPageClientProps {
  query: string
}

export default function JobsPageClient({ query }: JobsPageClientProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  useEffect(() => {
    const allJobs = fetcheJobs();
    const filterdJobs = allJobs.filter(n => n.title.toLocaleLowerCase() === query.toLocaleLowerCase() || n.description.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    setJobs(filterdJobs)
    // searchJobs(query)
    //   .then((fetchedJobs) => {
    //     setJobs(fetchedJobs);
    //   })
  }, [query]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Find Your Next Job</h1>
        <form className="flex flex-col sm:flex-row gap-4 max-w-3xl">
          <Input
            name="q"
            placeholder="Search jobs by title, company, or skill..."
            className="flex-1"
            defaultValue={query}
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} {query ? `for "${query}"` : ""}
        </h2>
        {jobs.length > 0 ? (
          <JobList jobs={jobs} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your search criteria.</p>
            <Button variant="link" onClick={() => window.history.back()}>
              Go back
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
