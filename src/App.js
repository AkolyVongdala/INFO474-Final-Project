import React from "react";
import { useFetch } from "./hooks/useFetch";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    return (
        <div>
            <h1>Covid-19: The Bug that Paralyzed our World</h1>

            <UnemploymentRateLine />
        </div>
    );
    
};

export default App;