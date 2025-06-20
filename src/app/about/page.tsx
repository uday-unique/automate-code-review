import { H1 } from "@/components/ui/H1"
import { H2 } from "@/components/ui/H2"
import { Metadata } from "next"


export const metadata: Metadata = {
   title: "About me",
   description: "Learn more about uday saraswat and his work"
}

export default function Page() {
    return (
        <section className="space-y-6">
          <H1>About Me</H1>
          <section className="space-y-3">
          <H2>Who am I?</H2>
          <p>
          My name is Uday Saraswat and I am a self taught software developer from India.
          I started Programming in 2021 at the age of 25.
          </p>
          <p>
           I'm passionate about building cool websites and I love to learn latest technologies and dive into it. 
          </p>
          </section>
          <hr className="border-muted"/>
          <section className="space-y-3">
            <H2>Skills</H2>
            <p>
              I am Full Stack Developer specializing in Reactjs, Nextjs, and Nodejs.
            </p>
            <p>
            I prefer web development because you can use a modern website on almost every device
            and reach the whole world with it.
            </p>
          </section>
          <hr className="border-muted"/>
          <section className="space-y-3">
            <H2>Hobbies</H2>
            <p>
              Besides programming I love doing sports. I also enjoy reading books and going out sometimes.
              I think having hobbies other than coding is important for mental health.
            </p>
            <p>
              I'm also very much into self improvement, nutrition, and positive psychology.
            </p>
          </section>
        </section>
    )
}