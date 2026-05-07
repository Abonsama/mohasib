
export default function Footer(){
      let year = new Date().getUTCFullYear();
    return(
        <footer>
        a Mohamed Adil production &copy; {`${year}`}
        </footer>
    );
}