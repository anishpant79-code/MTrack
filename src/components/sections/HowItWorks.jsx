
import {
  Inbox,
  Search,
  BrainCircuit,
  ChartNoAxesCombined,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Inbox,
    title: 'Collect Information',
    description:
      'Bring together financial news, market updates, social media claims and information from different sources.',
    detail: 'Gather information',
  },
  {
    number: '02',
    icon: Search,
    title: 'Verify Sources',
    description:
      'Trace information back to its original source and examine the credibility of the available evidence.',
    detail: 'Check credibility',
  },
  {
    number: '03',
    icon: BrainCircuit,
    title: 'Analyse Claims',
    description:
      'AI analyses financial claims, compares available evidence and identifies inconsistencies or missing context.',
    detail: 'Evaluate evidence',
  },
  {
    number: '04',
    icon: ChartNoAxesCombined,
    title: 'Present Insights',
    description:
      'Receive understandable explanations, supporting evidence and relevant insights to help make informed decisions.',
    detail: 'Understand insights',
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            How it works
          </span>

          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            From information overload
            <span className="block text-blue-600">
              to confident understanding.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            MTrack AI transforms scattered financial information
            into structured, evidence-based insights through
            a simple four-step process.
          </p>
        </div>

        {/* Process timeline */}
        <div className="relative mt-16 lg:mt-20">

          {/* Connecting line - desktop */}
          <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-blue-100 lg:block" />

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <article
                  key={step.number}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-7"
                >
                  {/* Step icon */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 transition-all duration-300 group-hover:border-blue-600 group-hover:bg-blue-600">
                      <Icon className="h-8 w-8 text-blue-600 transition-colors duration-300 group-hover:text-white" />
                    </div>

                    <span className="text-3xl font-bold tracking-tight text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  {/* Step content */}
                  <div className="mt-7 flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Step {index + 1}
                    </div>

                    <h3 className="text-xl font-bold leading-snug text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  {/* Step footer */}
                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-xs font-semibold text-slate-500">
                      {step.detail}
                    </span>

                    {index !== steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
                    )}

                    {index === steps.length - 1 && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Bottom information strip */}
        <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-6 sm:mt-16 sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <BrainCircuit className="h-6 w-6 text-blue-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-slate-900">
                Clarity at every step.
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Understand where information comes from, what the evidence
                says and what still needs verification.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
