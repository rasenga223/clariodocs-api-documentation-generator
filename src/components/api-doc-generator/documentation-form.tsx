"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { generateDocumentation, AVAILABLE_MODELS } from "@/lib/openrouter";
import {
  createProject,
  saveMdxFiles,
  updateProjectStatus,
  saveAiJob,
  updateAiJob,
} from "@/lib/docService";
import { getUser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  apiSpec: z.string().min(1, "API specification is required"),
  fileType: z.string(),
  model: z.string(),
  template: z.string(),
  extraInstructions: z.string().optional(),
});

export function DocumentationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelOptions, setModelOptions] = useState<typeof AVAILABLE_MODELS>([]);
  const [defaultModelSet, setDefaultModelSet] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "My API Documentation",
      description: "",
      apiSpec: "",
      fileType: "openapi",
      model:
        AVAILABLE_MODELS && AVAILABLE_MODELS.length > 0
          ? AVAILABLE_MODELS[0].id
          : "",
      template: "minimal",
      extraInstructions: "",
    },
  });

  // Load model options
  useEffect(() => {
    // Ensure AVAILABLE_MODELS is loaded before setting the form value
    if (AVAILABLE_MODELS && AVAILABLE_MODELS.length > 0) {
      setModelOptions(AVAILABLE_MODELS);

      // Set the default model to the first available model if not already set
      if (!defaultModelSet) {
        form.setValue("model", AVAILABLE_MODELS[0].id);
        setDefaultModelSet(true);
      }
    }
  }, [form, defaultModelSet]);

  /**
   * Handle form submission to generate documentation
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the current user
      const user = await getUser();
      if (!user) {
        setError("You must be logged in to generate documentation");
        setIsLoading(false);
        return;
      }

      // First create a project in the database
      const project = await createProject(
        values.title,
        values.description || `Generated API documentation for ${values.title}`,
        values.fileType,
        user.id,
      );

      if (!project) {
        throw new Error("Failed to create project. Please try again.");
      }

      console.log("📝 Created project:", project.id);

      // Update project status to processing
      await updateProjectStatus(project.id!, "processing");

      // Create an AI job record
      await saveAiJob(project.id!, values.model);

      // Store the API specification in sessionStorage for access in the preview page
      sessionStorage.setItem("apiSpec", values.apiSpec);
      sessionStorage.setItem("fileType", values.fileType);
      sessionStorage.setItem("model", values.model);
      sessionStorage.setItem("template", values.template);
      sessionStorage.setItem("projectId", project.id!);
      console.log("💾 Saved project ID to sessionStorage:", project.id);

      // Generate documentation
      const mdxFiles = await generateDocumentation(
        values.apiSpec,
        values.model,
        {
          fileType: values.fileType,
          template: values.template,
          extraInstructions: values.extraInstructions,
        },
      );

      // Log the response for debugging
      console.log("📄 Generated docs:", mdxFiles);

      // Ensure each file has both filename and content fields
      const formattedFiles = formatMdxFiles(mdxFiles);

      // Check if we received meaningful data
      if (formattedFiles.length === 0) {
        // Update AI job to failed
        await updateAiJob(
          project.id!,
          "failed",
          "No documentation content was generated",
        );
        throw new Error(
          "No documentation content was generated. Please try again or check your API specification.",
        );
      }

      // Save the MDX files to the database
      const saveSuccess = await saveMdxFiles(project.id!, formattedFiles);

      if (!saveSuccess) {
        throw new Error(
          "Failed to save documentation to database. Please try again.",
        );
      }

      // Mark AI job as completed
      await updateAiJob(project.id!, "completed");

      // Store generated MDX files in sessionStorage
      sessionStorage.setItem("generatedDocs", JSON.stringify(formattedFiles));
      console.log("💾 Saved formatted docs to sessionStorage");

      // Store project ID for access in the editor
      sessionStorage.setItem("currentProjectId", project.id!);

      // Navigate to preview page
      router.push("/api-doc-generator/preview");
    } catch (err) {
      console.error("Error generating documentation:", err);
      setError(
        err instanceof Error
          ? `${err.message}. Please check your API specification and try again.`
          : "Failed to generate documentation. Please try again or check your API specification.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format MDX files to ensure they have filename and content
   */
  const formatMdxFiles = (mdxFiles: any[]) => {
    return mdxFiles.map((file, index) => {
      // For string items, convert to object
      if (typeof file === "string") {
        return {
          filename: `section-${index + 1}.mdx`,
          content: file,
        };
      }

      // For objects, ensure they have the right properties
      return {
        filename: file.filename || `section-${index + 1}.mdx`,
        content:
          file.content ||
          (typeof file === "string" ? file : JSON.stringify(file)),
      };
    });
  };

  // Get the selected model's full text for display with truncation
  const getSelectedModelText = (modelId: string) => {
    const model = modelOptions.find((m) => m.id === modelId);
    if (!model) return "";

    // Just show the model name without description in the select trigger
    return model.name;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Project Details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* API Specification Input */}
        <FormField
          control={form.control}
          name="apiSpec"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paste your API specification here</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={12}
                  placeholder={`# Example OpenAPI YAML\nopenapi: 3.0.0\ninfo:\n  title: Sample API\n  description: A sample API to demonstrate OpenAPI features\n  version: 1.0.0\npaths:\n  /hello:\n    get:\n      summary: Hello endpoint\n      responses:\n        '200':\n          description: Successful response`}
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* File Type Selector */}
          <FormField
            control={form.control}
            name="fileType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specification Format</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-fit min-w-[300px]">
                    <SelectItem value="openapi">
                      OpenAPI/Swagger (JSON/YAML)
                    </SelectItem>
                    <SelectItem value="postman">Postman Collection</SelectItem>
                    <SelectItem value="apiblueprint">API Blueprint</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Model Selector */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Model</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue className="truncate">
                        {field.value
                          ? getSelectedModelText(field.value)
                          : "Select AI model"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full max-w-[90vw] min-w-80">
                    {modelOptions.map((m) => (
                      <SelectItem
                        key={m.id}
                        value={m.id}
                        className="flex flex-col items-start py-2"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="text-muted-foreground mt-1 text-xs">
                          {m.description}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Template Selector */}
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentation Template</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select template"
                      className="truncate"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full max-w-[90vw] min-w-80">
                  <SelectItem value="minimal">
                    Minimal - Clean, simple documentation
                  </SelectItem>
                  <SelectItem value="developer">
                    Developer Hub - Comprehensive with code examples
                  </SelectItem>
                  <SelectItem value="enterprise">
                    Enterprise - Formal with detailed schemas
                  </SelectItem>
                  <SelectItem value="interactive">
                    Interactive - Playground-focused with live testing
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extra Instructions */}
        <FormField
          control={form.control}
          name="extraInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Add any specific instructions or preferences for your documentation..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="px-6 py-3">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Documentation...
              </>
            ) : (
              <>Generate Documentation</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
