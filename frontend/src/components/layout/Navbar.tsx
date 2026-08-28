import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const publicNavItems = [{ label: "Home", path: ROUTES.HOME }];

const authedNavItems = [
  { label: "Dashboard", path: ROUTES.DASHBOARD },
  { label: "AI chat", path: ROUTES.CHAT },
  { label: "Create Trip", path: ROUTES.CREATE_TRIP },
];

const guestNavItems = [
  { label: "Login", path: ROUTES.LOGIN },
  { label: "Signup", path: ROUTES.SIGNUP },
];

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // While the session is still being resolved, show only what's true either way.
  const navItems = [
    ...publicNavItems,
    ...(isLoading ? [] : isAuthenticated ? authedNavItems : guestNavItems),
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <nav className="sticky left-0 right-0 top-0 z-50 bg-blue-900 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="text-lg font-bold text-white sm:text-xl"
           style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
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
                  : "text-foreground transition-colors hover:text-blue-500"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <div className="flex items-center gap-4 border-l border-white/30 pl-6">
              <span className="text-sm text-white/90">{user?.fullName}</span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-white/40 px-3 py-1 text-sm text-white transition-colors hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}
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
                {isAuthenticated && (
                  <span className="text-sm font-medium">{user?.fullName}</span>
                )}

                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "font-semibold" : "text-muted-foreground"
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-left text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Logout
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
