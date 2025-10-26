export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-grey flex flex-col">
      <div className="min-h-screen">{children}</div>
    </main>
  );
}
