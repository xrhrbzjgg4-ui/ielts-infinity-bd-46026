import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative bg-gradient-primary rounded-3xl p-8 md:p-16 shadow-glow overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
          
          <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
              Start Your IELTS Journey Today
            </h2>
            
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of Bangladeshi students who achieved their dream IELTS scores. 
              Get unlimited access to all features with our 7-day free trial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="premium" 
                size="lg" 
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow border-none"
                onClick={() => window.location.href = '/auth'}
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => window.location.href = '/ai-buddy'}
              >
                View Pricing
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/70">
              No credit card required • Cancel anytime • Full access to all features
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
