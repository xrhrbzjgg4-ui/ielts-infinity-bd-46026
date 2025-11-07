import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Headphones, Mic, Lock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Materials = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("reading");

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access materials");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handlePractice = (module: string) => {
    if (!user) {
      toast.error("Please sign in to access practice materials");
      navigate("/auth");
      return;
    }
    
    // Route to specific practice pages
    switch(module) {
      case "Writing":
        navigate("/writing-practice");
        break;
      case "Listening":
        navigate("/listening-practice");
        break;
      case "Speaking":
        navigate("/speaking-practice");
        break;
      case "Reading":
        navigate("/practice", { state: { module } });
        break;
      default:
        navigate("/practice", { state: { module } });
    }
  };

  const modules = [
    {
      id: "reading",
      title: "Reading",
      icon: BookOpen,
      description: "Master IELTS Reading with passages from academic journals, newspapers, and books",
      stats: { questions: "120K+", tests: "2,000+", time: "60 min" },
    },
    {
      id: "writing",
      title: "Writing",
      icon: FileText,
      description: "Practice Task 1 (graphs, charts) and Task 2 (essays) with AI evaluation",
      stats: { tasks: "50K+", templates: "200+", time: "60 min" },
    },
    {
      id: "listening",
      title: "Listening",
      icon: Headphones,
      description: "Improve listening skills with authentic recordings and various accents",
      stats: { recordings: "80K+", tests: "1,500+", time: "30 min" },
    },
    {
      id: "speaking",
      title: "Speaking",
      icon: Mic,
      description: "Practice with AI interview simulation and get instant feedback on fluency",
      stats: { topics: "1,000+", tests: "800+", time: "15 min" },
    },
  ];

  const currentModule = modules.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Comprehensive{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                IELTS Materials
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access 500K+ practice questions across all IELTS modules with authentic exam patterns
            </p>
          </div>
        </section>

        <section className="py-16 container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {modules.map((module) => (
                <TabsTrigger key={module.id} value={module.id} className="gap-2">
                  <module.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{module.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {modules.map((module) => (
              <TabsContent key={module.id} value={module.id} className="space-y-6">
                <Card className="border-border/40 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <module.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl">{module.title} Module</h2>
                        <p className="text-sm text-muted-foreground font-normal">
                          {module.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(module.stats).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">{value}</div>
                          <div className="text-sm text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">What's Included:</h3>
                      <ul className="grid md:grid-cols-2 gap-2">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">Real exam patterns</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">All difficulty levels</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">Detailed explanations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">Updated weekly</span>
                        </li>
                      </ul>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => handlePractice(module.title)}
                      disabled={loading}
                    >
                      {user ? (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Start {module.title} Practice
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Sign In to Start
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Materials;
