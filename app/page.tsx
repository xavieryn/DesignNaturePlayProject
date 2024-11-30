import Bluetooth from "@/components/Bluetooth";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col text-center gap-8 row-start-2 items-center ">
        <div className="flex text-center align-items-center justify-center">
          Door Project
        </div>
        <Bluetooth />
      </main>
      <footer className="pt-20 flex gap-6 flex-wrap items-center justify-center">
        <div>
          <a href="https://github.com/xavieryn">
            <Github />
          </a>
        </div>
      </footer>
    </div>
  );
}
