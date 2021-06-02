import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { nest } from 'd3-collection';
import { schemeBrBG } from "d3";

// Chart #1: unemployment rate up until 2010 - 2021
export default function UnemploymentRateLine() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

    if (loading === true) {
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3 // create the svg box for the viz
            .select("#unemployment-rate-line")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


        data.forEach(function (d) { //parse values to int so that d3 can process them
            d.National_rate = +d.National_rate;
            d.EUR_Year = +d.EUR_Year;
        });

        // group by year and then sum the national rate
        var avgUnempRate = nest()
        .key(function(d) { return d.EUR_Year;})
        .rollup(function(d) { 
            return d3.sum(d, function(g) {return g.National_rate; });
        }).entries(data);

        // put national rate into array & put years into array
        avgRate = [];
        years = [];
        avgUnempRate.forEach(function (row) {
            avgRate.push(row.value);
            years.push(row.key);
        });
        avgRate = avgRate.slice(10, 21); //slice to only get data from 2010 - 2021
        years = years.slice(10, 21);
        avgUnempRate = avgUnempRate.slice(10, 21);

        const xScale = scaleBand() //years
            .rangeRound([0, width]).padding(1)
            .domain(years.map(function(d) { return d; }));
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        const yScale = scaleLinear() //unemployment rate
            .domain([0, max(avgRate, function(d) { return d; })])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("path") // add the line to svg
            .datum(avgUnempRate)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.key) })
                .y(function(d) { return yScale(d.value) })
            );
        
        // adding a transparent circle 
        svg.selectAll("circle")
            .data(avgUnempRate)
            .enter().append("circle")
            .attr("cx", function(d) {return xScale(d.key)})
            .attr("cy", function(d) {return yScale(d.value)})
            .attr("r", 2)
            .attr("stroke", "red")
            .attr("fill", "red");

        // x-axis lable
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr('fill', '#000')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .text('Year');

        // y-axis lable
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr('transform', `translate(-40, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Unemployment Rate (National Rate)');  
    }
    return (
        <div>
            <p>{loading && "Loading national rate data!"}</p>
            <h2>Year vs. Average Unemployment Rate (National Rate)</h2>
            <div id="unemployment-rate-line" className="viz"></div>
        </div>
    );
}