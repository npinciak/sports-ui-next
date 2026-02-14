import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-4 py-16 bg-white dark:bg-black sm:items-start sm:px-8 md:px-16 md:py-32">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-2xl font-semibold leading-8 tracking-tight text-black dark:text-zinc-50 md:text-3xl md:leading-10">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400 md:text-lg md:leading-8">
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 text-base font-medium sm:w-auto sm:flex-row">
          <Link href="/baseball/2025/league/1463168196" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Sample League 1463168196 for 2025
            </Button>
          </Link>

          <Link href="baseball/2025/league/1463168196/team/5" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Sample Team 5 for 2025
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
