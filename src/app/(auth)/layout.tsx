export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="bg-grey h-screen flex flex-col">{children}</main>;
}
