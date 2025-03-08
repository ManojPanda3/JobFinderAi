export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary: string
  posted: string
  description: string
  requirements: string[]
  responsibilities: string[]
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    posted: "2 days ago",
    description:
      "We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.",
    requirements: ["React", "JavaScript", "TypeScript", "CSS", "Responsive Design", "Git"],
    responsibilities: [
      "Develop and maintain user interfaces using React",
      "Collaborate with designers to implement UI/UX designs",
      "Write clean, maintainable, and efficient code",
      "Optimize applications for maximum speed and scalability",
      "Participate in code reviews and team discussions",
    ],
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    posted: "1 week ago",
    description: "Join our backend team to build scalable and efficient server-side applications.",
    requirements: ["Node.js", "Express", "MongoDB", "RESTful APIs", "SQL", "Docker"],
    responsibilities: [
      "Design and implement backend services and APIs",
      "Optimize database queries and data structures",
      "Ensure high performance and responsiveness of applications",
      "Collaborate with frontend developers to integrate user-facing elements",
      "Implement security and data protection measures",
    ],
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Remote",
    type: "Remote",
    salary: "$95,000 - $130,000",
    posted: "3 days ago",
    description: "Looking for a versatile Full Stack Developer to work on all aspects of our web applications.",
    requirements: ["React", "Node.js", "JavaScript", "MongoDB", "AWS", "CI/CD"],
    responsibilities: [
      "Develop both frontend and backend components of web applications",
      "Implement responsive design and ensure cross-browser compatibility",
      "Design and implement database schemas and server-side logic",
      "Deploy and maintain applications in cloud environments",
      "Troubleshoot and debug applications",
    ],
  },
  {
    id: "4",
    title: "UI/UX Designer",
    company: "CreativeMinds",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    posted: "5 days ago",
    description: "Join our design team to create beautiful and intuitive user interfaces for our products.",
    requirements: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "UI Design"],
    responsibilities: [
      "Create user flows, wireframes, and prototypes",
      "Conduct user research and usability testing",
      "Design intuitive and visually appealing interfaces",
      "Collaborate with developers to implement designs",
      "Stay updated with the latest design trends and best practices",
    ],
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    posted: "1 day ago",
    description: "We need a skilled DevOps Engineer to help us automate and optimize our infrastructure.",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
    responsibilities: [
      "Design and implement CI/CD pipelines",
      "Manage cloud infrastructure using Infrastructure as Code",
      "Monitor system performance and troubleshoot issues",
      "Implement security best practices",
      "Collaborate with development teams to improve deployment processes",
    ],
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    posted: "4 days ago",
    description: "Join our data science team to extract insights from complex datasets and build predictive models.",
    requirements: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistics", "TensorFlow"],
    responsibilities: [
      "Analyze large datasets to extract actionable insights",
      "Develop and implement machine learning models",
      "Create data visualizations to communicate findings",
      "Collaborate with product teams to implement data-driven solutions",
      "Stay updated with the latest research and techniques in data science",
    ],
  },
  {
    id: "7",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Los Angeles, CA",
    type: "Contract",
    salary: "$90 - $120 per hour",
    posted: "1 week ago",
    description: "We are looking for a Mobile Developer to build and maintain high-quality mobile applications.",
    requirements: [
      "React Native",
      "iOS Development",
      "Android Development",
      "JavaScript",
      "Mobile UI Design",
      "API Integration",
    ],
    responsibilities: [
      "Develop cross-platform mobile applications using React Native",
      "Ensure the performance and quality of applications",
      "Collaborate with the design team to implement user interfaces",
      "Integrate with backend services and APIs",
      "Publish applications to app stores",
    ],
  },
  {
    id: "8",
    title: "Product Manager",
    company: "InnovateTech",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    posted: "3 days ago",
    description: "Join our product team to lead the development of innovative software products.",
    requirements: [
      "Product Management",
      "Agile Methodologies",
      "User Stories",
      "Market Research",
      "Data Analysis",
      "Technical Background",
    ],
    responsibilities: [
      "Define product vision, strategy, and roadmap",
      "Gather and prioritize product requirements",
      "Work closely with engineering, design, and marketing teams",
      "Analyze market trends and competition",
      "Make data-driven decisions to improve products",
    ],
  },
]

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id)
}

export function searchJobs(query: string): Job[] {
  if (!query) return jobs

  const lowercaseQuery = query.toLowerCase()
  return jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(lowercaseQuery) ||
      job.company.toLowerCase().includes(lowercaseQuery) ||
      job.location.toLowerCase().includes(lowercaseQuery) ||
      job.description.toLowerCase().includes(lowercaseQuery) ||
      job.requirements.some((req) => req.toLowerCase().includes(lowercaseQuery)),
  )
}

