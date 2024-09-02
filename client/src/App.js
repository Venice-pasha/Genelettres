import React, { useState } from 'react';
import Home from './components/Home';
import Introduction from './components/Introduction';
import LetterGeneration from './components/LetterGeneration';
import History from './components/History';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToIntro = () => {
    setCurrentPage('introduction');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToLetterGeneration = () => {
    setCurrentPage('letterGeneration');
  };

  const navigateToHistory = () => {
    setCurrentPage('history');
  };

  return (
    <div>
      {currentPage === 'home' && (
        <Home
          navigateToIntro={navigateToIntro}
          navigateToLetterGeneration={navigateToLetterGeneration}
          navigateToHistory={navigateToHistory}
        />
      )}
      {currentPage === 'introduction' && <Introduction navigateToHome={navigateToHome} />}
      {currentPage === 'letterGeneration' && <LetterGeneration navigateToHome={navigateToHome} />}
      {currentPage === 'history' && <History navigateToHome={navigateToHome} />}
    </div>
  );
}

export default App;

