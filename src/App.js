import React from "react";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";
import UnemploymentByEducation from "./visualizations/UnemploymentByEducation";
import NationalAndWALine from "./visualizations/NaitonalAndWALineChart"


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    return (
        <div>
            <h1>Covid-19: The Bug that Paralyzed our World</h1>

            <UnemploymentRateLine />
            <UnemploymentByEducation />
            <NationalAndWALine />
        </div>
    );
    
};

export default App;