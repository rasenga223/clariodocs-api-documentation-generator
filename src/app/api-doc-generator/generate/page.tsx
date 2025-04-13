"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/supabase";
import { DocumentationForm } from "@/components/api-doc-generator/documentation-form";
import { PageHeader } from "@/components/api-doc-generator/page-header";

export default function GenerateDocumentationPage() {
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if (!user) {
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  return (
    <div className="p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Generate API Documentation"
          backLink="/api-doc-generator/generate"
        />

        <div className="">
          <h2 className="mb-4 text-2xl font-bold">API Specification</h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-300">
            Enter your API specification in OpenAPI/Swagger JSON, YAML, or
            Postman Collection format. Our AI will analyze it and generate
            beautiful documentation.
          </p>

          <DocumentationForm />
        </div>
      </div>
    </div>
  );
}
