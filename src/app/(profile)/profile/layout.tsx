export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={"h-full"}>{children}</main>;
}
