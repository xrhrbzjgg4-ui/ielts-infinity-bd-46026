import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  passage: string;
  question: string;
  options: string[];
  correct: string;
}

const PracticeModule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { module } = location.state || { module: "Reading" };
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQuestions();
  }, [module]);

  const generateQuestions = async () => {
    setIsLoading(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-practice-questions', {
        body: { module, count: 5 }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        navigate('/materials');
        return;
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No questions generated');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate practice questions. Please try again.');
      navigate('/materials');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error("Please select an answer");
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Generating unique practice questions...</p>
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
        <main className="flex-1 py-16 container">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
                Practice Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{score}%</div>
                <p className="text-muted-foreground">
                  You got {Object.values(answers).filter((a, i) => a === questions[i].correct).length} out of {questions.length} correct
                </p>
              </div>
              <div className="space-y-4">
                {questions.map((q, idx) => (
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
              <div className="flex gap-4">
                <Button onClick={() => navigate("/materials")} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Materials
                </Button>
                <Button onClick={() => generateQuestions()} className="flex-1">
                  New Practice Set
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">No questions available</p>
            <Button onClick={() => navigate("/materials")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Materials
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 container">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/materials")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <Progress value={progress} className="w-full" />

          <Card>
            <CardHeader>
              <CardTitle>{module} Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm leading-relaxed">{currentQ.passage}</p>
              </div>

              <div className="space-y-4">
                <p className="font-semibold">{currentQ.question}</p>
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswer}
                >
                  {currentQ.options.map((option, idx) => (
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
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Practice"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PracticeModule;
