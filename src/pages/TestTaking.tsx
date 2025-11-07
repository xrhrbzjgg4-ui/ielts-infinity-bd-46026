import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TestTaking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testType } = location.state || { testType: "Full IELTS Academic Test" };
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes for demo
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateTest();
  }, []);

  const generateTest = async () => {
    setIsLoading(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(900);

    try {
      const { data, error } = await supabase.functions.invoke('generate-test-questions');

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        navigate('/mock-tests');
        return;
      }

      if (data.questions && data.questions.length > 0) {
        setTestQuestions(data.questions);
      } else {
        throw new Error('No test questions generated');
      }
    } catch (error) {
      console.error('Error generating test:', error);
      toast.error('Failed to generate test questions. Please try again.');
      navigate('/mock-tests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading || testQuestions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, testQuestions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error("Please select an answer");
      return;
    }
    
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateBandScore = () => {
    if (testQuestions.length === 0) return 0;
    let correct = 0;
    testQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++;
    });
    const percentage = (correct / testQuestions.length) * 100;
    
    if (percentage >= 90) return 8.5;
    if (percentage >= 80) return 7.5;
    if (percentage >= 70) return 6.5;
    if (percentage >= 60) return 5.5;
    return 4.5;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Generating unique IELTS test questions...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showResults) {
    const bandScore = calculateBandScore();
    const correct = testQuestions.filter((q, i) => answers[i] === q.correct).length;
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 container">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
                Test Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">{bandScore}</div>
                <p className="text-xl text-muted-foreground">Estimated Band Score</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{correct}/{testQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round((correct / testQuestions.length) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                 <div>
                   <div className="text-2xl font-bold">{formatTime(900 - timeLeft)}</div>
                   <div className="text-sm text-muted-foreground">Time Used</div>
                 </div>
              </div>

              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Performance by Section</h3>
                  <div className="space-y-3">
                    {["Reading", "Listening", "Grammar", "Vocabulary"].map((section) => {
                      const sectionQs = testQuestions.filter(q => q.section === section);
                      const sectionCorrect = sectionQs.filter((q, i) => {
                        const qIndex = testQuestions.indexOf(q);
                        return answers[qIndex] === q.correct;
                      }).length;
                      const percentage = sectionQs.length > 0 ? (sectionCorrect / sectionQs.length) * 100 : 0;
                      
                      return (
                        <div key={section} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{section}</span>
                            <span className="font-semibold">{Math.round(percentage)}%</span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={() => navigate("/mock-tests")} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tests
                </Button>
                <Button onClick={generateTest} className="flex-1">
                  Take Another Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (testQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">No test questions available</p>
            <Button onClick={() => navigate("/mock-tests")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tests
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQ = testQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 container">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => {
              if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
                navigate("/mock-tests");
              }
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Test
            </Button>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-primary" />
              <span className={timeLeft < 60 ? "text-destructive" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <Progress value={progress} className="w-full" />

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{currentQ.section} Section</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} / {testQuestions.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQ.passage && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm leading-relaxed">{currentQ.passage}</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="font-semibold text-lg">{currentQ.question}</p>
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswer}
                >
                  {currentQ.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent transition-colors">
                      <RadioGroupItem value={option} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                {currentQuestion < testQuestions.length - 1 ? "Next Question" : "Finish Test"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestTaking;
