'use client';

import PomodoroTimer from './components/PomodoroTimer';

export default function Home() {
  return (
    <div className="flex flex-col items-center max-w-2xl w-full">
      <PomodoroTimer />
    </div>
  );
}