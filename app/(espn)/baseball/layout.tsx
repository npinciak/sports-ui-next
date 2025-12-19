interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {


  return (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 sm:px-16 px-8 bg-white dark:bg-black sm:items-start">
      {children}
    </main>
  </div>);
}
