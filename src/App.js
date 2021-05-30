import React from "react";
import { useFetch } from "./hooks/useFetch";


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

    let formatData = data.map(function (d) {
    })

    return (
        <h1>INFO 474 Final Project </h1>
    );
    
};

export default App;