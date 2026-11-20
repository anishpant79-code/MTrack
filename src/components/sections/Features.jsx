
import {
  ShieldCheck,
  SearchCheck,
  BrainCircuit,
  Filter,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    number: '01',
    title: 'Information Verification',
    description:
      'Evaluate financial claims against available evidence and identify information that needs further verification.',
    points: ['Evidence-based evaluation', 'Claim verification'],
  },
  {
    icon: SearchCheck,
    number: '02',
    title: 'Source Credibility',
    description:
      'Explore the origins of financial information and understand the credibility of its sources.',
    points: ['Original source tracking', 'Source assessment'],
  },
  {
    icon: BrainCircuit,
    number: '03',
    title: 'AI-Powered Analysis',
    description:
      'Turn complicated financial updates into clear explanations that are easier to understand.',
    points: ['Simplified explanations', 'Contextual insights'],
  },
  {
    icon: Filter,
    number: '04',
    title: 'Smart Noise Filtering',
    description:
      'Focus on relevant financial information instead of getting overwhelmed by rumours and unnecessary updates.',
    points: ['Relevant information', 'Less information overload'],
  },
]

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 shadow-2xs">
            What MTrack AI offers
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Financial information,
            <span className="block text-blue-600 mt-1">
              made easier to understand.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Don't just consume financial information.
            Understand it, question it and evaluate the evidence
            before drawing conclusions.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.number}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                {/* Decorative background */}
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon and number */}
                <div className="relative flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-300 group-hover:bg-blue-600 shadow-2xs">
                    <Icon className="h-6 w-6 text-blue-600 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <span className="text-sm font-bold tracking-wider text-slate-300">
                    {feature.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative mt-7 flex-1">
                  <h3 className="text-lg font-bold leading-snug text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>

                {/* Supporting points */}
                <div className="relative mt-6 space-y-2.5 border-t border-slate-100 pt-5">
                  {feature.points.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span className="text-xs font-medium text-slate-600">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom indicator */}
                <div className="relative mt-6 flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-blue-600">
                    Explore feature
                  </span>

                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
              </article>
            )
          })}
        </div>

        {/* Bottom message */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Built around clarity, source awareness and evidence-first thinking.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Features
