import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";
import Image from "next/image";
import me from "@/assets/dummy-profile.jpg";
import { H2 } from "@/components/ui/H2";
import { Bot } from "lucide-react";

export const metadata: Metadata = {
  title: "Uday Saraswat - Smart Portfolio",
};
export default function Home() {
  return (
    <section className="space-y-16 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat px-1 py-8">
      <section className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <H1 className="text-center sm:text-start">Hi I&apos;m Uday 👋</H1>
          <p className="text-center sm:text-start">
            I&apos;m a full-stack developer from India who build's cool
            projects, For more detail you can checkout my github profile.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src={me}
            alt="A photo of me"
            height={300}
            width={300}
            className="dark:border-foreground aspect-square rounded-full border-2 object-cover shadow-md"
          />
        </div>
      </section>
      <section className="space-y-3 text-center">
        <H2>Ask the chatbot anything about me</H2>
        <p>
          Click the little <Bot className="inline pb-1"/> icon in the top bar to activate the AI chat.
          you can ask the chatbot any question about me and it will find the
          relevant info on this website. The bot can even provide links to pages
          you&apos;re looking for.
        </p>
      </section>
    </section>
  );
}
