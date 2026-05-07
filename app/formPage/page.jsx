
export default function Form(){
    return(
        <form action={'post'}>
            <label htmlFor='transactionName'>Transaction Name</label>
            <input type="text" id="transactionName" />
            <label htmlFor='transactionDate'>Transaction Date</label>
            <input type="date" id="transactionDate" />
            {/* <label htmlFor='transactionTime'>Transaction Time</label>
            <input type="time" id="transactionTime" /> */}
            {/* time is better not set because its not important here just take the time of submit */}
            <label htmlFor='amount'>Amount</label>
            <input type="number" id="amount" />
            <span>SDG</span>
            <label htmlFor='outgoing'>outgoing</label>
            <input type="checkbox" id="outgoing" />
            <input type="submit" value="submit" />
            {/* when submit is clicked it redirects to homepage and then shows a notification of succes for a 3 seconds and then vainshes */}
        </form>
    );
}