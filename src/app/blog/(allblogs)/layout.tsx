export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="max-w-4xl mx-auto">{children}</div>;
}
