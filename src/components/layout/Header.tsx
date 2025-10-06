import { Search, ShoppingCart, Bell, User, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold text-[#1A1A1A]">Botscript</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/catalog" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Catalogue
              </Link>
              <Link to="/discord" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Discord
              </Link>
              <Link to="/chrome" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Chrome
              </Link>
              <Link to="/twitch" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Twitch
              </Link>
            </nav>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des bots, extensions..."
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile?.user_type === 'seller' && (
              <Link to="/dashboard/seller">
                <Button variant="secondary" className="hidden md:block" size="small">
                  Tableau de bord
                </Button>
              </Link>
            )}

            <button className="p-2 text-[#4A4A4A] hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>

            <button className="p-2 text-[#4A4A4A] hover:bg-[#F9FAFB] rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-[#4A4A4A] hover:bg-[#F9FAFB] rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-2">
                    <div className="px-4 py-2 border-b border-[#E5E7EB]">
                      <div className="font-semibold text-[#1A1A1A]">{profile?.username}</div>
                      <div className="text-sm text-[#9CA3AF]">{profile?.user_type}</div>
                    </div>
                    <Link
                      to={profile?.user_type === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'}
                      className="block px-4 py-2 text-[#4A4A4A] hover:bg-[#F9FAFB] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button size="small">Connexion</Button>
              </Link>
            )}

            <button
              className="md:hidden p-2 text-[#4A4A4A] hover:bg-[#F9FAFB] rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] py-4">
            <nav className="flex flex-col gap-4">
              <Link to="/catalog" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Catalogue
              </Link>
              <Link to="/discord" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Discord
              </Link>
              <Link to="/chrome" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Chrome
              </Link>
              <Link to="/twitch" className="text-[#4A4A4A] hover:text-[#0066FF] transition-colors">
                Twitch
              </Link>
              {profile?.user_type === 'seller' && (
                <Link to="/dashboard/seller">
                  <Button variant="secondary" size="small" className="w-full mt-2">
                    Tableau de bord
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
