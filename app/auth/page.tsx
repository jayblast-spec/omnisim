"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AUTH_ORIGIN = "https://omnisim-platform.vercel.app";

function safeRedirectPath(value: string) {
  if (!value.startsWith("/")) return "/history";
  if (value.startsWith("//")) return "/history";
  return value;
}

function AuthInner() {
  const params = useSearchParams();
  const redirectTo = safeRedirectPath(params.get("redirect") || "/history");
  const [email, setEmail] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSessionEmail(data.session?.user.email ?? null);
      if (window.location.hash.includes("access_token=")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setStatus("sending");
    setMessage("");
    const origin = AUTH_ORIGIN;
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${origin}/auth?redirect=${encodeURIComponent(redirectTo)}`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message || "Could not send sign-in link. Try again.");
      return;
    }

    setStatus("sent");
    setMessage("Check your email. OmniSim sent a secure sign-in link.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSessionEmail(null);
    setStatus("idle");
    setMessage("Signed out.");
  }

  return (
    <div className="page-shell min-h-screen px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-start">
        <section>
          <p className="section-label">OMNISIM ACCOUNT</p>
          <h1 className="page-heading mt-4 font-orbitron text-4xl font-black md:text-5xl">
            Start your private simulation memory.
          </h1>
          <p className="page-copy mt-5 max-w-xl text-sm font-semibold leading-8">
            Create or access your OmniSim account with a secure email link. Your future history, result memory, and private decision archive stay attached to you, not the public feed.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Private History", "Only your account can load your archive."],
              ["Memory Loop", "Future simulations can learn from your past runs."],
              ["Outcome Tracking", "Later, compare predictions with what happened."],
            ].map(([title, copy]) => (
              <div key={title} className="cyber-card p-4">
                <p className="font-orbitron text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#00FF41" }}>{title}</p>
                <p className="mt-2 text-xs font-semibold leading-6" style={{ color: "#DDFEEB" }}>{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cyber-card p-6 sm:p-8">
          {sessionEmail ? (
            <div>
              <p className="font-orbitron text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#00FF41" }}>Signed In</p>
              <p className="mt-4 text-sm font-semibold leading-7" style={{ color: "#DDFEEB" }}>
                You are signed in as <span style={{ color: "#00F5FF" }}>{sessionEmail}</span>.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={redirectTo} className="btn-neon inline-flex justify-center">
                  CONTINUE
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded px-5 py-3 font-orbitron text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "#DDFEEB", border: "1px solid rgba(221,254,235,0.18)", background: "rgba(5,18,8,0.62)" }}
                >
                  SIGN OUT
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="font-orbitron text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#00FF41" }}>Sign In / Sign Up</p>
              <label className="mt-6 block text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#BCEFD2" }} htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="mt-3 w-full rounded-xl px-4 py-4 text-sm font-semibold outline-none"
                style={{ color: "#F6FFF9", background: "rgba(5,18,8,0.72)", border: "1px solid rgba(0,255,65,0.24)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
              />
              <button type="submit" disabled={status === "sending"} className="btn-neon mt-5 w-full justify-center disabled:opacity-60">
                {status === "sending" ? "SENDING SECURE LINK" : "SEND SECURE LINK"}
              </button>
              {message && (
                <p className="mt-4 rounded-xl px-4 py-3 text-xs font-semibold leading-6" style={{ color: status === "error" ? "#FFD0E2" : "#DDFEEB", background: status === "error" ? "rgba(255,0,119,0.10)" : "rgba(0,255,65,0.08)", border: status === "error" ? "1px solid rgba(255,0,119,0.28)" : "1px solid rgba(0,255,65,0.22)" }}>
                  {message}
                </p>
              )}
              <p className="mt-5 text-[11px] font-semibold leading-6" style={{ color: "#BCEFD2" }}>
                No password needed. The link expires automatically and signs you into this browser.
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AuthInner />
    </Suspense>
  );
}