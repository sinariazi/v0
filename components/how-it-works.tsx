export default function HowItWorks() {
  const steps = [
    {
      title: "Sign Up",
      description:
        "Create your Mood Whisper account and set up your organization profile.",
    },
    {
      title: "Invite Team",
      description:
        "Invite your employees to join the platform and start sharing their moods.",
    },
    {
      title: "Track & Analyze",
      description:
        "Monitor real-time mood data and analyze trends to improve workplace satisfaction.",
    },
    {
      title: "Take Action",
      description:
        "Implement changes based on insights to boost employee engagement and productivity.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
