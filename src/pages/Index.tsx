import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { Zap, Target, Package, Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  if (showGenerator) {
    return <CertificateGenerator onBack={() => setShowGenerator(false)} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header onGetStarted={() => setShowGenerator(true)} />
      <HeroSection onGetStarted={() => setShowGenerator(true)} />
      
      {/* Features section */}
      <section id="features" className="py-32 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="orb orb-accent w-[600px] h-[600px] -right-64 top-0 opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Why Choose <span className="text-gradient">EcoAwards</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most powerful and intuitive certificate generator for educators, HR professionals, and event organizers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Lightning Fast",
                description: "Generate hundreds of certificates in seconds with our optimized engine",
                icon: Zap,
                gradient: "from-amber-500 to-orange-500",
              },
              {
                title: "Pixel Perfect",
                description: "Precise drag-and-drop positioning with smart guides and snapping",
                icon: Target,
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                title: "Bulk Export",
                description: "Download all certificates as a single organized ZIP archive",
                icon: Package,
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                title: "No Watermarks",
                description: "Professional, clean certificates every time without branding",
                icon: Sparkles,
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl glass hover-lift"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="orb orb-primary w-[500px] h-[500px] -left-48 top-1/2 -translate-y-1/2 opacity-20" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to generate all your certificates
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Your Template",
                description: "Import your certificate design in PNG or JPG format. Works with any design you create or download.",
                features: ["Any image format", "Custom designs", "Drag & drop upload"],
              },
              {
                step: "02",
                title: "Map Your Data Fields",
                description: "Upload an Excel file with recipient data, then drag text fields onto your template exactly where you want them.",
                features: ["Excel/CSV support", "Multiple fields", "Font customization"],
              },
              {
                step: "03",
                title: "Generate & Download",
                description: "Click generate and download all certificates as a single ZIP file. Perfect for bulk distribution.",
                features: ["Instant generation", "ZIP download", "Print-ready quality"],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col md:flex-row items-start gap-8 mb-16 last:mb-0"
              >
                {/* Step number */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 gradient-hero rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl gradient-hero flex items-center justify-center text-3xl md:text-4xl font-bold text-primary-foreground">
                      {item.step}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 glass rounded-3xl p-8 md:p-10 hover-lift">
                  <h3 className="font-display text-2xl md:text-3xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {item.features.map((feature, fIdx) => (
                      <div key={fIdx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
                        <Check className="w-4 h-4" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <Button onClick={() => setShowGenerator(true)} variant="hero" size="xl" className="group">
              Start Creating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 relative">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">EcoAwards</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 EcoAwards. Making certificate generation simple and beautiful.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;