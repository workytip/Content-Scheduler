import { useState, useEffect, useContext } from 'react'; // <-- add useContext
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // <-- import AuthContext

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout , user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Logo and Home Link */}
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <img 
                  src = "/assets/logo.png"
                  alt="Logo" 
                  className="h-8 w-8 mr-2"
                />
                <span className="font-semibold text-gray-500 text-lg">Content Scheduler</span>
              </Link>
            </div>
            {/* Primary Nav */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                Services
              </Link>
            </div>
          </div>
          
          {/* Secondary Nav */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center text-gray-500 hover:text-blue-500"
                >
                  <img 
                    src="/assets/profile.png" 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <span>{user ? user.name : ''}</span>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:text-blue-500 transition duration-300"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="outline-none mobile-menu-button"
            >
              <svg 
                className="w-6 h-6 text-gray-500 hover:text-blue-500"
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50"
          >
            About
          </Link>
          <Link 
            to="/services" 
            className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50"
          >
            Services
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link 
                to="/profile" 
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-500 hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2 text-base font-medium text-white bg-blue-500 rounded hover:bg-blue-400"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;