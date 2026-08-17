import Link from "next/link";
import { Brand } from "@/components/Logo";
import { Button, Card } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";

const journey = [
  {
    label: "01",
    title: "Scheduled departure",
    body: "At the scheduled dose time, Amigo leaves the charging dock on its own — no one has to push a button.",
  },
  {
    label: "02",
    title: "Line-following through the ward",
    body: "An infrared line-follower guides Amigo down the corridor, staying on track through turns and junctions.",
  },
  {
    label: "03",
    title: "RFID stop at the bed",
    body: "At the right bedside, Amigo stops and reads the RFID tag fixed to the bed frame to confirm whose medicine it's carrying.",
  },
  {
    label: "04",
    title: "Instant staff notification",
    body: "The moment the tag is read, the ward dashboard lights up: which bed, which patient, which medicine, right now.",
  },
  {
    label: "05",
    title: "Confirmed handoff",
    body: "A nurse confirms the handoff in a tap, the patient sees it in their own portal, and Amigo heads back to dock.",
  },
];

const staffFeatures = [
  "Secure staff login",
  "Patient registration & bed / RFID assignment",
  "Medicine scheduling & prescription management",
  "One-tap delivery requests to Amigo",
  "Live robot status — idle, delivering, returning",
  "Full delivery history & patient search",
  "Daily statistics dashboard",
];

const patientFeatures = [
  "Secure patient login",
  "Medicine schedule at a glance",
  "Prescription history",
  "Real-time delivery notifications",
  "Delivery history",
  "Simple profile management",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1317] transition-colors">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Brand />
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Log in
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-rise">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-950/60 px-3.5 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="status-dot h-1.5 w-1.5 bg-amber-400 rounded-full" />
              </span>
              Line-following delivery robot, live in ward
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink dark:text-slate-100 sm:text-5xl">
              The medicine reaches the right bed.
              <span className="text-teal-500 dark:text-teal-400"> Every time, on time.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-650 dark:text-slate-400">
              Amigo is a friendly line-following robot that carries medicine through
              hospital and elderly-care wards on a schedule, confirms the bed with an
              RFID tag, and lets staff and patients follow every handoff from this
              website.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login">
                <Button size="md">Staff login →</Button>
              </Link>
            </div>
          </div>

          <Card className="relative overflow-hidden p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-650/70 dark:text-slate-400">
              Live from Ward A
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-display text-2xl font-semibold text-ink dark:text-slate-100">Bed 07</p>
                <p className="text-sm text-slate-650 dark:text-slate-400">Rehana Begum · Metformin 850mg</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-xs font-medium text-amber-500 dark:text-amber-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="status-dot h-1.5 w-1.5 bg-amber-400 rounded-full" />
                </span>
                En route
              </span>
            </div>
            <div className="mt-6 h-px w-full bg-teal-900/5 dark:bg-slate-800/80" />
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-650 dark:text-slate-400">
                <span>Left dock</span>
                <span className="font-mono text-xs">09:58:02</span>
              </div>
              <div className="flex items-center justify-between text-slate-650 dark:text-slate-400">
                <span>Following line — Corridor 2</span>
                <span className="font-mono text-xs">09:58:41</span>
              </div>
              <div className="flex items-center justify-between font-medium text-ink dark:text-slate-200">
                <span>RFID scan pending at Bed 07</span>
                <span className="font-mono text-xs text-amber-500 dark:text-amber-400">now</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-teal-900/5 dark:border-slate-800/80 bg-mist dark:bg-[#0E171B] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-semibold text-ink dark:text-slate-100">
            How Amigo gets there
          </h2>
          <p className="mt-3 max-w-2xl text-slate-650 dark:text-slate-400">
            Five real steps — from the charging dock to a confirmed handoff — mirrored
            exactly by what happens on this website.
          </p>

          <div className="relative mt-14">
            <div className="absolute left-[15px] top-2 hidden h-[calc(100%-2rem)] w-px sm:block bg-teal-900/10 dark:bg-slate-800" />
            <ol className="grid gap-10 sm:grid-cols-1 sm:gap-8">
              {journey.map((step, i) => (
                <li key={step.label} className="relative flex gap-5 sm:pl-0">
                  <div className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-500 font-mono text-xs font-medium text-white shadow-sm ring-4 ring-mist dark:ring-[#0E171B]">
                    {i + 1}
                  </div>
                  <div className="pb-2">
                    <p className="font-display text-lg font-medium text-ink dark:text-slate-100">{step.title}</p>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-650 dark:text-slate-400">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-ink dark:text-slate-100">
          Built for two people in the room
        </h2>
        <p className="mt-3 max-w-2xl text-slate-650 dark:text-slate-400">
          One dashboard for the people running the ward, one simple portal for the
          person waiting on their medicine.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-7">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-600 dark:text-teal-400">
              Hospital staff
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ink dark:text-slate-100">
              Run the ward from one screen
            </h3>
            <ul className="mt-5 space-y-3">
              {staffFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-650 dark:text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-teal-500" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-7">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-500 dark:text-amber-400">
              Patients
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ink dark:text-slate-100">
              Know exactly what's coming, and when
            </h3>
            <ul className="mt-5 space-y-3">
              {patientFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-650 dark:text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-amber-400" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-teal-700 dark:bg-teal-900 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">
              Ready to see the ward dashboard?
            </h2>
            <p className="mt-2 text-teal-100">
              Log in with a staff or patient account to explore Amigo.
            </p>
          </div>
          <Link href="/login">
            <Button size="md" className="bg-white text-teal-700 hover:bg-teal-50 dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-slate-800">
              Log in now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-650/70 dark:text-slate-500">
        Amigo — Hospital &amp; Elderly Care Management System.
      </footer>
    </main>
  );
}
