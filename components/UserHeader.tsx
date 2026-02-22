'use client'

type Theme = 'dark' | 'light'

interface UserHeaderProps {
  user: {
    email: string
    productName: string
  } | null
  onLogout: () => void
  theme?: Theme
}

export default function UserHeader({ user, onLogout, theme = 'dark' }: UserHeaderProps) {
  const isLight = theme === 'light'

  return (
    <header className={`${isLight ? 'bg-white border-b border-gray-200 shadow-md' : 'glass-dark border-b border-neuro-500/20 shadow-neuro-card backdrop-blur-xl'} sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Logo Icon */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isLight ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30' : 'bg-neuro-gradient shadow-neuro-glow animate-glow-pulse'} rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95`}>
              {isLight ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                >
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" x2="6" y1="2" y2="4" />
                  <line x1="10" x2="10" y1="2" y2="4" />
                  <line x1="14" x2="14" y1="2" y2="4" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                >
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                  <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                  <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                  <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                  <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                  <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                  <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                </svg>
              )}
            </div>

            {/* Product Name and Email */}
            <div className="flex-1 min-w-0">
              <h1 className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'} text-base sm:text-lg leading-tight flex items-center gap-1.5 sm:gap-2`}>
                <span className="truncate">{user?.productName || 'NeuroReset'}</span>
                <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLight ? 'text-emerald-500' : 'text-cyan-300'} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </h1>
              <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-neuro-200'} truncate max-w-[250px] sm:max-w-[300px]`}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-semibold ${isLight ? 'text-gray-600 hover:text-red-600 hover:bg-red-50' : 'text-neuro-100 hover:text-red-400 hover:bg-red-900/20'} rounded-lg sm:rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/30 hover:scale-105 active:scale-95 flex-shrink-0`}
            aria-label="Sair"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
