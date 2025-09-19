"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmitState = "idle" | "submitting" | "success" | "error";

export const ContactForm = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!emailAddress || !subject || !message) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setSubmitState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitState("success");
      setEmailAddress("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border p-6"
      aria-label="Contact form"
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Your email
          </label>
          <Input
            id="email"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">
            Details
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more about your request..."
            rows={6}
            required
          />
        </div>
        {errorMessage ? (
          <p className="text-sm text-red-500" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {submitState === "success" ? (
          <p className="text-sm text-emerald-500" role="status">
            Message sent! We will get back to you soon.
          </p>
        ) : null}
        <div>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            aria-label="Send message"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting" ? "Sending..." : "Send message"}
          </Button>
        </div>
      </div>
    </form>
  );
};


