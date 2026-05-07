'use client'
import Link from "next/link"
import Nav from "./components/nav"
import Footer from "./components/footer";


export default function Home() {
  return(
    <main>
      <section>
        <Link href={"/formPage"}>add a new transaction</Link>
      </section>
      <section>
        <span>latest transaction</span>
        {/* this ul must be a clickable to show each 
        options and hides other options when selected 
        the click shows the list of buttons and then 
        selects the option needed */}
        <ul>
          <li><button>last 30 days</button></li>
          <li><button>last 24 hours</button></li>
          <li><button>all transactions</button></li>
        </ul>
        {/* transactions list fetch here useEffect and useState */}
      </section>
      <Nav></Nav>
      <Footer></Footer>
    </main>
  );
}
