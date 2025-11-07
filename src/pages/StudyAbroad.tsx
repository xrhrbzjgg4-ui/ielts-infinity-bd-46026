import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, GraduationCap, MapPin, DollarSign, FileCheck, Globe } from "lucide-react";

const countries = [
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    minBand: "6.5-7.0",
    universities: "150+ Partner Unis",
    visaType: "Student Visa (Tier 4)",
    scholarships: "Commonwealth, Chevening",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    minBand: "6.0-7.0",
    universities: "100+ Partner Unis",
    visaType: "Study Permit",
    scholarships: "Vanier, Trudeau",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    minBand: "6.5-7.0",
    universities: "120+ Partner Unis",
    visaType: "Student Visa (500)",
    scholarships: "Australia Awards",
  },
  {
    name: "United States",
    flag: "🇺🇸",
    minBand: "6.5-7.5",
    universities: "200+ Partner Unis",
    visaType: "F-1 Student Visa",
    scholarships: "Fulbright, Various",
  },
];

const steps = [
  {
    icon: GraduationCap,
    title: "Choose Your Destination",
    description: "Select the country and university that matches your career goals and budget.",
  },
  {
    icon: FileCheck,
    title: "Achieve Target IELTS Score",
    description: "Use our platform to reach the required band score for your chosen destination.",
  },
  {
    icon: Globe,
    title: "Prepare Your Documents",
    description: "Get guidance on all required documents including SOP, LORs, and financial proof.",
  },
  {
    icon: DollarSign,
    title: "Apply for Scholarships",
    description: "Explore and apply for scholarships to reduce your education costs.",
  },
  {
    icon: Plane,
    title: "Complete Visa Process",
    description: "Follow our step-by-step visa application guide for your destination country.",
  },
  {
    icon: MapPin,
    title: "Start Your Journey",
    description: "Get pre-departure guidance and connect with other Bangladeshi students abroad.",
  },
];

const StudyAbroad = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Gateway to Global Education</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Study & Migrate{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Abroad Hub
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete guidance for Bangladeshi students planning to study or migrate to UK, Canada, Australia, USA, and beyond
            </p>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Popular Study Destinations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {countries.map((country, index) => (
                <Card key={index} className="shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-5xl">{country.flag}</div>
                      <h3 className="text-xl font-semibold">{country.name}</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{country.universities}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Band: {country.minBand}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{country.visaType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{country.scholarships}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 md:py-24 bg-gradient-card">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Your Journey to Study Abroad
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container">
            <Card className="bg-gradient-primary text-primary-foreground shadow-glow border-none">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Start Your Global Journey?
                </h2>
                <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                  Get personalized guidance on visa requirements, scholarships, and university applications for your dream destination
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="premium" 
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none"
                  >
                    Book Free Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Download Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudyAbroad;
