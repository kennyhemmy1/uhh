'use client';
import { useState } from 'react';
import { addDailyLog } from '@/lib/actions';
import RewardPop from '@/components/reward-pop';

export default function NewLog() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');

  const handleSubmit = async () => {
    const result = await addDailyLog('fake-project-id', photos, notes); // replace with real projectId
    if (result.reward) {
      setRewardMsg(result.reward.message);
      setShowReward(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-white mb-8">DAILY PROOF OR SHAME</h1>
      <button onClick={() => {/* photo upload */}} className="w-full max-w-md h-64 border-4 border-dashed border-green-500 rounded-3xl text-4xl">📸 TAP FOR PHOTOS</button>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-6 w-full max-w-md bg-zinc-900 p-6 rounded-2xl" placeholder="What did you finish?" />
      <button onClick={handleSubmit} className="mt-8 w-full max-w-md bg-green-500 py-8 text-3xl font-bold rounded-3xl">SUBMIT PROOF</button>
      {showReward && <RewardPop message={rewardMsg} type="legendary" />}
    </div>
  );
}
