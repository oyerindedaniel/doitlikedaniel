import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-lg border border-slate-200 bg-white/50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <svg
                className="h-6 w-6 text-slate-500 dark:text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
            Post Not Found
          </h2>

          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <Button variant="gradient" asChild>
            <Link href="/blog" className="inline-flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
