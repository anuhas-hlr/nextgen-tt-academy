import { PublicLayout } from '@/components/public';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FB]">
      <PublicLayout>{children}</PublicLayout>
    </div>
  );
}
