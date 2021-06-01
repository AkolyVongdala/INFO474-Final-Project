import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand } from "d3-scale";
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
            d.EUR_Year = +d.EUR_Year;
        });

        var groups = ["National_rate", "Washigton"];

        if(d.EUR_Year >= 2019 && d.EUR_Year <= 2021) {
            var dataMap = groups.map( function(grpName){
                return {
                    name: grpName,
                    values: data.map(function(d){
                        return {time: +d.EUR_Year, value: +d[grpName]};
                    })
                };
            });
        } 

        console.log(dataMap)
    }
    
    
    return (
        <div>
            <p>{loading && "Loading national rate data!"}</p>
            <h2>hello</h2>
            <div id="unemp-national-WA-line" className="viz"></div>
        </div>
    );
}