import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Gamepad2, LineChart, Globe, Sparkles, Clock, Trophy, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const allFeatures = [
  {
    icon: BookOpen,
    title: "Comprehensive IELTS Materials",
    description: "Access unlimited Reading, Writing, Listening, and Speaking modules with authentic IELTS-style questions updated daily.",
    benefits: ["500K+ practice questions", "Real exam patterns", "Updated weekly", "All difficulty levels"],
    route: "/materials",
  },
  {
    icon: Brain,
    title: "AI-Powered Study Coach",
    description: "Get personalized learning paths, weak area identification, and adaptive recommendations from our intelligent AI mentor.",
    benefits: ["Personalized study plans", "Weak skill detection", "Progress tracking", "24/7 availability"],
    route: "/ai-buddy",
  },
  {
    icon: Clock,
    title: "Timed Mock Tests",
    description: "Experience real IELTS exam conditions with our authentic simulator. Complete with timer, actual test format, and instant results.",
    benefits: ["Full-length tests", "Real-time timer", "Authentic format", "Instant scoring"],
    route: "/mock-tests",
  },
  {
    icon: LineChart,
    title: "Advanced Analytics Dashboard",
    description: "Track your progress with detailed insights, performance graphs, score predictions, and comprehensive reports.",
    benefits: ["Band score tracking", "Performance graphs", "Streak monitoring", "Detailed reports"],
    route: "/analytics",
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning Experience",
    description: "Make IELTS prep fun with vocabulary races, grammar battles, listening puzzles, and achievement rewards.",
    benefits: ["Vocabulary games", "Grammar challenges", "Leaderboards", "Achievement badges"],
    route: "/gamified",
  },
  {
    icon: Globe,
    title: "Study Abroad Hub",
    description: "Complete migration guide with country-specific visa requirements, scholarship info, and university recommendations.",
    benefits: ["Visa guidance", "Scholarship tips", "University info", "Migration roadmaps"],
    route: "/study-abroad",
  },
  {
    icon: Target,
    title: "Skill-Focused Modules",
    description: "Dedicated sections for each IELTS skill with targeted practice, tips, and techniques for improvement.",
    benefits: ["Reading strategies", "Writing templates", "Speaking practice", "Listening techniques"],
    route: "/materials",
  },
  {
    icon: Trophy,
    title: "Success Path Planning",
    description: "Get a customized roadmap to your target band score with milestone tracking and achievement celebrations.",
    benefits: ["Target setting", "Milestone tracking", "Progress rewards", "Success metrics"],
    route: "/analytics",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Join study groups, participate in discussions, share tips, and learn from successful IELTS achievers.",
    benefits: ["Study groups", "Discussion forums", "Peer learning", "Success stories"],
    route: "/gamified",
  },
  {
    icon: Sparkles,
    title: "Daily Updates",
    description: "Fresh content every day based on latest IELTS trends, topics, and question patterns from around the world.",
    benefits: ["Daily questions", "Trending topics", "Fresh content", "Global insights"],
    route: "/materials",
  },
];

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Complete Feature Set</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                IELTS Success
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to prepare for IELTS Academic, powered by AI and designed for Bangladeshi learners
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {allFeatures.map((feature, index) => (
                <Card 
                  key={index}
                  className="border-border/40 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 pl-16">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
