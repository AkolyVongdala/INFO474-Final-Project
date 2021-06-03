import React from "react";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";
import UnemploymentByEducation from "./visualizations/UnemploymentByEducation";


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    return (
        <div>
            <h1>INFO 474 Final Project </h1>

            <UnemploymentRateLine />
            <UnemploymentByEducation />
        </div>
    );
    
};

export default App;