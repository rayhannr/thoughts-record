"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const failed = useSearchParams().get("error") !== null;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(failed);

  async function signInWithGoogle() {
    setPending(true);
    setError(false);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className="py-10">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={pending}
        className="min-h-11 rounded-sm border border-rule bg-surface px-4 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        masuk dengan google
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-ink-muted">
          tidak bisa masuk. coba lagi.
        </p>
      )}
      <div className="mt-6">
        <Link
          href="/"
          className="-ml-2 inline-flex min-h-11 items-center rounded-sm px-2 text-sm text-ink-muted underline decoration-1 underline-offset-4"
        >
          lanjut tanpa akun
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
