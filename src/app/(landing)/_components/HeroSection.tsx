import Image from "next/image";

const avatars = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAYEC5yzpEZC1_uUV3q7I205wIAe2UgIIBEYKQxwKQdvD-WkTNu93X4WGnWaApwJZGiQ-L92hFD5_MrNKg8Jq3q3jE62RmJVAGOLZh0PQyDrrh1-l_W7wL3DQO0SQlN_AUSCTthq9hX5Dcxty9FhqZotQCH0DB0B2-aOFCjgMMOLIG0BESord4kxar6p6IiUp8esrJbjFsjE6DszYzjIlrkIZSMi4J8yW0ND9m0z-PqqApsYVCTEfDEwB9HdgSSlZuL9lPmdNEIus",
    alt: "Client profile picture female professional",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCogYvEfHpWpsaULlJWLqg97_u0GU8TEgEe1Xj9VADDjB__sgBc7fEbaPzwFzu_8v7Jusz-m6pPY4OyCXzS23AUOt1XXL2Lp945TGWCYKKne0r-8ZD6PcL0LlnpGgrf3ikaJhDQVyWXY95Nfwbc5w1scilCygF3L7WZtPLYD7UhKLnTP1-rTpvTo962xyqIu1CG7G6G6T_cKIi7yll-5OCMqNA5yeHjaDHodUEURH2Gu8QsiGwMoLsHUJS9dYs4SXQ9RGuWY3LQg_k",
    alt: "Client profile picture male professional",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD85_FbE92hGYttJUUAry3IC3NOQDpmcEPDezAXtRBU647fTh1wklEKVFW4rXST99Pv1RAAj66vVaOKmHo_m9Y3-lMWsFc12CJrnBFoZCvVJDtLzS7B20c_MVdT6I_7nMNIiqz28yqzUElFLvu6HUYWTNqeGVEvvQ9to0EnM4P91EEDkWyKaT6oPc-n2M6ZeVlRshIsMVlg0SouMEKtynFrxHuYbD8CwESh3K752l9HgZcrWvGIfiBTh9iDxB-pmghGxW0gH3pKAZU",
    alt: "Client profile picture female manager",
  },
];

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Next-Gen Discovery</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
            Transform Market Signals into{" "}
            <span className="text-primary">Actionable Leads</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            Nitrogan is the B2B discovery engine that decodes global market data to find your next
            high-value customer before the competition even knows they exist.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 py-4 font-bold text-lg transition-all shadow-xl shadow-primary/25">
              Book a Demo
            </button>
            <button className="bg-secondary hover:bg-secondary/80 rounded-lg px-8 py-4 font-bold text-lg transition-all">
              View Solutions
            </button>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex -space-x-3">
              {avatars.map((avatar) => (
                <Image
                  key={avatar.alt}
                  src={avatar.src}
                  alt={avatar.alt}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">Trusted by 500+ sales teams globally</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-muted border border-border rounded-2xl p-4 shadow-2xl">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUoboeZVpkyzUN9ftAqd9q0KDB4mHliQDICakbb9-MpVcxYEf5JjaHJ2d8Rkn6lgLZJxlXzr9js1KTY_p0jwCQZZUGu3esYMYHBQqWY5ykdsIKdlQA8934oJrezmfGrHjAFac8Kgd7BIMTLPlYcwmqRFxesH4Kx2QXFAT4wgI0ofEeB4_lsMMqaEH38LpfEmdxc7k1Ks5-lTd6XfOJ0AGH1qEKDZBZ0uhuCzQ5QuWrISsHYD7jU-oPH36ETfAVhYvlxs9OQ7SW9_c"
              alt="Dashboard showing sales intelligence and analytics charts"
              width={800}
              height={450}
              className="rounded-xl w-full h-full object-cover aspect-video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
