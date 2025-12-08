import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CertificateGenerator } from "@/components/CertificateGenerator";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  if (showGenerator) {
    return <CertificateGenerator onBack={() => setShowGenerator(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onGetStarted={() => setShowGenerator(true)} />
      <HeroSection onGetStarted={() => setShowGenerator(true)} />
      
      {/* Features section */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Why Choose EcoAwards?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most efficient way to create personalized certificates for your students, employees, or event participants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Lightning Fast",
                description: "Generate hundreds of certificates in seconds, not hours",
                icon: "⚡",
              },
              {
                title: "Pixel Perfect",
                description: "Precise text placement with drag-and-drop positioning",
                icon: "🎯",
              },
              {
                title: "Bulk Download",
                description: "All certificates packaged in a single ZIP file",
                icon: "📦",
              },
              {
                title: "No Watermarks",
                description: "Clean, professional certificates every time",
                icon: "✨",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to generate all your certificates
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Your Template",
                description: "Import your certificate design in PNG or JPG format. Any design works!",
              },
              {
                step: "02",
                title: "Map Your Data Fields",
                description: "Upload an Excel file with student data, then drag text fields onto your template.",
              },
              {
                step: "03",
                title: "Generate & Download",
                description: "Click generate and download all certificates as a single ZIP file.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EcoAwards. Making certificate generation simple and sustainable.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
