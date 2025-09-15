import Header from "../../components/general/header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden bg-grey">{children}</div>
    </main>
  );
}
