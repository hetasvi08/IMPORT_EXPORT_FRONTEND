import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title, description, icon }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <i className={`fas ${icon || 'fa-tools'} text-4xl text-slate-600`}></i>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-3">
          {title || 'Coming Soon'}
        </h1>
        
        <p className="text-slate-600 mb-8">
          {description || 'This feature is currently under development and will be available soon.'}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
          >
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            <i className="fas fa-info-circle mr-2"></i>
            This page is planned for the next development phase
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
