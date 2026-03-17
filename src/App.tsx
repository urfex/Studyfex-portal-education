import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Maximize2, X, ChevronLeft, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gamesData from './games.json';
import NoticeModal from './components/NoticeModal';

interface Game {
  id: string;
  title: string;
  iframeUrl: string;
  category: string;
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('studyfex-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('LocalStorage access failed:', e);
      return [];
    }
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('studyfex-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('LocalStorage save failed:', e);
    }
  }, [favorites]);

  const categories = ['All', ...Array.from(new Set(games.map(g => g.category)))];

  const toggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = showFavorites ? favorites.includes(game.id) : true;
    const matchesCategory = selectedCategory && selectedCategory !== 'All' ? game.category === selectedCategory : true;
    return matchesSearch && matchesFavorites && matchesCategory;
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      <NoticeModal />
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setShowFavorites(false);
              setSelectedCategory(null);
            }}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block uppercase">STUDYFEX<span className="text-emerald-500">-PORTAL</span></span>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <button 
              onClick={() => {
                setShowFavorites(!showFavorites);
                setSelectedCategory(null);
                setSelectedGame(null);
              }}
              className={`flex items-center gap-2 transition-colors ${showFavorites ? 'text-emerald-500' : 'hover:text-emerald-500'}`}
            >
              <Star className={`w-4 h-4 ${showFavorites ? 'fill-emerald-500' : ''}`} />
              Favorites
            </button>
            {['Arcade', 'Action', 'Sports'].map(cat => (
              <button 
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowFavorites(false);
                  setSelectedGame(null);
                }}
                className={`transition-colors ${selectedCategory === cat ? 'text-emerald-500' : 'hover:text-emerald-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <header className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {showFavorites ? 'Your Favorite' : 'Featured'} <span className="text-emerald-500">Games</span>
                </h1>
                <p className="text-white/40 max-w-xl">
                  {showFavorites 
                    ? 'Your hand-picked collection of the best games.' 
                    : 'Discover the best unblocked games available on the web. No downloads, just play.'}
                </p>
              </header>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      (category === 'All' && !selectedCategory) || selectedCategory === category
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layoutId={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group relative aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-emerald-500/50 transition-colors"
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-8 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors">
                      <h3 className="text-2xl font-black text-center uppercase tracking-tighter leading-none opacity-40 group-hover:opacity-100 transition-opacity">
                        {game.title}
                      </h3>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => toggleFavorite(e, game.id)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          favorites.includes(game.id) 
                            ? 'bg-emerald-500 text-black scale-110' 
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(game.id) ? 'fill-black' : ''}`} />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                      <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">
                        {game.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    {showFavorites ? <Star className="w-8 h-8 text-white/20" /> : <Search className="w-8 h-8 text-white/20" />}
                  </div>
                  <p className="text-white/40">
                    {showFavorites 
                      ? "You haven't added any favorites yet." 
                      : "No games found matching your search."}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Hub
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => toggleFavorite(e, selectedGame.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.includes(selectedGame.id)
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                    title={favorites.includes(selectedGame.id) ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Star className={`w-5 h-5 ${favorites.includes(selectedGame.id) ? 'fill-black' : ''}`} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/5">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white/5 rounded-3xl border border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full uppercase tracking-wider">
                      {selectedGame.category}
                    </span>
                  </div>
                  <p className="text-white/40">
                    Playing on STUDYFEX-PORTAL • High Performance Mode Enabled
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => toggleFavorite(e, selectedGame.id)}
                    className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all ${
                      favorites.includes(selectedGame.id)
                        ? 'bg-white/10 text-white'
                        : 'bg-emerald-500 text-black'
                    }`}
                  >
                    {favorites.includes(selectedGame.id) ? 'Remove Favorite' : 'Favorite Game'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight uppercase">STUDYFEX-PORTAL</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">DMCA</a>
          </div>
          <p className="text-xs text-white/20">
            © 2026 STUDYFEX-PORTAL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
