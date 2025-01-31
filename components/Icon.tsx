import React from "react";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface IconProps extends Omit<React.ComponentPropsWithoutRef<"svg">, "ref"> {
  name: IconName;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, ...props }, ref) => {
    const LucideIcon = LucideIcons[name] as React.ComponentType<
      React.SVGProps<SVGSVGElement>
    >;

    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    return <LucideIcon ref={ref} {...props} />;
  }
);

Icon.displayName = "Icon";
