import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const NitroganLogo = () => (
  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="size-8 text-primary">
    <g clipPath="url(#clip0_6_330)">
      <path
        clipRule="evenodd"
        d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_6_330">
        <rect fill="white" height="48" width="48" />
      </clipPath>
    </defs>
  </svg>
);

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-20">
      <div className="flex items-center gap-3">
        <NitroganLogo />
        <h2 className="text-xl font-bold tracking-tight">Nitrogan</h2>
      </div>

      <nav className="hidden md:flex items-center gap-10">
        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Product</Link>
        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Solutions</Link>
        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Resources</Link>
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/sign-in" className="hidden sm:flex text-sm font-bold hover:text-primary transition-colors px-4 py-2">
          Log In
        </Link>
        <Link href="/sign-up" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-bold transition-all shadow-lg shadow-primary/20">
          Get a Demo
        </Link>
      </div>
    </header>
  );
}
