import Link from "next/link";
import { Globe, AtSign, Users } from "lucide-react";

const NitroganLogo = () => (
  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="size-6 text-primary">
    <path
      clipRule="evenodd"
      d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const footerLinks = [
  {
    heading: "Product",
    links: ["Platform", "Signals", "Integrations", "API"],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Blog", "Press"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "Case Studies", "Privacy", "Terms"],
  },
  {
    heading: "Contact",
    links: ["Support", "Sales", "Newsletter"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6 lg:px-20 bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <NitroganLogo />
            <h2 className="text-xl font-bold tracking-tight">Nitrogan</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            The intelligence layer for modern sales organizations. Scale smarter, not harder.
          </p>
        </div>

        {footerLinks.map(({ heading, links }) => (
          <div key={heading}>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-muted-foreground">
              {heading}
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {links.map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs">© 2024 Nitrogan Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Globe className="size-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <AtSign className="size-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Users className="size-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
