import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Button Component Examples</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Standard Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Custom Animation Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="gradient">Gradient Button</Button>
            <Button variant="animated">Animated Underline</Button>
            <Button variant="ripple">Ripple Effect</Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small Button</Button>
            <Button size="default">Default Size</Button>
            <Button size="lg">Large Button</Button>
            <Button size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">With Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              leftElement={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              }
            >
              Left Icon
            </Button>

            <Button
              rightElement={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              }
            >
              Right Icon
            </Button>

            <Button
              variant="outline"
              leftElement={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 12-4 4-4-4" />
                  <path d="M12 8v8" />
                </svg>
              }
              rightElement={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            >
              Both Icons
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Full Width</h2>
          <Button fullWidth={true} variant="gradient">
            Full Width Button
          </Button>
        </section>
      </div>
    </div>
  );
}
