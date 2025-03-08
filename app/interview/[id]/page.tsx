// app/interview/[id]/page.tsx
import { getJobById } from "@/lib/data";
import { notFound } from "next/navigation";
import InterviewUI from "@/components/InterviewUI";

export default function Interview({ params }: { params: { id: string } }) {
  // Get job data
  const job = getJobById(params.id);

  if (!job?.id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Interview Session</h1>
        <p className="text-xl text-muted-foreground mb-6">Position: {job.title}</p>
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <InterviewUI jobId={job.id} jobTitle={job.title} />
        </div>
      </div>
    </div>
  );
}
