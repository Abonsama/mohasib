import Nav from "../components/nav";
export default function Search(){
       return(
        <>
            <form action={'post'}>
                <span>filters</span>
                <label htmlFor='transactionName'>Transaction Name</label>
                <input type="text" id="transactionName" />
                <label htmlFor='transactionDate'>Transaction Date</label>
                <input type="date" id="transactionDate" />
                <label htmlFor='amount'>Amount</label>
                <input type="number" id="amount" />
                <span>SDG</span>
                <label htmlFor='outgoing'>outgoing</label>
                <input type="checkbox" id="outgoing" />
                <input type="submit" value="search" />
                {/* when search is clicked it shows 
                the results from the database*/}
            </form>
            {/* results list here and on click it shows the button of edit and delete*/}
            <Nav></Nav>
        </>
       );
}