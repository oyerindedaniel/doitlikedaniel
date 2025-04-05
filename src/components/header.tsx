"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggler } from "@/components/theme-toggler";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <header className="bg-background">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
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
          <ThemeToggler />
        </nav>
      </div>
    </header>
  );
}
