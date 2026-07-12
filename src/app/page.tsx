import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Simulator from "@/components/Simulator";
import Benefits from "@/components/Benefits";
import MarqueeStrip from "@/components/MarqueeStrip";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dark text-text-primary bg-noise">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Simulator />
        <Benefits />
        <MarqueeStrip />
      </main>
      <Footer />
    </div>
  );
}

