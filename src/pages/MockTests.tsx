import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileCheck, Target, Lock, Play, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const MockTests = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access mock tests");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleStartTest = (testType: string) => {
    if (!user) {
      toast.error("Please sign in to access mock tests");
      navigate("/auth");
      return;
    }
    navigate("/test-taking", { state: { testType } });
  };

  const testTypes = [
    {
      title: "Full IELTS Academic Test",
      duration: "2 hours 45 minutes",
      description: "Complete IELTS exam experience with all 4 modules",
      icon: FileCheck,
      features: ["Reading (60 min)", "Writing (60 min)", "Listening (30 min)", "Speaking (15 min)"],
    },
    {
      title: "Quick Practice Test",
      duration: "30 minutes",
      description: "Short focused practice on specific skills",
      icon: Clock,
      features: ["Choose any module", "Instant feedback", "Time management practice", "Flexible scheduling"],
    },
    {
      title: "Target Band Test",
      duration: "Variable",
      description: "Customized test based on your target band score",
      icon: Target,
      features: ["Adaptive difficulty", "Personalized questions", "Band prediction", "Weakness analysis"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Timed{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mock Tests
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience real IELTS exam conditions with authentic format and instant results
            </p>
          </div>
        </section>

        <section className="py-16 container space-y-8">
          <Card className="border-primary/20 bg-gradient-card">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">2000+</div>
                  <div className="text-sm text-muted-foreground">Mock Tests</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
                  <div className="text-sm text-muted-foreground">Timer & Scoring</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">Instant</div>
                  <div className="text-sm text-muted-foreground">Results</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Authentic Format</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {testTypes.map((test, index) => (
              <Card 
                key={index}
                className="border-border/40 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <test.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{test.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{test.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{test.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {test.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handleStartTest(test.title)}
                    disabled={loading}
                  >
                    {user ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Sign In to Start
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/40 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                Why Take Mock Tests?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Build Exam Confidence</h4>
                  <p className="text-sm text-muted-foreground">
                    Experience real test conditions and reduce anxiety on exam day
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Improve Time Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn to allocate time efficiently across different sections
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Identify Weak Areas</h4>
                  <p className="text-sm text-muted-foreground">
                    Get detailed analysis of your performance to focus study efforts
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your improvement over time with comprehensive analytics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MockTests;
