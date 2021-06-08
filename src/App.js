import React from "react";
import { useFetch } from "./hooks/useFetch";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";
import NationalAndWALine from "./visualizations/NaitonalAndWALineChart"

const App = () => {
    return (
        <div>
            <h1>Covid-19: The Bug that Paralyzed our World</h1>

            <UnemploymentRateLine/>
            <NationalAndWALine />
        </div>
    );
    
};

export default App;