import { Badge } from "@/components/ui/badge";

export default function BlogHeader() {
  return (
    <div className="relative mb-12 overflow-hidden pb-8 pt-16">
      {/* Subtle background with minimal noise texture */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Subtle gradient accent */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
      />

      {/* Content */}
      <div className="relative container mx-auto px-6">
        <Badge variant="primary" size="sm" className="mb-4">
          Insights & Thoughts
        </Badge>

        <h1 className="serif-heading mb-3 text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Personal Blog
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Exploring ideas, sharing knowledge, and documenting my journey through
          technology, design, and creative expression.
        </p>
      </div>
    </div>
  );
}
