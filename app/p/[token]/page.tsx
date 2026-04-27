'use client';
import { useEffect, useState } from 'react';

export default function PublicPage({ params }: { params: { token: string } }) {
  const [liveViewers, setLiveViewers] = useState(12);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLiveViewers(v => v + (Math.random() > 0.5 ? 1 : -1)), 7000);
    return () => clearInterval(interval);
  }, []);

  const isShamed = streak < 2;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-2xl font-bold text-green-500">LIVE: {liveViewers} CLIENTS WATCHING</div>
        {isShamed ? (
          <div className="bg-red-600 p-16 rounded-3xl text-center mt-12">
            <h1 className="text-7xl font-black">YOUR CONTRACTOR IS GHOSTING YOU</h1>
          </div>
        ) : (
          <div className="bg-green-600 p-16 rounded-3xl text-center mt-12">
            <h1 className="text-7xl font-black">DAILY PROOF LOCKED IN 🔥</h1>
            <p className="text-5xl mt-4">{streak} DAY STREAK</p>
          </div>
        )}
      </div>
    </div>
  );
}
