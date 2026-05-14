import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SoftwarePreview from './components/SoftwarePreview';
import QuickStart from './components/QuickStart';
import Pricing from './components/Pricing';
import StatsBand from './components/StatsBand';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';

function Landing() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem('tl_preloaded');
    if (seen) { setLoading(false); return; }
    const t = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('tl_preloaded', '1');
    }, 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      {loading && <Preloader />}
      <div className="tl-bg-grid" />
      <div className="tl-bg-glow tl-bg-glow-a" />
      <div className="tl-bg-glow tl-bg-glow-b" />
      <Navbar />
      <main>
        <Hero />
        <SoftwarePreview />
        <QuickStart />
        <Pricing />
        <StatsBand />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="tl-app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
