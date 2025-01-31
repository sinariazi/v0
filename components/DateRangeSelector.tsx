import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/language-context";

interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const { t } = useLanguage();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("dateRangeSelector.placeholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="30">{t("dateRangeSelector.last30Days")}</SelectItem>
        <SelectItem value="90">{t("dateRangeSelector.last90Days")}</SelectItem>
        <SelectItem value="180">
          {t("dateRangeSelector.last180Days")}
        </SelectItem>
        <SelectItem value="all">{t("dateRangeSelector.allTime")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
