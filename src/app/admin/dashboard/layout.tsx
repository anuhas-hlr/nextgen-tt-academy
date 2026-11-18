import { AdminSidebar } from '@/components/admin';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#F5F7FB]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
