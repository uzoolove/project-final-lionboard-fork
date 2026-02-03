import GuideNav from "./_components/GuideNav";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 container mx-auto mt-10 p-4 transition-color">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Side Menu */}
        <aside className="w-full md:w-64 shrink-0">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700">개발 가이드</h2>
            <GuideNav />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="min-h-[400px]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
