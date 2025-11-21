import MapComponent from '@/components/Map';
import RequestForm from '@/components/RequestForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative">
      <div className="absolute inset-0 z-0">
        <MapComponent />
      </div>

      {/* Dashboard Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Link href="/dashboard">
          <Button className="bg-yellow-500 hover:bg-yellow-600 shadow-lg">
            📊 Dashboard
          </Button>
        </Link>
      </div>

      <div className="z-10 w-full max-w-md m-4 md:m-8 bg-white/95 p-6 rounded-xl shadow-2xl backdrop-blur-md border border-gray-200">
        <RequestForm />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
          <p className="text-sm text-gray-700 font-medium">
            Powered by{' '}
            <a
              href="https://techdata.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
            >
              TechData.AI
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
