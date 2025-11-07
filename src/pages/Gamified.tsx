import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy, Target, Zap, Award, Users, Lock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Gamified = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to play games");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handlePlayGame = (gameName: string) => {
    if (!user) {
      toast.error("Please sign in to start playing");
      navigate("/auth");
      return;
    }
    navigate("/gameplay", { state: { game: gameName } });
  };

  const games = [
    {
      icon: Zap,
      title: "Vocabulary Race",
      description: "Speed challenge to match words with meanings",
      difficulty: "Easy",
      time: "5 min",
      points: "100-500",
    },
    {
      icon: Target,
      title: "Grammar Battle",
      description: "Fix sentences and compete with other learners",
      difficulty: "Medium",
      time: "10 min",
      points: "200-800",
    },
    {
      icon: Gamepad2,
      title: "Listening Puzzle",
      description: "Complete the story by listening to audio clips",
      difficulty: "Medium",
      time: "15 min",
      points: "300-1000",
    },
    {
      icon: Trophy,
      title: "Reading Sprint",
      description: "Answer questions as fast as you can",
      difficulty: "Hard",
      time: "20 min",
      points: "500-1500",
    },
  ];

  const achievements = [
    { icon: Award, title: "First Steps", description: "Complete your first practice" },
    { icon: Zap, title: "Speed Demon", description: "Finish 10 exercises in under 5 minutes" },
    { icon: Trophy, title: "Perfect Score", description: "Get 100% on any module" },
    { icon: Target, title: "Streak Master", description: "Maintain a 30-day study streak" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Gamified{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Learning Experience
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make IELTS preparation fun with interactive games, achievements, and leaderboards
            </p>
          </div>
        </section>

        <section className="py-16 container space-y-8">
          <Card className="border-primary/20 bg-gradient-card">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
                <div>
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary mb-2">Global</div>
                  <div className="text-sm text-muted-foreground">Leaderboards</div>
                </div>
                <div>
                  <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary mb-2">20+</div>
                  <div className="text-sm text-muted-foreground">Fun Games</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-6">Learning Games</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {games.map((game, index) => (
                <Card 
                  key={index}
                  className="border-border/40 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                      <game.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{game.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>Difficulty: {game.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span>{game.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-primary font-semibold">{game.points} points</span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handlePlayGame(game.title)}
                      disabled={loading}
                    >
                      {user ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Sign In to Play
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Achievements to Unlock</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index}
                  className="border-border/40 shadow-card text-center"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
                      <achievement.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-border/40 shadow-card">
            <CardHeader>
              <CardTitle>Why Gamified Learning Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Increased Motivation</h4>
                  <p className="text-sm text-muted-foreground">
                    Points, badges, and achievements keep you engaged and motivated to continue learning
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Better Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    Interactive gameplay helps you remember vocabulary and grammar rules more effectively
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Social Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Compete with friends and other learners on global leaderboards
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Reduced Stress</h4>
                  <p className="text-sm text-muted-foreground">
                    Fun games make IELTS preparation less stressful and more enjoyable
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

export default Gamified;
