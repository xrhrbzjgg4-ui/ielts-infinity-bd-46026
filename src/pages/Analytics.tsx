import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart3, PieChart, TrendingUp, Target, Calendar, Lock, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Analytics = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access analytics");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleViewDashboard = () => {
    if (!user) {
      toast.error("Please sign in to access your analytics dashboard");
      navigate("/auth");
      return;
    }
    navigate("/analytics-dashboard");
  };

  const features = [
    {
      icon: LineChart,
      title: "Performance Tracking",
      description: "Visualize your progress over time with detailed line graphs showing band score trends",
    },
    {
      icon: BarChart3,
      title: "Module Comparison",
      description: "Compare your performance across Reading, Writing, Listening, and Speaking modules",
    },
    {
      icon: PieChart,
      title: "Skill Distribution",
      description: "See your strengths and weaknesses across different question types and skills",
    },
    {
      icon: TrendingUp,
      title: "Score Prediction",
      description: "Get AI-powered predictions of your likely band score based on current performance",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set target band scores and track your progress towards achieving them",
    },
    {
      icon: Calendar,
      title: "Study Streak",
      description: "Monitor your consistency with daily study streak tracking and milestones",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Advanced{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress with detailed insights, performance graphs, and comprehensive reports
            </p>
          </div>
        </section>

        <section className="py-16 container space-y-8">
          <Card className="border-primary/20 bg-gradient-card">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Data-Driven Learning</span>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Make informed decisions about your study plan with comprehensive analytics and insights
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-border/40 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/40 shadow-card">
            <CardHeader>
              <CardTitle>Your Analytics Include</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Overall band score tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Module-wise performance</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Question type analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Time management insights</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Progress Reports</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span>Weekly performance summaries</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span>Monthly progress reports</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span>Strength & weakness analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span>Personalized recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleViewDashboard}
                  disabled={loading}
                >
                  {user ? (
                    <>
                      <BarChart className="h-5 w-5 mr-2" />
                      View Your Dashboard
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Sign In to View
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
