import { useState } from 'react';
import useLenis from './hooks/useLenis';
import useTheme from './hooks/useTheme';
import { LangContext, useLangProvider } from './hooks/useLanguage';
import Loader from './components/Loader/Loader';
import Cursor from './components/Cursor/Cursor';
import PageProgress from './components/PageProgress/PageProgress';
import Nav from './components/Navigation/Nav';
import Hero from './components/Hero/Hero';
import Journey from './components/Journey/Journey';
import Honours from './components/Honours/Honours';
import FivePaths from './components/FivePaths/FivePaths';
import Legacy from './components/Legacy/Legacy';
import Gallery from './components/Gallery/Gallery';
import Associations from './components/Associations/Associations';
import Contact from './components/Contact/Contact';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const { theme, toggleTheme } = useTheme('dark');
  const langCtx = useLangProvider();
  useLenis();

  if (typeof document !== 'undefined' && !document.documentElement.dataset.theme) {
    document.documentElement.dataset.theme = 'dark';
  }

  return (
    <LangContext.Provider value={langCtx}>
      <Loader onDone={() => setLoaded(true)} />
      <Cursor />
      <PageProgress />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Journey />
        <Honours />
        <FivePaths />
        <Legacy />
        <Gallery />
        <Associations />
        <Contact />
      </main>
    </LangContext.Provider>
  );
}
