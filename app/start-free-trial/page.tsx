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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";
import { addMonths, format } from "date-fns";
import { useRouter } from "next/navigation";
import type React from "react"; // Added import for React
import { useState } from "react";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Construction",
  "Agriculture",
  "Entertainment",
  "Hospitality",
  "Transportation",
  "Energy",
  "Real Estate",
  "Media",
  "Telecommunications",
  "Consulting",
  "Non-profit",
  "Other",
];

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function StartFreeTrialPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [organizationId, setOrganizationId] = useState("");
  const [trialEndDate, setTrialEndDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trialEndDate = addMonths(new Date(), 3);
      const response = await fetch("/api/create-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          companyName,
          companyIndustry,
          companySize,
          companyCountry: companyCountry.toLowerCase(),
          companyCity: companyCity.toLowerCase(),
          companyPhoneNumber,
          gender,
          trialEndDate: trialEndDate.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizationId(data.organizationId);
        setTrialEndDate(format(trialEndDate, "MMMM d, yyyy"));
        setShowConfirmation(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({
        title: t("errors.failedToCreateOrganization"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    router.push("/admin");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("startFreeTrialPage.title")}</CardTitle>
          <CardDescription>
            {t("startFreeTrialPage.description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {t("startFreeTrialPage.firstName")}
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {t("startFreeTrialPage.lastName")}
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t("startFreeTrialPage.gender")}</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("startFreeTrialPage.selectGender")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">{t("gender.male")}</SelectItem>
                  <SelectItem value="FEMALE">{t("gender.female")}</SelectItem>
                  <SelectItem value="OTHER">{t("gender.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("startFreeTrialPage.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">
                {t("startFreeTrialPage.companyName")}
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhoneNumber">
                {t("startFreeTrialPage.companyPhoneNumber")}
              </Label>
              <Input
                id="companyPhoneNumber"
                type="tel"
                value={companyPhoneNumber}
                onChange={(e) => setCompanyPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyIndustry">
                {t("startFreeTrialPage.companyIndustry")}
              </Label>
              <Select
                value={companyIndustry}
                onValueChange={setCompanyIndustry}
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("startFreeTrialPage.selectIndustry")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {t(`industries.${industry.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">
                {t("startFreeTrialPage.companySize")}
              </Label>
              <Select
                value={companySize}
                onValueChange={setCompanySize}
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("startFreeTrialPage.selectCompanySize")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {t(`companySizes.${size.replace("+", "Plus")}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCountry">
                {t("startFreeTrialPage.country")}
              </Label>
              <Input
                id="companyCountry"
                value={capitalizeWords(companyCountry)}
                onChange={(e) =>
                  setCompanyCountry(e.target.value.toLowerCase())
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCity">
                {t("startFreeTrialPage.city")}
              </Label>
              <Input
                id="companyCity"
                value={capitalizeWords(companyCity)}
                onChange={(e) => setCompanyCity(e.target.value.toLowerCase())}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? t("startFreeTrialPage.creating")
                : t("startFreeTrialPage.buttonText")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("startFreeTrialPage.confirmationTitle")}
            </DialogTitle>
            <DialogDescription>
              {t(
                `startFreeTrialPage.organizationCreatedDescription ${organizationId} ${trialEndDate}`
              )}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleConfirmationClose}>
            {t("startFreeTrialPage.goToDashboard")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
