import React from "react";
import { useFetch } from "./hooks/useFetch";
import { text, timeYear } from "d3";
import * as d3 from "d3";
import { max } from "d3-array"
import { scaleLinear, scaleTime } from "d3-scale"


const viewHeight = 500;
const viewWidth = 500;

const App = () => {
    const [data, loading] = useFetch(
        //change this url to main later
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );
    const parseYear = d3.timeParse(`%y`);
    const parseMonth = d3.timeParse(`%b`);

    let formatData = data.map(function (d) {
        // d.Year = +d.Year;
        // d.Month = +parseMonth(d.Month);
        d.K12LESS = +d.K12LESS;
        d.ASSOCIATE = +d.ASSOCIATE;
        d.BACHELOR = +d.BACHELOR;
        d.UR_Year = +parseYear(d.UR_Year);
        d.UR_Month = +parseMonth(d.UR_Month);
        d.National_rate = +d.National_rate;
        d.Washington = +d.Washington;

        return d;
    });

    
    console.log(formatData)
    
    const margin = { top: 20, right: 20, bottom: 50, left: 65 }, //size
        width = 1000 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
    
    if (loading === true) { // Prevents extra appending
        const svg = d3
            .select("#chart1")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        var geoGroup = ["National_rate"];

        var dataReady = geoGroup.map( function(grpName) { // .map allows to do something for each element of the list
            return {
              name: grpName,
              values: data.map(function(d) {
                return {time: d.UR_Year, value: +d[grpName]};
              })
            };
        });

        var myColor = d3.scaleOrdinal()
        .domain(geoGroup)
        .range(d3.schemeSet2);

        const xScale = scaleTime() 
            .domain([d3.min(formatData, d => d.UR_Year), d3.max(formatData, d => d.UR_Year)]).nice()
            .range([0, width])
            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale)); 

        const yScale = scaleLinear() 
            .domain([0, 25])
            .range([height, 0]);
            svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add the lines
        var line = d3.line()
            .x(function(d) { return xScale(+d.time) })
            .y(function(d) { return yScale(+d.value) })
            svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("id", function(d){ return d.name })
            .attr("d", function(d){ return line(d.values) } )
            .attr("stroke", function(d){ return myColor(d.name) })
            .style("stroke-width", 1)
            .style("fill", "none");    
        
        
    }

    return (
        <div className="vis">
            <p>{loading && "Loading data!"}</p>
            <h1>INFO 474 Final Project </h1>
            <br></br>
            <div id= "chart1"></div>
        </div>
    );
    
};

export default App;