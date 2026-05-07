'use client'
import Link from "next/link"
import Nav from "./components/nav"

export default function Home() {
  return(
    <section>
      <Link href={"/formPage"}>add new transaction</Link>
    </section>
  );
}
