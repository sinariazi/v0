import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director, TechCorp",
      content: "Mood Whisper's data-driven approach has revolutionized our employee engagement strategy. We've seen a 25% increase in overall job satisfaction since implementation.",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      name: "Michael Chen",
      role: "CEO, InnovateCo",
      content: "The predictive analytics from Mood Whisper have helped us proactively address potential issues, resulting in a 15% decrease in turnover and a 20% boost in productivity.",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      name: "Emily Rodriguez",
      role: "Team Lead, CreativeStudio",
      content: "The customizable dashboards allow us to track the metrics that matter most to our creative team. We've improved our project completion rate by 30% thanks to the insights from Mood Whisper.",
      avatar: "/placeholder.svg?height=40&width=40"
    }
  ]

  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

