import Header from "../../components/general/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      <div className={"bg-grey min-h-screen"}>{children}</div>
    </main>
  );
}
