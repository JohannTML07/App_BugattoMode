import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa] selection:bg-yellow-200 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-full">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
