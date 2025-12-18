import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <a
            href="https://www.clancodelabs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Clancode Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
