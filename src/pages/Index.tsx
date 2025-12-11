import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { Award, Users, CheckCircle, Zap, Github, Code2 } from "lucide-react";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [stats, setStats] = useState({
    totalGenerated: 0,
    sessionsCompleted: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("ecoawards-stats");
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const updateStats = (generated: number) => {
    const newStats = {
      totalGenerated: stats.totalGenerated + generated,
      sessionsCompleted: stats.sessionsCompleted + 1,
    };
    setStats(newStats);
    localStorage.setItem("ecoawards-stats", JSON.stringify(newStats));
  };

  if (showGenerator) {
    return <CertificateGenerator onBack={() => setShowGenerator(false)} onGenerate={updateStats} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onGetStarted={() => setShowGenerator(true)} />
      <HeroSection onGetStarted={() => setShowGenerator(true)} />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Award, label: "Certificates Generated", value: stats.totalGenerated, color: "text-primary" },
              { icon: CheckCircle, label: "Sessions Completed", value: stats.sessionsCompleted, color: "text-accent" },
              { icon: Users, label: "Happy Users", value: stats.sessionsCompleted > 0 ? stats.sessionsCompleted : "∞", color: "text-primary" },
              { icon: Zap, label: "Time Saved (hrs)", value: Math.floor(stats.totalGenerated * 0.5), color: "text-accent" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="font-display text-3xl font-bold text-foreground mb-1">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Hackathon Banner */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6">
              <Code2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent-foreground">Hackathon Project</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              St. Peter's Engineering College
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Proudly built during the college hackathon
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border shadow-elevated">
              <Github className="w-6 h-6 text-foreground" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Team</div>
                <div className="font-display text-xl font-bold text-gradient">BitwiseBinary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 EcoAwards. Making certificate generation simple and sustainable.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with ❤️ by</span>
              <span className="font-semibold text-foreground">Team BitwiseBinary</span>
              <span>•</span>
              <span>St. Peter's Engineering College</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
