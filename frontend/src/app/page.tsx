import MapComponent from '@/components/Map';
import RequestForm from '@/components/RequestForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Map Layer - Full Screen */}
      <div className="absolute inset-0 z-0">
        <MapComponent />
        {/* Gradient overlay for better text contrast on mobile top */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      </div>

      {/* Header Layer */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-red-600 text-white p-2.5 rounded-xl shadow-lg shadow-red-600/20 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl md:text-2xl tracking-tight leading-none">
              Cứu Trợ <span className="text-red-500">Khẩn Cấp</span>
            </h1>
          </div>
        </div>

        <div className="pointer-events-auto">
          <Link href="/dashboard">
            <Button variant="secondary" className="shadow-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
              📊 Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Form Layer - Responsive Layout */}
      <div className="absolute z-20 
          /* Mobile: Bottom Sheet style with scroll */
          bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto scrollbar-hide
          /* Desktop: Floating Card style */
          md:top-28 md:left-8 md:bottom-auto md:w-[480px] md:max-h-[calc(100vh-8rem)] md:overflow-visible
          px-4 pb-4 md:p-0
      ">
        <div className="pb-safe md:pb-0">
          <RequestForm />
        </div>
      </div>

      {/* Mobile Bottom Gradient for smooth fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none md:hidden z-10" />
    </main>
  );
}
