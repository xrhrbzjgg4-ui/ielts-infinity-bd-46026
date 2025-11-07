const stats = [
  { value: "10,000+", label: "Active Learners" },
  { value: "500K+", label: "Practice Questions" },
  { value: "8.5", label: "Average Band Score" },
  { value: "95%", label: "Success Rate" },
];

const Stats = () => {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
