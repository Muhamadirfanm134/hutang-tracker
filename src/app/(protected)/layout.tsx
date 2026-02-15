import NavigationBar from "@/components/(design-systems)/navigationBar";
import ProtectedPage from "@/features/auth/components/protected-page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <ProtectedPage>
        {children}
        <NavigationBar />
      </ProtectedPage>
    </main>
  );
}
