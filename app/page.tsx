import Image from "next/image";
import AudioPlayer from '@/components/sections/audio-player';

export default function Home() {
  return (
        <div className="min-h-screen bg-white">
      <main>
        <AudioPlayer />
      </main>
    </div>
  );
}
