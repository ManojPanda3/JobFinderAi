import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react"
import type { Job } from "@/lib/data"

interface JobListProps {
  jobs: Job[]
}

export default function JobList({ jobs }: JobListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-muted-foreground">{job.company}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  {job.type}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {job.posted}
                </div>
              </div>

              <p className="text-sm">{job.description}</p>

              <div>
                <p className="text-sm font-medium mb-2">Key Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, 4).map((skill) => (
                    <Link href={`/ai?skill=${encodeURIComponent(skill)}`} key={skill}>
                      <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer transition-colors">
                        {skill}
                      </Badge>
                    </Link>
                  ))}
                  {job.requirements.length > 4 && <Badge variant="outline">+{job.requirements.length - 4} more</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 px-6 py-3">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href={`/jobs/${job.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

