import Image from "next/image";
import Link from "next/link";
import { Menu, FolderClosed, Upload, Zap } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect("/translate");
  }
  return (
    <div className="min-h-svh w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-svh w-40 flex-col items-center justify-between border-r border-border bg-foreground/5 px-3 py-6">
        <div className="flex w-full flex-col items-center gap-8">
          <button
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="flex w-full flex-col items-center gap-4">
            <Link
              href="#files"
              className="group flex w-full flex-col items-center gap-2 rounded-xl px-3 py-3 text-center text-sm text-muted-foreground hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Files"
              tabIndex={0}
            >
              <FolderClosed className="h-6 w-6" />
              <span>Files</span>
            </Link>
            <Link
              href="#upload"
              className="group flex w-full flex-col items-center gap-2 rounded-xl bg-foreground/10 px-3 py-3 text-center text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-current="page"
              aria-label="Upload"
              tabIndex={0}
            >
              <Upload className="h-6 w-6" />
              <span>Upload</span>
            </Link>
          </nav>
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          <Link
            href="#pro"
            className="flex flex-col items-center gap-2 text-sm text-cyan-400"
            aria-label="Get Pro"
            tabIndex={0}
          >
            <Zap className="h-6 w-6" />
            <span>Get Pro</span>
          </Link>
          <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
            <Image src="/vercel.svg" alt="User avatar" width={40} height={40} className="dark:invert" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-40">
        <main className="flex flex-col items-center gap-[32px] p-8 pb-20 sm:items-start sm:p-20">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol className="list-inside list-decimal text-sm/6 text-center font-mono sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]">
                src/app/page.tsx
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
          </ol>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <a
              className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:w-auto sm:px-5 sm:text-base"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
              Deploy now
            </a>
            <a
              className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:w-auto sm:px-5 md:w-[158px]"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </main>
        <footer className="flex flex-wrap items-center justify-center gap-[24px] px-8 pb-8">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </div>
  );
}
