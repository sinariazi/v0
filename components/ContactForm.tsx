"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/language-context";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactForm() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("contact.title")}
      </h1>
      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>{t("contact.getInTouch")}</CardTitle>
            <CardDescription>{t("contact.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input id="name" placeholder={t("contact.namePlaceholder")} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input
                    id="email"
                    placeholder={t("contact.emailPlaceholder")}
                    type="email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea
                    id="message"
                    placeholder={t("contact.messagePlaceholder")}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">{t("contact.sendMessage")}</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("contact.contactInformation")}</CardTitle>
            <CardDescription>
              {t("contact.contactInfoDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{t("contact.emailAddress")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{t("contact.phoneNumber")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{t("contact.address")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
