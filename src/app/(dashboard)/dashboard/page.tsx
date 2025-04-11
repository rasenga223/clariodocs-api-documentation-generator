"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cardsData = [
  {
    id: 1,
    title: "API Documentation Generator",
    description:
      "Upload your API specification file and create beautiful documentation in seconds.",
    link: "/api-doc-generator/generate",
    cta: "Create Documentation",
  },
  {
    id: 2,
    title: "Need a Sample API File?",
    description:
      "Download a sample OpenAPI/Swagger file to test our documentation generator.",
    link: "/download-sample",
    cta: "Download Sample File",
  },
];

const DashboardPage = () => {
  return (
    <div className="relative grid h-full bg-emerald-950/50 bg-[url(/static-image.webp)] p-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3">
        {cardsData.map(({ id, title, description, link, cta }) => (
          <Card
            key={id}
            className="gap-0 rounded-none border-none bg-transparent"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-emerald-800 dark:text-emerald-300">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="mb-4">
              <p className="text-pretty text-zinc-700 dark:text-zinc-300">
                {description}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={link}>
                <Button
                  variant="default"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                >
                  {cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
