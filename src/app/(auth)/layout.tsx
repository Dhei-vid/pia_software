export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="h-screen flex flex-col">{children}</main>;
}
