"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const STORAGE_KEY = "omnisim_guide_dismissed_v1";

type GuideStep = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

const guideByPath: Array<{ test: (path: string) => boolean; step: GuideStep }> = [
  {
    test: (path) => path === "/",
    step: {
      eyebrow: "Start Here",
      title: "Run one future test first.",
      body: "Pick a decision you care about, then let OmniSim expose pressure points, likely reactions, and the next move before you commit resources.",
      href: "/simulate",
      cta: "Choose simulation",
    },
  },
  {
    test: (path) => path === "/simulate",
    step: {
      eyebrow: "Simulation Hub",
      title: "Choose the closest reality model.",
      body: "Use Relationship, Profit Path, Election, Product Launch, Health Signal, or Custom. The tighter the category, the sharper the intelligence brief.",
      href: "/simulate/custom",
      cta: "Try custom",
    },
  },
  {
    test: (path) => path.startsWith("/simulate/") && path !== "/simulate/custom",
    step: {
      eyebrow: "Truth Intake",
      title: "Facts beat emotion here.",
      body: "Answer with what is true, what is unknown, and what boundary cannot be crossed. That is how OmniSim raises confidence instead of guessing.",
      href: "/auth?redirect=/history",
      cta: "Create memory",
    },
  },
  {
    test: (path) => path.startsWith("/results/"),
    step: {
      eyebrow: "Read The Output",
      title: "Use the Variable Lab.",
      body: "Do not stop at the prediction. Check the truth score, weak assumptions, variable lab, and seven-day action plan. That is where the useful move lives.",
      href: "/simulate",
      cta: "Run another",
    },
  },
  {
    test: (path) => path === "/history",
    step: {
      eyebrow: "Private Archive",
      title: "History is account-only.",
      body: "Sign in before running serious simulations so your history and future memory stay attached to your account.",
      href: "/auth?redirect=/history",
      cta: "Sign in",
    },
  },
];

export default function OmniGuide() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);
  const [open, setOpen] = useState(false);

  const current = useMemo(() => guideByPath.find((item) => item.test(pathname))?.step, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(saved);
    setOpen(!saved);
  }, []);

  if (!current || dismissed || !open) return null;

  function close() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[80] w-[calc(100vw-2rem)] max-w-sm sm:bottom-5 sm:right-5">
      <Card className="border-[rgba(0,255,65,0.28)] bg-[rgba(7,17,6,0.94)] shadow-[0_20px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <Badge variant="cyan">OmniGuide</Badge>
            <button type="button" onClick={close} className="text-xs font-bold text-[#84967e] transition hover:text-[#DDFEEB]" aria-label="Dismiss guide">
              ×
            </button>
          </div>
          <CardDescription>{current.eyebrow}</CardDescription>
          <CardTitle>{current.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-semibold leading-6 text-[#DDFEEB]">{current.body}</p>
        </CardContent>
        <CardFooter className="justify-between">
          <Link href={current.href} className="btn-solid min-h-[38px] px-4 text-[9px]">
            {current.cta}
          </Link>
          <Button type="button" variant="ghost" size="sm" onClick={close}>
            Hide
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}