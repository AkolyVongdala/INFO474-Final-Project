import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand, scaleTime } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { nest } from 'd3-collection';

//Line Chart #3: unemployment rate National vs. Washington 2019 - 2021
export default function DegreeUnempLine() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

if (loading === true) { // Prevents extra appending
    // defining constants like height, width, and margin 
    const margin = { top: 20, right: 20, bottom: 50, left: 65 }, //size
        width = 1000 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    let formatData = data.map(function (d) { //parse values to int so that d3 can process them
        d.EUR_Year = +d.EUR_Year;
        d.Less_than_a_high_school_diploma = +d.Less_than_a_high_school_diploma;
        d.High_school_graduates_no_college = +d.High_school_graduates_no_college;
        d.Some_college_or_associate_degree= +d.Some_college_or_associate_degree;
        d.Bachelor_s_degree_and_higher = +d.Bachelor_s_degree_and_higher;

        return d;
    });

    const svg = d3 // create the svg box for the viz and appending it to line-chart div
        .select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // List of groups (here I have one group per column)
    var allGroup = ["Less_than_a_high_school_diploma","High_school_graduates_no_college","Some_college_or_associate_degree","Bachelor_s_degree_and_higher"];

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.EUR_Year, value: +d[grpName]};
        })
      };
    });

    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    const xScale = scaleTime() //  x-axis for MONTH - YEAR
        .domain([d3.min(formatData, d => d.EUR_Year), d3.max(formatData, d => d.EUR_Year)]).nice()
        .range([0, width])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)); 

    const yScale = scaleLinear() // y axis for HIGH SCHOOL
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
        .style("stroke-width", 4)
        .style("fill", "none");

    // Add a legend (interactive)
    svg.selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr("x", function(d,i){ return 50 + i*120})
          .attr("y", 30)
          .attr("id", function(d){ return d.name + "-text" })
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15);
        // .on("click", function(e, d) {
        //     console.log(d)
        //     // is the element currently visible ?
        //     currentOpacity = d3.selectAll("#" + d.name).style("opacity")
        //     // Change the opacity: from 0 to 1 or from 1 to 0
        //     d3.selectAll("#" + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
        // });

    // manually add add in event listener bc its not working on the legend for some reason
    svg.select("#K12LESS-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#Less_than_a_high_school_diploma").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#Less_than_a_high_school_diploma").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    svg.select("#HIGHSCHOOL-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#High_school_graduates_no_college").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#High_school_graduates_no_college").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    svg.select("#ASSOCIATE-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#Some_college_or_associate_degree").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#Some_college_or_associate_degree").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    svg.select("#BACHELOR-text").on("click", function(e, d) {
        // is the element currently visible ?
        currentOpacity = d3.select("#Bachelor_s_degree_and_higher").style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.select("#Bachelor_s_degree_and_higher").transition().style("opacity", currentOpacity == 1 ? 0:1)
    });

    // x-axis lable : Year
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr('fill', '#000')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .text('Year');

    // y-axis lable : Year
    svg.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr('transform', `translate(-50, ${height/2}) rotate(-90)`)
        .attr('fill', '#000')
        .style('font-size', '20px')
        .style('text-anchor', 'middle')
        .text('Unemployment Rate (%)');    

    }

    return (
        <div>
            <p>{loading && "Loading national rate data!"}</p>
            <h2>Educational Disparities Throughout the Years 2001 to 2021</h2>
            <div id="#unemp-degree-line" className="viz">
            </div>
        </div>
    );
}