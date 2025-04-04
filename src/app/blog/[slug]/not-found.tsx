import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
      <p className="text-lg mb-8">
        The blog post you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        href="/blog"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  );
}
