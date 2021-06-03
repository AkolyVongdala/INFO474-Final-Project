import React from "react";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";
<<<<<<< HEAD
import UnemploymentByEducation from "./visualizations/UnemploymentByEducation";
=======
import NationalAndWALine from "./visualizations/NaitonalAndWALineChart"
>>>>>>> main


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    return (
        <div>
            <h1>Covid-19: The Bug that Paralyzed our World</h1>

            <UnemploymentRateLine />
<<<<<<< HEAD
            <UnemploymentByEducation />
=======
            <NationalAndWALine />
>>>>>>> main
        </div>
    );
    
};

export default App;