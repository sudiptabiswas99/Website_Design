import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero section — particle text morphs through the words below */}
      <ParticleTextEffect words={["HELLO", "WELCOME", "LET'S BUILD"]} />
    </main>
  );
}
