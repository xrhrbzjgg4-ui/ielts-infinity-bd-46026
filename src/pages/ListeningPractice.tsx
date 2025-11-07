import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Play, Pause, Volume2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: string[];
  correct: string;
}

interface ListeningContent {
  transcript: string;
  questions: Question[];
}

const ListeningPractice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<ListeningContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  useEffect(() => {
    generateContent();
  }, []);

  const generateContent = async () => {
    setIsLoading(true);
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setHasPlayedAudio(false);
    setIsPlaying(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-listening-content');

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setContent(data);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate listening content');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (!content) return;

    const utterance = new SpeechSynthesisUtterance(content.transcript);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setHasPlayedAudio(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      toast.success('Audio finished. You can replay or start answering questions.');
    };

    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error('Please select an answer');
      return;
    }

    if (currentQuestion < content!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      stopAudio();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    content!.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    return Math.round((correct / content!.questions.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Generating listening content...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 container max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
                Listening Practice Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{score}%</div>
                <p className="text-muted-foreground">
                  You got {Object.values(answers).filter((a, i) => a === content!.questions[i].correct).length} out of {content!.questions.length} correct
                </p>
              </div>

              <div className="space-y-4">
                {content!.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-lg border">
                    <p className="font-semibold mb-2">Question {idx + 1}</p>
                    <p className="text-sm text-muted-foreground mb-2">{q.question}</p>
                    <div className="flex items-center gap-2">
                      <span className={answers[idx] === q.correct ? "text-primary" : "text-destructive"}>
                        Your answer: {answers[idx]}
                      </span>
                      {answers[idx] !== q.correct && (
                        <span className="text-muted-foreground text-sm">
                          (Correct: {q.correct})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Transcript:</h3>
                <p className="text-sm leading-relaxed">{content!.transcript}</p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate("/materials")} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Materials
                </Button>
                <Button onClick={generateContent} className="flex-1">
                  New Listening Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = content ? ((currentQuestion + 1) / content.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 container max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/materials")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Player
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {hasPlayedAudio 
                  ? "You can replay the audio as many times as you need."
                  : "Click play to listen to the audio. You can replay it anytime."}
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className="flex-1"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {hasPlayedAudio ? 'Replay Audio' : 'Play Audio'}
                </Button>
                <Button
                  onClick={stopAudio}
                  disabled={!isPlaying}
                  variant="outline"
                  size="lg"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>

          {hasPlayedAudio && content && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {content.questions.length}
                </span>
              </div>

              <Progress value={progress} className="w-full" />

              <Card>
                <CardHeader>
                  <CardTitle>Listening Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <p className="font-semibold">{content.questions[currentQuestion].question}</p>
                    <RadioGroup
                      value={answers[currentQuestion] || ""}
                      onValueChange={handleAnswer}
                    >
                      {content.questions[currentQuestion].options.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                          <RadioGroupItem value={option} id={`option-${idx}`} />
                          <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button onClick={handleNext} className="w-full" size="lg">
                    {currentQuestion < content.questions.length - 1 ? 'Next Question' : 'Finish Test'}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListeningPractice;
