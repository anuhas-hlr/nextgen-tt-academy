import { AdminSidebar } from '@/components/admin';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#F5F7FB]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
