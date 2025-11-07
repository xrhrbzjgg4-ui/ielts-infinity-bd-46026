import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Sparkles, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Eduint IELTS Infinity
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering Bangladeshi students to achieve their global dreams through AI-powered IELTS preparation
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="shadow-card border-border/40">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize IELTS preparation for every Bangladeshi student by providing unlimited, 
                    AI-powered, world-class learning resources that make achieving dream band scores accessible and affordable.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/40">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the #1 IELTS preparation platform in South Asia, enabling thousands of students 
                    to pursue higher education and career opportunities in top universities and countries worldwide.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Story */}
            <div className="max-w-4xl mx-auto space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Story</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                Built by Learners, for Learners
              </h2>
              
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Eduint IELTS Infinity was born from a simple observation: too many talented Bangladeshi students 
                  were struggling with IELTS preparation due to expensive coaching, limited practice materials, 
                  and lack of personalized guidance.
                </p>
                <p>
                  We believed that in the age of AI, IELTS preparation shouldn't be a barrier to global opportunities. 
                  Every student deserves access to unlimited practice, instant feedback, and expert guidance - 
                  regardless of their location or financial situation.
                </p>
                <p>
                  Today, we're proud to serve over 10,000 students across Bangladesh, helping them achieve an 
                  average band score of 8.5 and secure admissions to top universities worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-gradient-card">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-card border-border/40">
                <CardContent className="p-8 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Student-First</h3>
                  <p className="text-muted-foreground">
                    Every decision we make prioritizes student success and learning outcomes
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/40">
                <CardContent className="p-8 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Innovation</h3>
                  <p className="text-muted-foreground">
                    We leverage cutting-edge AI to create the most effective learning experience
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/40">
                <CardContent className="p-8 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Accessibility</h3>
                  <p className="text-muted-foreground">
                    Quality IELTS preparation should be affordable and available to everyone
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
