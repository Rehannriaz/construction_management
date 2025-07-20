import Header from "./header";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import AboutSection from "./about-section";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
