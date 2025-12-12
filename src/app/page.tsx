import { Suspense } from 'react';
import PlateGenerator from '@/components/PlateGenerator';

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex items-center justify-center"><p>Laden...</p></div>}>
        <PlateGenerator />
      </Suspense>
    </main>
  );
}
