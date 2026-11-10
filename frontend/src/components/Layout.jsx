import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      {/* Top bar — minimal, phone-sized */}
      <header className="bg-brand text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Roshan Rozgar</span>
          <span className="text-sm opacity-80 urdu">روشن روزگار</span>
        </div>
        {/* TODO: User avatar / logout */}
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4">
        <Outlet />
      </main>

      {/* Bottom nav — mobile-first */}
      <nav className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
        {/* TODO: Nav items based on role */}
      </nav>
    </div>
  );
}
