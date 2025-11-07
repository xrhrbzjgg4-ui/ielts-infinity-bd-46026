import { BookOpen, Brain, Gamepad2, LineChart, Globe, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aiBuddy from "@/assets/ai-buddy.png";

const features = [
  {
    icon: BookOpen,
    title: "Unlimited IELTS Materials",
    description: "Access comprehensive Reading, Writing, Listening, and Speaking modules updated daily with global trends.",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "AI Study Coach",
    description: "Get personalized recommendations, weak-skill analysis, and adaptive learning paths powered by AI.",
    color: "text-secondary",
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning",
    description: "Master IELTS through vocabulary races, grammar battles, and listening puzzles that make learning fun.",
    color: "text-primary",
  },
  {
    icon: LineChart,
    title: "Smart Analytics",
    description: "Track your progress with detailed insights, score graphs, streak tracking, and performance metrics.",
    color: "text-secondary",
  },
  {
    icon: Sparkles,
    title: "Mock Tests & Quizzes",
    description: "Unlimited AI-evaluated mock tests with real-time feedback and detailed explanations.",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Study Abroad Hub",
    description: "Country-wise visa tips, scholarship info, and migration guides for UK, Canada, Australia & more.",
    color: "text-secondary",
  },
];

const Features = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-card">
      <div className="container">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by AI</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ace IELTS
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem designed for Bangladeshi students aiming to study or migrate abroad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border/40 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Buddy Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border/40">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold">
                Meet Your AI Study Buddy
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Your personal IELTS mentor that understands your learning style, identifies weak areas, 
                and creates a customized study plan just for you. Available 24/7 to answer questions and 
                provide instant feedback.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Personalized daily study plans</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Instant doubt clearing & explanations</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Adaptive difficulty based on performance</span>
                </li>
              </ul>
              <Button variant="hero" size="lg" asChild>
                <Link to="/ai-buddy">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Chat with AI Buddy
                </Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <img 
                src={aiBuddy} 
                alt="AI Study Buddy mascot" 
                className="w-64 h-64 object-contain animate-pulse-glow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
