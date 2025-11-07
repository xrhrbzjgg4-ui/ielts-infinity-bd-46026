import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Mic, Square, Play } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface SpeakingTopic {
  part: string;
  topic: string;
  questions?: string[];
  prompts?: string[];
  timeLimit: number;
  preparationTime?: number;
  instructions: string;
}

interface Evaluation {
  overallBand: number;
  fluencyCoherence: { score: number; feedback: string };
  lexicalResource: { score: number; feedback: string };
  grammaticalRange: { score: number; feedback: string };
  pronunciation: { score: number; feedback: string };
  strengths: string[];
  improvements: string[];
  duration: string;
}

const SpeakingPractice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [topic, setTopic] = useState<SpeakingTopic | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentPart, setCurrentPart] = useState('part1');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    generateTopic('part1');
    setupSpeechRecognition();
  }, []);

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };
    }
  };

  const generateTopic = async (part: string) => {
    setIsLoading(true);
    setAudioBlob(null);
    setAudioURL("");
    setTranscript("");
    setEvaluation(null);
    setCurrentPart(part);

    try {
      const { data, error } = await supabase.functions.invoke('generate-speaking-topic', {
        body: { part }
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setTopic(data);
    } catch (error) {
      console.error('Error generating topic:', error);
      toast.error('Failed to generate speaking topic');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript("");

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      toast.success('Recording started!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      toast.success('Recording stopped!');
    }
  };

  const evaluateResponse = async () => {
    if (!transcript.trim()) {
      toast.error('No transcript available. Please ensure your microphone is working.');
      return;
    }

    setIsEvaluating(true);

    try {
      const { data, error } = await supabase.functions.invoke('evaluate-speaking', {
        body: { 
          transcript, 
          topic: topic!.topic, 
          part: currentPart 
        }
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setEvaluation(data);
      toast.success('Response evaluated successfully!');
    } catch (error) {
      console.error('Error evaluating response:', error);
      toast.error('Failed to evaluate response');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Generating speaking topic...</p>
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
              <CardTitle className="text-center">Speaking Evaluation</CardTitle>
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
                    <CardTitle className="text-sm">Fluency & Coherence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {evaluation.fluencyCoherence.score}
                    </div>
                    <p className="text-sm text-muted-foreground">{evaluation.fluencyCoherence.feedback}</p>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pronunciation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {evaluation.pronunciation.score}
                    </div>
                    <p className="text-sm text-muted-foreground">{evaluation.pronunciation.feedback}</p>
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

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Your Transcript:</h3>
                  <p className="text-sm leading-relaxed">{transcript}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate("/materials")} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Materials
                </Button>
                <Button onClick={() => generateTopic(currentPart)} className="flex-1">
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
              variant={currentPart === 'part1' ? 'default' : 'outline'}
              onClick={() => generateTopic('part1')}
            >
              Part 1
            </Button>
            <Button
              variant={currentPart === 'part2' ? 'default' : 'outline'}
              onClick={() => generateTopic('part2')}
            >
              Part 2
            </Button>
            <Button
              variant={currentPart === 'part3' ? 'default' : 'outline'}
              onClick={() => generateTopic('part3')}
            >
              Part 3
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>IELTS Speaking Practice</CardTitle>
            <Badge variant="secondary" className="w-fit">
              {topic?.part.replace('part', 'Part ')}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Topic: {topic?.topic}</h3>
              <p className="text-sm text-muted-foreground italic">{topic?.instructions}</p>
              
              {topic?.questions && (
                <ul className="list-disc list-inside space-y-1 mt-3">
                  {topic.questions.map((q, i) => (
                    <li key={i} className="text-sm">{q}</li>
                  ))}
                </ul>
              )}

              {topic?.prompts && (
                <div className="mt-3 space-y-1">
                  {topic.prompts.map((p, i) => (
                    <p key={i} className="text-sm">{p}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                {!isRecording && !audioBlob && (
                  <Button
                    onClick={startRecording}
                    className="flex-1"
                    size="lg"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="flex-1"
                    size="lg"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {isRecording && (
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 bg-destructive rounded-full animate-pulse" />
                    <p className="text-sm font-medium">Recording in progress...</p>
                  </div>
                </div>
              )}

              {audioURL && (
                <div className="space-y-4">
                  <audio src={audioURL} controls className="w-full" />
                  <Button
                    onClick={evaluateResponse}
                    disabled={isEvaluating || !transcript}
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
                </div>
              )}

              {transcript && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Live Transcript:</h4>
                  <p className="text-sm leading-relaxed">{transcript}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SpeakingPractice;
