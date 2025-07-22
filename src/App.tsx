// src/App.tsx

import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <HomePage />
        {/* Anda bisa menambahkan section atau halaman lain di bawah ini */}
      </main>
    </div>
  );
};

export default App;