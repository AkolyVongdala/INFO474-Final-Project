import React from "react";
import NationalAndWA from "./graphs/NationalAndWA";

const App = () => {
    return (
        <div>
            <p>{loading && "Loading data!"}</p>
            <h1>INFO 474 Final Project </h1>
            <NationalAndWA />
        </div>
    );
};

export default App;