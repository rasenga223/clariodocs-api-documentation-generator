import "./styles/globals.css";

export const metadata = {
  title: "API Documentation Generator",
  description: "GitBook-style editor to generate and edit MDX content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}