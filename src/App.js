import React from "react";
import { useFetch } from "./hooks/useFetch";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";
import NationalAndWALine from "./visualizations/NaitonalAndWALineChart"


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    return (
        <div>
            <h1>INFO 474 Final Project </h1>

            <UnemploymentRateLine />
            <NationalAndWALine />
        </div>
    );
    
};

export default App;