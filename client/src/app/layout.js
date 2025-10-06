"use client";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ka">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="საქმის მენეჯერი - სამართლებრივი საქმეების მართვის სისტემა"
        />
        <title>საქმის მენეჯერი</title>
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main style={{ paddingTop: "70px", minHeight: "100vh" }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
