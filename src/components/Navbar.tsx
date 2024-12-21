"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Ajouter un cours", href: "/", icon: HomeIcon },
  { name: "Liste des cours", href: "/cours", icon: BookOpenIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">Gestion des Cours</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              pathname === item.href
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100",
              "flex items-center gap-4 px-4 py-3 rounded-md text-sm"
            )}
          >
            <item.icon
              className={classNames(
                pathname === item.href ? "text-indigo-600" : "text-gray-400",
                "h-6 w-6"
              )}
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
