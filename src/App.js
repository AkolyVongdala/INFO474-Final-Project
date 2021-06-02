import React from "react";
import NationalAndWA from "./graphs/NationalAndWA";
import UnemploymentByEducation from "./graphs/UnemploymentByEducation"

const App = () => {
    return (
        <div>
            <p>{loading && "Loading data!"}</p>
            <h1>INFO 474 Final Project </h1>
            <NationalAndWA />
            <UnemploymentByEducation />
        </div>
    );
};

export default App;