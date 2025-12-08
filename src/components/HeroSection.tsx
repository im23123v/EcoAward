import { ArrowRight, Award, FileSpreadsheet, Download, Zap, Star, Shield } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-primary w-[500px] h-[500px] -top-48 -right-48 animate-float" />
        <div className="orb orb-accent w-[400px] h-[400px] -bottom-32 -left-32 animate-float-slow" style={{ animationDelay: "-4s" }} />
        <div className="orb orb-secondary w-[300px] h-[300px] top-1/3 right-1/4 animate-morph" />
        <div className="orb orb-primary w-[200px] h-[200px] bottom-1/4 left-1/3 animate-float" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/20 mb-8 animate-fade-in"
            style={{ animationDelay: "0s" }}
          >
            <div className="relative">
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-primary block" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Next-Gen Certificate Generation
            </span>
          </div>

          {/* Heading */}
          <h1 
            className="font-display text-5xl md:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Create Stunning{" "}
            <span className="text-gradient text-glow">Certificates</span>
            <br />
            <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl">in Seconds</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            Upload your template, drag fields into place, import your data — 
            <span className="text-foreground font-medium"> generate hundreds of certificates instantly.</span>
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button onClick={onGetStarted} variant="hero" size="xl" className="group">
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="lg">
              <Star className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="flex flex-wrap justify-center gap-8 mb-16 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "10K+", label: "Certificates Generated" },
              { value: "500+", label: "Happy Users" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div 
            className="grid md:grid-cols-3 gap-6 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              {
                icon: Award,
                title: "Drag & Drop Editor",
                description: "Place text fields anywhere with pixel-perfect precision",
                color: "primary",
              },
              {
                icon: FileSpreadsheet,
                title: "Excel Import",
                description: "Upload spreadsheets with names, dates, and custom data",
                color: "accent",
              },
              {
                icon: Download,
                title: "Bulk Download",
                description: "Get all certificates as a single ZIP file instantly",
                color: "primary",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl glass hover-lift cursor-pointer"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.color === 'accent' ? 'bg-accent/5' : 'bg-primary/5'}`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${feature.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    <feature.icon className={`w-7 h-7 ${feature.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};