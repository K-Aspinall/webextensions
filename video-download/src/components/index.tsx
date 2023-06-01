import * as React from "react"; 
import * as ReactDOM from "react-dom"; 

//This is our counter component 
const Counter = () => {
    const [ count, setCount ] = React.useState(0);
    return (<>
        <h2>{count}</h2>
        <button onClick={() => {setCount(count + 1)}}>increment</button>
        <button onClick={() => {setCount(count - 1)}}>decrement</button>
    </>)
}


/* We're now telling React to render this component on the webpage, inside 
the first element it can find with an id of "root". Notice how this matches 
the `div`-tag in our `index.html` :-) */
console.log(document.getElementById("root"))
ReactDOM.render(<Counter />, document.getElementById("root"));