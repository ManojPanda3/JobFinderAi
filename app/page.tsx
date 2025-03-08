import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, ArrowRight } from "lucide-react"
import JobList from "@/components/job-list"
import { fetcheJobs } from "@/lib/data"

export default async function Home() {
  const jobs = fetcheJobs();
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Dream Job & <span className="text-primary">Learn</span> the Skills You Need
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover thousands of job opportunities and learn the skills required to succeed with our AI-powered
            learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button size="lg" asChild className="flex-1">
              <Link href="/jobs">
                <Search className="mr-2 h-5 w-5" />
                Find Jobs
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="flex-1">
              <Link href="/ai">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn Skills
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-muted py-8 px-6 rounded-lg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Search for Jobs</h2>
          <form className="flex flex-col sm:flex-row gap-4" action="/jobs" method="GET">
            <Input name="q" placeholder="Job title, company, or skill..." className="flex-1" />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Jobs</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/jobs" className="flex items-center">
              View all jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <JobList jobs={jobs.slice(0, 4)} />
      </section>

      {/* Skills Section */}
      <section className="bg-primary/5 py-10 px-6 rounded-lg">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Learn In-Demand Skills with AI</h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered learning platform helps you master the skills employers are looking for. Click on any skill
            in a job listing to start learning.
          </p>
          <Button size="lg" asChild>
            <Link href="/ai">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

