"use client"
import { fetcheJobs, searchJobs } from '@/lib/data';
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, MapPin, Clock, DollarSign, ArrowLeft, PhoneCall, LoaderIcon } from "lucide-react"
import Link from "next/link"
import NotFound from '@/app/not-found';

const JobsClient = ({ jobId }: { jobId: string }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true)
  const [jobNotFound, setNotFound] = useState<boolean>(false)
  useEffect(() => {
    const data = fetcheJobs()
    // searchJobs("", jobId)
    //   .then((job) => {
    //     if (job.length) {
    //       setJob(job[0])
    //       setLoading(false)
    //     }
    //   })
    const datas = data.filter(n => n.id == jobId)
    if (!datas?.length) {
      setNotFound(true)
      console.log(datas)
    } else {
      setJob(datas[0] || {})
    }
    setLoading(false)
  }, [jobId]);
  if (loading) return <LoaderIcon className="animate-spin -translate-1/2 absolute top-1/2 left-1/2 -translate-1/2" />
  if (jobNotFound) return NotFound()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <Button
          variant="secondary"
          asChild
        >
          <Link href={`/interview/${job?.id}`}>
            <PhoneCall className="mr-2 h-4 w-4" />
            Prepare for Interview
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{job?.title}</h1>
            <p className="text-xl text-muted-foreground">{job?.company}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{job?.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{job?.type}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
              {/* job?.salary?.min && ( */}
              {/*   <span>{job.salary.min}-{job.salary.max} {job.salary.currency} per {job.salary.period}</span>) */}
              <span>{job?.salary} </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Posted {job?.posted}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold mb-4">About the Role</h2>
            <div className="mb-6 text-sm" dangerouslySetInnerHTML={{ __html: job?.description }} />

            <h3 className="text-lg font-semibold mb-3">Responsibilities:</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              {job?.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3">Requirements:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {job?.requirements.map((skill) => (
                <Link href={`/ai?skill=${encodeURIComponent(skill)}`} key={skill}>
                  <Badge className="hover:bg-primary/10 cursor-pointer transition-colors">{skill}</Badge>
                </Link>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Want to learn these skills?</p>
              <p className="text-sm text-muted-foreground mb-4">
                Click on any skill above to start learning with our AI-powered platform.
              </p>
              <Button asChild>
                <Link href="/ai">Start Learning</Link>
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      <div className="bg-primary/5 p-6 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to Apply?</h2>
        <p className="text-muted-foreground mb-4">
          This is a demo application. In a real job board, you would be able to apply for this position.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button>Apply Now</Button>
          <Button variant="outline">Save Job</Button>
          <Button
            variant="secondary"  // Use a distinct variant for the interview button
            asChild
          >
            <Link href={`/interview/${job?.id}`}>
              <PhoneCall className="mr-2 h-4 w-4" /> {/* Add the icon */}
              Prepare for Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )

}

export default JobsClient 
