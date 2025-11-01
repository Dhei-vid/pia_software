"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Header from "../../components/general/header";
import MainLayout from "../../components/layouts/main-layout";
import LoadingSpinner from "../../components/ui/loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="md" className="text-white" />
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden bg-grey">
        <MainLayout>{children}</MainLayout>
      </div>
    </main>
  );
}
