import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { LogOut, LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CHS Rate" className="h-9 w-9" />
          <span className="text-xl font-bold text-primary">CHS Rate</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Dashboard</Link>
                {user.isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Admin Panel</Link>}
                <button onClick={handleLogout} className="text-left text-sm font-medium text-destructive">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
