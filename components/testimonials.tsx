"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t("testimonials.sarah.name"),
      role: t("testimonials.sarah.role"),
      content: t("testimonials.sarah.content"),
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: t("testimonials.michael.name"),
      role: t("testimonials.michael.role"),
      content: t("testimonials.michael.content"),
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: t("testimonials.emily.name"),
      role: t("testimonials.emily.role"),
      content: t("testimonials.emily.content"),
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("testimonials.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
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
  );
}
