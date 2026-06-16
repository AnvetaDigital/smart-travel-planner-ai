import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Home", path: ROUTES.HOME },
  { label: "Login", path: ROUTES.LOGIN },
  { label: "Signup", path: ROUTES.SIGNUP },
];

export default function Navbar() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="text-lg font-bold text-white sm:text-xl"
        >
          Smart Travel Planner
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-white"
                  : "text-white/80 transition-colors hover:text-white"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open Menu"
                className="rounded-md p-2 text-white"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "font-semibold"
                        : "text-muted-foreground"
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}