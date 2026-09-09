import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import nexarionLogo from '../../assets/nexarion_logo.png';

const SupplierDashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/supplier/dashboard',
      icon: 'fas fa-home',
      label: 'Dashboard',
      end: true
    },
    {
      path: '/supplier/products',
      icon: 'fas fa-box',
      label: 'My Products'
    },
    {
      path: '/supplier/products/create',
      icon: 'fas fa-plus-circle',
      label: 'Add Product'
    },
    {
      path: '/supplier/orders',
      icon: 'fas fa-shopping-cart',
      label: 'Orders'
    },
    {
      path: '/supplier/profile',
      icon: 'fas fa-user-circle',
      label: 'Profile'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Supplier Portal</h1>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Help Section */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                  <i className="fas fa-question-circle text-blue-600 text-2xl mb-2"></i>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Need Help?</h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Check our supplier guidelines and FAQs
                  </p>
                  <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                    View Guidelines
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardLayout;
