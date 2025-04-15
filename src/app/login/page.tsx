"use client";

import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchParamsHandler } from "@/components/elements/searchparams-handler";
import { useAuth } from "@/provider/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { signInWithGitHub, signInWithEmail } = useAuth();

  // Create the form instance with all methods.
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const [emailSent, setEmailSent] = useState<boolean>(false);

  const onSubmit = async (data: LoginFormValues) => {
    if (!data.email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const { error } = await signInWithEmail(data.email);
      if (error) {
        toast.error(error.message);
        return;
      }
      setEmailSent(true);
      toast.success("Check your email for the login link!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send login email");
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await signInWithGitHub();
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign in with GitHub");
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Check your email
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              We&apos;ve sent a login link to{" "}
              <span className="font-medium">{form.getValues("email")}</span>
            </p>
          </div>
          <Button
            onClick={() => setEmailSent(false)}
            className="w-full rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler />
      </Suspense>

      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            to continue to the application
          </p>
        </header>

        <section className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {form.formState.isSubmitting ? "Sending..." : "Send magic link"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex w-full items-center border-t border-zinc-300 dark:border-zinc-600" />
            <div className="relative flex justify-center text-sm">
              <span className="-mt-2.5 bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGitHubLogin}
            disabled={form.formState.isSubmitting}
            variant={"secondary"}
            className="w-full"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </Button>
        </section>

        <Link
          href="/"
          className="block text-center text-sm font-medium"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
