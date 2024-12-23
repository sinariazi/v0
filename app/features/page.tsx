import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  PieChart,
  TrendingUp,
  Shield,
  Users,
  Bell,
  LineChart,
  Zap,
} from "lucide-react";

const features = [
  {
    name: "Advanced Analytics Dashboard",
    description:
      "Gain deep insights into employee sentiment with our comprehensive analytics suite.",
    icon: BarChart,
  },
  {
    name: "Predictive Mood Forecasting",
    description:
      "Anticipate team morale shifts with our AI-powered predictive algorithms.",
    icon: TrendingUp,
  },
  {
    name: "Customizable Data Visualization",
    description:
      "Create bespoke reports and visualizations to track the metrics that matter most to your organization.",
    icon: PieChart,
  },
  {
    name: "Enterprise-Grade Data Security",
    description:
      "Rest easy knowing your sensitive data is protected by state-of-the-art encryption and security measures.",
    icon: Shield,
  },
  {
    name: "Team Collaboration Tools",
    description:
      "Foster better communication and teamwork within your organization with integrated collaboration features.",
    icon: Users,
  },
  {
    name: "Real-time Notifications",
    description:
      "Stay informed with instant alerts on significant mood changes or emerging trends.",
    icon: Bell,
  },
  {
    name: "Historical Trend Analysis",
    description:
      "Track long-term patterns and progress with our powerful historical data analysis tools.",
    icon: LineChart,
  },
  {
    name: "Integration Capabilities",
    description:
      "Seamlessly connect Mood Whisper with your existing HR and productivity tools for a unified workflow.",
    icon: Zap,
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Mood Whisper Features
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Discover the powerful tools and capabilities that make Mood Whisper the
        leading employee engagement platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <feature.icon className="h-6 w-6 mr-2 text-primary" />
                {feature.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
