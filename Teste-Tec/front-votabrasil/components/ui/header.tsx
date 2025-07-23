"use client";

import { FaShieldAlt } from "react-icons/fa";
import Link from "next/link";

export   default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <FaShieldAlt className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Deputados Insights
          </h1>
        </Link>
      </div>
    </header>
  );
}

