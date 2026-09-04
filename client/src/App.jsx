import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import BookingForm from './components/BookingForm';
import Testimonials from './components/Testimonials';
import CTABanner from './components/CTABanner';
import Feedback from './components/Feedback';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(() => {
    // Persist theme across reloads
    return localStorage.getItem('gasgo-theme') || 'dark';
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'feedback' ? 'feedback' : 'home';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gasgo-theme', theme);
  }, [theme]);

  // Handle browser back / forward buttons and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'feedback') {
        setCurrentPage('feedback');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <main>
        {currentPage === 'feedback' ? (
          <Feedback onNavigateHome={() => handleNavigate('home')} />
        ) : (
          <>
            <Hero onNavigate={handleNavigate} />
            <Features />
            <HowItWorks />
            <BookingForm />
            <Testimonials />
            <CTABanner />
          </>
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

