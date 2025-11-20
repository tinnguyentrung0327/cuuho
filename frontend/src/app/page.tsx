import MapComponent from '@/components/Map';
import RequestForm from '@/components/RequestForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative">
      <div className="absolute inset-0 z-0">
        <MapComponent />
      </div>
      <div className="z-10 w-full max-w-md m-4 md:m-8 bg-white/95 p-6 rounded-xl shadow-2xl backdrop-blur-md border border-gray-200">
        <RequestForm />
      </div>
    </main>
  );
}
