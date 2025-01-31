"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/lib/language-context";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type StripeEvent = {
  id: string;
  type: string;
  created: number;
  data: {
    object: {
      id: string;
      [key: string]: any;
    };
  };
};

export function BillingSection() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<StripeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/stripe-events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(t("billing.errorLoadingEvents"));
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes("succeeded") || eventType.includes("created")) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (eventType.includes("failed") || eventType.includes("deleted")) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return <div>{t("billing.loading")}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("billing.title")}</CardTitle>
        <CardDescription>{t("billing.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("billing.table.eventType")}</TableHead>
              <TableHead>{t("billing.table.date")}</TableHead>
              <TableHead>{t("billing.table.objectId")}</TableHead>
              <TableHead>{t("billing.table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(event.type)}
                    <span>{event.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(event.created * 1000).toLocaleString()}
                </TableCell>
                <TableCell>{event.data.object.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      event.type.includes("succeeded")
                        ? "success"
                        : event.type.includes("failed")
                        ? "destructive"
                        : "default"
                    }
                  >
                    {event.type.split(".").pop()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button onClick={fetchEvents}>{t("billing.refresh")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
