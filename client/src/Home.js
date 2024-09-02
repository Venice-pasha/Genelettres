import React from 'react';

function Home({ navigateToIntro, navigateToLetterGeneration, navigateToHistory }) {
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={navigateToIntro}>Go to Introduction</button>
      <button onClick={navigateToLetterGeneration}>Generate a Letter</button>
      <button onClick={navigateToHistory}>View History</button>
    </div>
  );
}

export default Home;
