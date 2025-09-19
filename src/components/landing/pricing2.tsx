"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlySavingsText?: string;
  isPopular?: boolean;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
  // Base path for checkout. If a plan provides button.url, it will be used instead.
  checkoutBasePath?: string;
  // Optional callback to handle selection programmatically
  onSelectPlan?: (planId: string, interval: "monthly" | "yearly") => void;
}

const Pricing2 = ({
  heading = "Pricing",
  description = "Fair, transparent pricing. Pay only for what you translate.",
  plans = [
    {
      id: "starter",
      name: "Starter",
      description: "For individuals & casual users",
      monthlyPrice: "$9.99",
      yearlyPrice: "$99.90",
      yearlySavingsText: "save $20",
      features: [
        { text: "Up to 480,000 words / month" },
        { text: "Translate PDF, EPUB, DOCX, TXT" },
        { text: "Standard processing speed" },
        { text: "Community support" },
      ],
      button: {
        text: "Purchase",
        url: "/auth/sign-up",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "For professionals & researchers",
      monthlyPrice: "$29.99",
      yearlyPrice: "$299",
      yearlySavingsText: "save $60",
      isPopular: true,
      features: [
        { text: "Up to 1,560,000 words / month" },
        { text: "Priority translation speed" },
        { text: "Advanced file handling (large files)" },
        { text: "Email support" },
      ],
      button: {
        text: "Purchase",
        url: "/auth/sign-up",
      },
    },
    {
      id: "business",
      name: "Business",
      description: "For teams & heavy users",
      monthlyPrice: "$99.90",
      yearlyPrice: "$999",
      yearlySavingsText: "save $200",
      features: [
        { text: "Up to 5,350,000 words / month" },
        { text: "Team accounts & API access" },
        { text: "Bulk uploads & custom dictionaries" },
        { text: "Priority support" },
      ],
      button: {
        text: "Purchase",
        url: "/auth/sign-up",
      },
    },
  ],
  checkoutBasePath = "/auth/sign-up",
  onSelectPlan,
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-xl">{description}</p>
          <div className="flex items-center gap-3 text-lg">
            Monthly
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            <span className="inline-flex items-center gap-2">
              Yearly
              <span className="text-xs text-muted-foreground">(save ~17%)</span>
            </span>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="flex flex-col justify-between text-left"
              >
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <p>{plan.name}</p>
                      {plan.isPopular && (
                        <span className="rounded-md border border-border px-2 py-0.5 text-xs">⭐ Most Popular</span>
                      )}
                    </div>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className={isYearly ? "text-muted-foreground" : "font-semibold"}>
                      {`${plan.monthlyPrice}/mo — billed monthly`}
                    </p>
                    <p className={isYearly ? "font-semibold" : "text-muted-foreground"}>
                      {`${plan.yearlyPrice}/yr — billed yearly${plan.yearlySavingsText ? ` (${plan.yearlySavingsText})` : ""}`}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <p className="mb-3 font-semibold">Includes:</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleCheck className="size-4" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  {(() => {
                    const interval = (isYearly ? "yearly" : "monthly") as
                      | "monthly"
                      | "yearly";
                    const baseUrl = plan.button?.url || checkoutBasePath;
                    const url = `${baseUrl}${baseUrl?.includes("?") ? "&" : "?"}plan=${encodeURIComponent(
                      plan.id
                    )}&interval=${interval}`;
                    const text = plan.button?.text || "Get started";

                    if (onSelectPlan) {
                      return (
                        <Button
                          className="w-full"
                          onClick={() => onSelectPlan(plan.id, interval)}
                          aria-label={`Choose ${plan.name} ${interval}`}
                        >
                          {text}
                        </Button>
                      );
                    }

                    const isExternal = /^https?:\/\//i.test(baseUrl);
                    return (
                      <Button asChild className="w-full">
                        <a href={url} target={isExternal ? "_blank" : undefined}>
                          {text}
                        </a>
                      </Button>
                    );
                  })()}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
