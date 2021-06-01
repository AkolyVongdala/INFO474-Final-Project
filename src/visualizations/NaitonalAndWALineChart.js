import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand, scaleTime } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { nest } from 'd3-collection';

//Line Chart #3
export default function NationalAndWALine() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );


    if (loading === true) {
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3 // create the svg box for the viz
            .select("#unemp-national-WA-line")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


        data.forEach(function (d) { //parse values to int so that d3 can process them
            d.National_rate = +d.National_rate;
            d.Washington = +d.Washington;
            d.UR_Year = +d.UR_Year;
        });

        console.log(data)

        //filtering 2019-2021 rate
        var filteredData = data.filter(function(d) {
            return d.UR_Year >= 2019 && d.UR_Year <= 2021;
        })
        // List of groups that we need to use for the line chart #3
        var groups = ["National_rate", "Washigton"];
        
        // Reformat data set National unemp rate and WA unemp rate in 2019 - 2021
        var dataMap = groups.map( function(grpName){
            return {
                name: grpName,
                values: filteredData.map(function(d){
                    return {time: +d.UR_Year, value: +d[grpName]};
                })
            };
        });

        var myColor = d3.scaleOrdinal()
        .domain(groups)
        .range(d3.schemeSet2);

        const xScale = scaleTime()
            .domain(d3.extent(filteredData, function (d) { return new Date (d.UR_Year, 0) }))
            .range([0, width])
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
    }
    
    
    return (
        <div>
            <p>{loading && "Loading national rate data!"}</p>
            <h2>hello</h2>
            <div id="unemp-national-WA-line" className="viz"></div>
        </div>
    );
}