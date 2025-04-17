"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ExternalLink, Calendar, Edit } from "lucide-react";
import { getUserProjects, DocProject } from "@/lib/docService";
import { useAuth } from "@/provider/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Quick actions for new users
const quickActions = [
  {
    id: 1,
    title: "Generate Docs",
    link: "/api-doc-generator/generate",
    icon: <Upload className="w-5 h-5 text-primary" />,
  },
  {
    id: 2,
    title: "Sample Files",
    link: "/download-sample",
    icon: <FileText className="w-5 h-5 text-primary" />,
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<DocProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const userProjects = await getUserProjects(user.id);
        setProjects(userProjects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Hey there 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back to your API documentation dashboard.
          </p>
        </div>
        
        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {quickActions.map(({ id, title, link, icon }) => (
              <Link key={id} href={link}>
                <Card className="transition-all duration-200 border shadow-sm hover:shadow-lg hover:-translate-y-0.5 border-border/30 bg-card/30 backdrop-blur-sm hover:bg-card/50">
                  <CardContent className="flex items-center gap-2.5 py-2.5 px-4">
                    <div className="p-1.5 rounded-md bg-primary/10 ring-1 ring-primary/5">
                      {icon}
                    </div>
                    <span className="text-sm font-medium text-foreground/90">{title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Projects Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Your Projects</h2>
            <Link href="/api-doc-generator/generate">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            // Loading skeleton
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border border-border/50">
                  <CardHeader>
                    <Skeleton className="w-3/4 h-8" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="w-full h-12 mb-2" />
                    <div className="flex items-center mt-4 space-x-2">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="w-1/3 h-4" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="w-full h-10" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="relative overflow-hidden transition-all duration-300 border group hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                >
                  <div className={cn(
                    "absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full",
                    project.status === 'ready' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                    project.status === 'processing' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", 
                    project.status === 'failed' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                    project.status === 'draft' && "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
                  )}>
                    {project.status && project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="mb-4 text-pretty text-muted-foreground line-clamp-2">
                      {project.description || "No description provided."}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      <span>Updated {formatDate(project.updated_at)}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Link href={`/editor?projectId=${project.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        className="flex justify-center w-full gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/preview/${project.id}`} className="flex-1">
                      <Button 
                        variant="default" 
                        className="flex justify-center w-full gap-2 transition-colors duration-200 bg-primary/90 hover:bg-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Preview
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-xl border-border/50 bg-card/20">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">No projects yet</h3>
              <p className="mb-4 text-muted-foreground">
                Create your first API documentation project to get started
              </p>
              <Link href="/api-doc-generator/generate">
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Create New Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
