import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="font-serif text-5xl font-bold tracking-tight">Academix</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Get smarter by exploring scientific papers
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
      >
        Get Started
      </Link>
    </main>
  )
}
