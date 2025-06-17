import React from 'react';
import './index.css';
import { Button } from './components/ui/button'; // or '@/components/ui/button'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-900 text-white">
      <h1 className="text-4xl font-bold">ZipNGo</h1>
      <Button>Get Started</Button>
    </div>
  );
}

export default App;
