import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { headers } from "next/headers";
// import logger from "@/utils/logger";

// async function getErrorParams() {
//   try {
//     const headersList = await headers();
//     const referer = headersList.get("referer") || "";

//     try {
//       const url = new URL(referer);
//       return {
//         resource: url.searchParams.get("resource") || "Post",
//         id: url.searchParams.get("id") || "",
//         message: url.searchParams.get("message") || "",
//       };
//     } catch {
//       return { resource: "Post", id: "", message: "" };
//     }
//   } catch (error) {
//     logger.error("Error getting error params:", error);
//     return { resource: "Post", id: "", message: "" };
//   }
// }

export default async function NotFound() {
  // const { resource, id, message } = await getErrorParams();
  const resource = "Post";
  const id = "";
  const message = "The post could not be found.";
  const displayMessage =
    message ||
    `The ${resource.toLowerCase()}${id ? ` with ID "${id}"` : ""} could not be found.`;

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
            {resource} Not Found
          </h2>

          {displayMessage && (
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              {displayMessage}
            </p>
          )}

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
