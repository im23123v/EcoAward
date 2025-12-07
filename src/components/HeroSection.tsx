import { ArrowRight, Award, FileSpreadsheet, Download } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-secondary-foreground">
              Sustainable Certificate Generation
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Create Beautiful{" "}
            <span className="text-gradient">Certificates</span>
            <br />
            in Bulk
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Upload your template, map your data fields, and generate hundreds of
            personalized certificates in seconds. Simple, efficient, eco-friendly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button onClick={onGetStarted} variant="hero" size="lg" className="group">
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="p-6 rounded-2xl gradient-card shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Upload Template</h3>
              <p className="text-sm text-muted-foreground">
                Import your certificate design and place text fields exactly where you need them
              </p>
            </div>

            <div className="p-6 rounded-2xl gradient-card shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <FileSpreadsheet className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Import Data</h3>
              <p className="text-sm text-muted-foreground">
                Upload your Excel file with student names and other details
              </p>
            </div>

            <div className="p-6 rounded-2xl gradient-card shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Download All</h3>
              <p className="text-sm text-muted-foreground">
                Generate and download all certificates as a ZIP file instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
