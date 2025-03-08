import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BriefcaseBusiness, Search, BookOpen } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BriefcaseBusiness className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">JobSkill</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
            Jobs
          </Link>
          <Link href="/ai" className="text-sm font-medium hover:text-primary transition-colors">
            Learn Skills
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/jobs">
              <Search className="h-4 w-4 mr-2" />
              Find Jobs
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ai">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn Skills
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

