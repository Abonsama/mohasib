import Link from "next/link";
export default function Nav(){
    return(
        <nav>
            <Link href={"/"}>Home</Link>
            <Link href={"/search"}>search</Link>
            <Link href={"/statisticsPage"}>statistics</Link>
        </nav>
    );
}