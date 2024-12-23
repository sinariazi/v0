import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Jane Doe",
    role: "CEO & Co-founder",
    bio: "Jane has over 15 years of experience in HR and employee engagement. She founded Mood Whisper to revolutionize workplace happiness.",
    avatar: "/team/jane-doe.jpg",
  },
  {
    name: "John Smith",
    role: "CTO & Co-founder",
    bio: "John is a data scientist with a passion for applying AI to solve real-world problems. He leads the tech team at Mood Whisper.",
    avatar: "/team/john-smith.jpg",
  },
  {
    name: "Emily Chen",
    role: "Head of Customer Success",
    bio: "Emily ensures that every Mood Whisper client gets the most out of our platform. She&apos;s dedicated to customer satisfaction.",
    avatar: "/team/emily-chen.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        About Mood Whisper
      </h1>
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-xl text-center text-muted-foreground mb-6">
          At Mood Whisper, we&apos;re on a mission to transform workplaces by
          harnessing the power of real-time employee engagement data.
        </p>
        <p className="text-lg text-center text-muted-foreground">
          Founded in 2020, we&apos;ve helped hundreds of companies improve their
          workplace culture, boost productivity, and retain top talent through
          our innovative platform.
        </p>
      </div>
      <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
