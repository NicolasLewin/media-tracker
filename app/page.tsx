import { Header } from "@/components/Header";
import { Main } from "@/components/Main";
import { Spacing } from "@/components/Spacing";
import Image from "next/image";

export default function Home() {
  return (
    <main>
        <Header />
        <Spacing height={100} />
        <Main />
    </main>
  );
}