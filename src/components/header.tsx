"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-background">
      <div className="mx-auto px-6 py-4 flex justify-between items-center">
        {/* <Link href="/" className="text-xl font-bold">
          Daniel
        </Link> */}

        <nav className="ml-auto text-sm flex items-center gap-6">
          <ul className="flex gap-6">
            {/* <li>
              <Link
                href="/"
                className={`hover:text-blue-600 transition-colors ${
                  isActive("/") && !isActive("/blog")
                    ? "text-blue-600 font-medium"
                    : ""
                }`}
              >
                Home
              </Link>
            </li> */}

            <li>
              <Link
                href="/blog"
                className={`transition-colors ${
                  isActive("/blog") ? "font-medium underline" : ""
                }`}
              >
                Blog
              </Link>
            </li>
            {/* <li>
              <Link
                href="/about"
                className={`hover:text-blue-600 transition-colors ${
                  isActive("/about") ? "text-blue-600 font-medium" : ""
                }`}
              >
                About
              </Link>
            </li> */}
            {/* <li>
              <Link
                href="/contact"
                className={`hover:text-blue-600 transition-colors ${
                  isActive("/contact") ? "text-blue-600 font-medium" : ""
                }`}
              >
                Contact
              </Link>
            </li> */}
          </ul>
          <div className="flex items-center gap-3">
            <Button asChild variant="gradient" className="h-9 w-9">
              <Link href={siteConfig.social.github}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github-icon lucide-github w-4 h-4"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Link>
            </Button>
            <ThemeToggler />
          </div>
        </nav>
      </div>
    </header>
  );
}
