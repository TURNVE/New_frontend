import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <span className="text-[120px] md:text-[180px] font-bold bg-gradient-to-b from-blue-500 to-blue-200 bg-clip-text text-transparent leading-none">
            404
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-10 max-w-md mx-auto">
          The page you're looking for might have been moved, doesn't exist, or you typed the URL incorrectly.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-5 py-3.5 bg-blue-600 text-white font-semibold rounded-xl 
                       hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 
                       shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       min-h-[52px] touch-manipulation"
          >
            <Home className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-y-0.5" />
            <span>Go Home</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-5 py-3.5 bg-white text-gray-700 font-semibold rounded-xl
                       border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]
                       transition-all duration-200
                       shadow-sm hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                       min-h-[52px] touch-manipulation"
          >
            <Compass className="w-5 h-5 flex-shrink-0 text-gray-500 transition-transform group-hover:rotate-12" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="/programs" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Browse our programs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
