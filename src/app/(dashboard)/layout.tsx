export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r">
        {/* Sidebar content */}
        <div className="p-4 border-b text-lg font-bold text-yellow-600">Bugatto Mode</div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
