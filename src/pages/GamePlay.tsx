import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const GamePlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { game } = location.state || { game: "Vocabulary Race" };
  
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameData, setGameData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateGameContent();
  }, [game]);

  const generateGameContent = async () => {
    setIsLoading(true);
    setCurrentRound(0);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setSelectedAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-game-content', {
        body: { gameType: game, count: 5 }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        navigate('/gamified');
        return;
      }

      if (data.gameContent && data.gameContent.length > 0) {
        setGameData(data.gameContent);
      } else {
        throw new Error('No game content generated');
      }
    } catch (error) {
      console.error('Error generating game content:', error);
      toast.error('Failed to generate game content. Please try again.');
      navigate('/gamified');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !isLoading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isLoading) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, isLoading]);

  const handleAnswer = (answer: string) => {
    if (gameData.length === 0) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === gameData[currentRound].correct;
    
    if (isCorrect) {
      const points = Math.floor(100 + (timeLeft * 10));
      setScore(score + points);
      toast.success(`+${points} points!`);
      
      setTimeout(() => {
        if (currentRound < gameData.length - 1) {
          setCurrentRound(currentRound + 1);
          setSelectedAnswer(null);
          setTimeLeft(30);
        } else {
          setGameOver(true);
        }
      }, 1000);
    } else {
      toast.error("Wrong answer! Try again");
      setScore(Math.max(0, score - 50));
      setTimeout(() => setSelectedAnswer(null), 1000);
    }
  };

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 container">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center gap-4">
                <Trophy className="h-16 w-16 text-primary" />
                Game Over!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{score}</div>
                <p className="text-muted-foreground">Total Points Earned</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{currentRound + 1}</div>
                  <div className="text-sm text-muted-foreground">Rounds</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round((currentRound / gameData.length) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{score > 500 ? "🏆" : "⭐"}</div>
                  <div className="text-sm text-muted-foreground">Achievement</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => navigate("/gamified")} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Games
                </Button>
                <Button onClick={generateGameContent} className="flex-1">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Generating unique game content...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (gameData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">No game content available</p>
            <Button onClick={() => navigate("/gamified")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const current = gameData[currentRound];
  const progress = ((currentRound + 1) / gameData.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 container">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/gamified")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Game
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-bold">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>

          <Progress value={progress} className="w-full" />

          <Card>
            <CardHeader>
              <CardTitle>{game}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg text-center">
                <p className="text-2xl font-bold">
                  {(current as any).word || (current as any).question || (current as any).audio || (current as any).passage}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {current.options.map((option, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    variant={selectedAnswer === option ? 
                      (option === current.correct ? "default" : "destructive") : 
                      "outline"}
                    disabled={selectedAnswer !== null}
                    className="h-20 text-lg"
                    size="lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Round {currentRound + 1} of {gameData.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GamePlay;
