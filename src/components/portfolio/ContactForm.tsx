"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/data/cv";

const ENDPOINT = "https://formspree.io/f/xjywlyzo";
type Status = "idle" | "sending" | "sent" | "error";

const field = "w-full rounded-2xl border border-white/15 bg-transparent px-5 py-4 text-on-brand placeholder:text-on-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-brand";
const label = "mb-2 block text-sm font-semibold text-on-brand/85";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot: bots fill it, people never see it
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} aria-labelledby="form-title" className="mt-10 grid gap-5">
      <h3 id="form-title" className="font-display text-2xl font-bold">Or send a brief here</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="cf-name" className={label}>Name</label><input id="cf-name" name="name" required autoComplete="name" className={field} /></div>
        <div><label htmlFor="cf-email" className={label}>Email</label><input id="cf-email" name="email" type="email" required autoComplete="email" className={field} /></div>
      </div>
      <div><label htmlFor="cf-msg" className={label}>Project or role</label><textarea id="cf-msg" name="message" required minLength={20} rows={5} className={field} /></div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <input type="hidden" name="_subject" value={`Portfolio enquiry for ${profile.name}`} />
      <button type="submit" disabled={status === "sending"} className="w-fit rounded-full bg-brand px-7 py-4 font-semibold text-on-brand transition-colors hover:bg-cta disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-on-brand">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-on-brand/85">
        {status === "sent" && "Thanks! I’ll reply within 24 hours."}
        {status === "error" && <>Couldn’t send. Please email <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>.</>}
      </p>
    </form>
  );
}