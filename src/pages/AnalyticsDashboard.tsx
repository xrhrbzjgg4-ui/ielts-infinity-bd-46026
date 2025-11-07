import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Target, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

  const stats = {
    overall: 6.5,
    reading: 7.0,
    writing: 6.0,
    listening: 6.5,
    speaking: 6.5,
    target: 7.5,
    streak: 12,
    testsCompleted: 24
  };

  const recentActivity = [
    { date: "Today", test: "Reading Practice", score: 85 },
    { date: "Yesterday", test: "Mock Test", score: 78 },
    { date: "2 days ago", test: "Vocabulary Game", score: 92 },
    { date: "3 days ago", test: "Listening Practice", score: 81 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 container">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/analytics")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Your Analytics Dashboard</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Overall Band Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{stats.overall}</div>
                <p className="text-sm text-muted-foreground mt-2">Target: {stats.target}</p>
                <Progress value={(stats.overall / stats.target) * 100} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{stats.streak}</div>
                <p className="text-sm text-muted-foreground mt-2">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tests Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{stats.testsCompleted}</div>
                <p className="text-sm text-muted-foreground mt-2">this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Module Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Reading", score: stats.reading },
                  { name: "Writing", score: stats.writing },
                  { name: "Listening", score: stats.listening },
                  { name: "Speaking", score: stats.speaking },
                ].map((module) => (
                  <div key={module.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{module.name}</span>
                      <span className="text-primary font-bold">{module.score}</span>
                    </div>
                    <Progress value={(module.score / 9) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{activity.test}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{activity.score}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Keep up the great work!</h3>
                  <p className="text-sm text-muted-foreground">
                    You're making excellent progress. With your current pace, you're on track to reach your target score of {stats.target} in approximately 3 months. Focus more on Writing to boost your overall score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;
