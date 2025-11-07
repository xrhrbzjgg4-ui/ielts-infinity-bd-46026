import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface WritingTopic {
  taskType: string;
  topic: string;
  instructions: string;
  timeLimit: number;
  wordLimit: number;
}

interface Evaluation {
  overallBand: number;
  taskAchievement: { score: number; feedback: string };
  coherenceCohesion: { score: number; feedback: string };
  lexicalResource: { score: number; feedback: string };
  grammaticalRange: { score: number; feedback: string };
  strengths: string[];
  improvements: string[];
  wordCount: number;
}

const WritingPractice = () => {
  const navigate = useNavigate();
  const [isLoadingTopic, setIsLoadingTopic] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [topic, setTopic] = useState<WritingTopic | null>(null);
  const [essay, setEssay] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    generateTopic('task2');
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTimerRunning, timeLeft]);

  const generateTopic = async (taskType: string) => {
    setIsLoadingTopic(true);
    setEssay("");
    setEvaluation(null);
    setIsTimerRunning(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-writing-topic', {
        body: { taskType }
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setTopic(data);
      setTimeLeft(data.timeLimit * 60);
    } catch (error) {
      console.error('Error generating topic:', error);
      toast.error('Failed to generate writing topic');
    } finally {
      setIsLoadingTopic(false);
    }
  };

  const startWriting = () => {
    setIsTimerRunning(true);
    toast.success('Timer started! Good luck!');
  };

  const submitEssay = async () => {
    if (!essay.trim()) {
      toast.error('Please write your essay first');
      return;
    }

    const wordCount = essay.trim().split(/\s+/).length;
    if (wordCount < topic!.wordLimit) {
      toast.error(`Your essay should be at least ${topic!.wordLimit} words. Current: ${wordCount}`);
      return;
    }

    setIsEvaluating(true);
    setIsTimerRunning(false);

    try {
      const { data, error } = await supabase.functions.invoke('evaluate-writing', {
        body: { topic: topic!.topic, essay, taskType: topic!.taskType }
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setEvaluation(data);
      toast.success('Essay evaluated successfully!');
    } catch (error) {
      console.error('Error evaluating essay:', error);
      toast.error('Failed to evaluate essay');
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = essay.trim().split(/\s+/).filter(w => w).length;

  if (isLoadingTopic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Generating writing topic...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (evaluation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 container max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Essay Evaluation</CardTitle>
              <div className="text-center">
                <div className="text-6xl font-bold text-primary my-4">
                  Band {evaluation.overallBand}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Task Achievement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {evaluation.taskAchievement.score}
                    </div>
                    <p className="text-sm text-muted-foreground">{evaluation.taskAchievement.feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Coherence & Cohesion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {evaluation.coherenceCohesion.score}
                    </div>
                    <p className="text-sm text-muted-foreground">{evaluation.coherenceCohesion.feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Lexical Resource</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {evaluation.lexicalResource.score}
                    </div>
                    <p className="text-sm text-muted-foreground">{evaluation.lexicalResource.feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Grammatical Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {evaluation.grammaticalRange.score}
                    </div>
                    <p className="text-sm text-muted-foreground">{evaluation.grammaticalRange.feedback}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Strengths</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i} className="text-sm">{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-destructive">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {evaluation.improvements.map((i, idx) => (
                      <li key={idx} className="text-sm">{i}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-muted-foreground">
                  Word Count: {evaluation.wordCount}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate("/materials")} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Materials
                </Button>
                <Button onClick={() => generateTopic(topic!.taskType)} className="flex-1">
                  New Topic
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 container max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/materials")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant={topic?.taskType === 'task1' ? 'default' : 'outline'}
              onClick={() => generateTopic('task1')}
            >
              Task 1
            </Button>
            <Button
              variant={topic?.taskType === 'task2' ? 'default' : 'outline'}
              onClick={() => generateTopic('task2')}
            >
              Task 2
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>IELTS Writing Practice</CardTitle>
            <div className="flex gap-4 items-center mt-2">
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant="secondary">
                <FileText className="h-3 w-3 mr-1" />
                {wordCount} / {topic?.wordLimit} words
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Topic:</h3>
              <p className="text-sm leading-relaxed">{topic?.topic}</p>
              <p className="text-sm text-muted-foreground italic">{topic?.instructions}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Essay:</label>
              <Textarea
                value={essay}
                onChange={(e) => {
                  setEssay(e.target.value);
                  if (!isTimerRunning && e.target.value.length > 0) {
                    startWriting();
                  }
                }}
                placeholder="Start typing your essay here..."
                className="min-h-[400px] text-base leading-relaxed"
              />
            </div>

            <Button
              onClick={submitEssay}
              disabled={isEvaluating || !essay.trim()}
              className="w-full"
              size="lg"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Evaluating...
                </>
              ) : (
                'Submit for Evaluation'
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default WritingPractice;
