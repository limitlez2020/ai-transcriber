import Image from "next/image";
import SpeechToText from './components/SpeechToText';

export default function Home() {
  return (
    <div>
      {/* <h1>Welcome to my blog</h1> */}
      <SpeechToText />
    </div>
  );
}
