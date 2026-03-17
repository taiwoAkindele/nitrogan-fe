import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-primary opacity-5" />
      <div className="max-w-4xl mx-auto relative text-center bg-slate-900 rounded-[2.5rem] p-12 lg:p-20 border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
          Ready to find your next major account?
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          Join the world&apos;s most innovative sales teams using Nitrogan to scale their revenue
          through intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-10 py-5 font-bold text-lg transition-all">
            Book Your Free Demo
          </Link>
          <Link href="#" className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-10 py-5 font-bold text-lg backdrop-blur-sm transition-all border border-white/10">
            Contact Sales
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/40">No credit card required. Setup in minutes.</p>
      </div>
    </section>
  );
}
