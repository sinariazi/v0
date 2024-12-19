import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      description: "Perfect for small teams just getting started",
      features: [
        "Up to 25 employees",
        "Basic mood tracking",
        "Weekly reports",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: "$299",
      description: "Ideal for growing companies with advanced needs",
      features: [
        "Up to 100 employees",
        "Advanced mood analytics",
        "Daily reports",
        "Team collaboration tools",
        "Priority email support"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited employees",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "On-site training"
      ]
    }
  ]

  return (
    <section id="pricing" className="py-24 px-4 bg-muted scroll-mt-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4">{plan.price}<span className="text-xl font-normal text-muted-foreground">{plan.price !== 'Custom' ? '/month' : ''}</span></p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

