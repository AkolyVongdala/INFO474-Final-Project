import React, {useState} from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleTime } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { text } from "d3";

//References:
//https://www.d3-graph-gallery.com/graph/interactivity_button.html
//Interactive legend: https://www.d3-graph-gallery.com/graph/connectedscatter_legend.html
//Checkboxes: https://www.d3-graph-gallery.com/graph/bubblemap_buttonControl.html
//Axis-lable: https://vijayt.com/post/plotting-bar-chart-d3-react/

// Chart #2: unemployment rate by degree levels
export default function UnemploymentRateDegreeLine() {
    // ** after mergeing data with main must change this to main! **
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/DegreeLineChart_Jisu2/data/Info474_FinalData.csv"
    );

    if (loading === true) { // Prevents extra appending
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


        const svg = d3 // create the svg box for the viz and appending it to line-chart div
            .select("#unemployment-rate-degree-line")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const timeParse = d3.timeParse(`%b-%y`);

        let formatData = data.map(function (d) { //parse values to int so that d3 can process them
            d.Month = timeParse(d.Month);
            d.K12LESS = +d.K12LESS;
            d.HIGHSCHOOL = +d.HIGHSCHOOL;
            d.ASSOCIATE = +d.ASSOCIATE;
            d.BACHELOR = +d.BACHELOR;
    
            return d;
        });
    
        // List of groups (here I have one group per column)
        var allGroup = ["K12LESS", "HIGHSCHOOL", "ASSOCIATE", "BACHELOR"];
    
        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
          return {
            name: grpName,
            values: data.map(function(d) {
              return {time: d.Month, value: +d[grpName]};
            })
          };
        });
    
        var myColor = d3.scaleOrdinal()
          .domain(allGroup)
          .range(d3.schemeSet2);
    
        const xScale = scaleTime() //  x-axis for MONTH - YEAR
            .domain([d3.min(formatData, d => d.Month), d3.max(formatData, d => d.Month)]).nice()
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
            currentOpacity = d3.select("#K12LESS").style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.select("#K12LESS").transition().style("opacity", currentOpacity == 1 ? 0:1)
        });
    
        svg.select("#HIGHSCHOOL-text").on("click", function(e, d) {
            // is the element currently visible ?
            currentOpacity = d3.select("#HIGHSCHOOL").style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.select("#HIGHSCHOOL").transition().style("opacity", currentOpacity == 1 ? 0:1)
        });
    
        svg.select("#ASSOCIATE-text").on("click", function(e, d) {
            // is the element currently visible ?
            currentOpacity = d3.select("#ASSOCIATE").style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.select("#ASSOCIATE").transition().style("opacity", currentOpacity == 1 ? 0:1)
        });
    
        svg.select("#BACHELOR-text").on("click", function(e, d) {
            // is the element currently visible ?
            currentOpacity = d3.select("#BACHELOR").style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.select("#BACHELOR").transition().style("opacity", currentOpacity == 1 ? 0:1)
        });
    
        // x-axis label : Year
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Year');
    
        // y-axis label : Unemployment Rate
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr('transform', `translate(-40, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Unemployment Rate');    
    
    }



    return (
        <div>
            <p>{loading && "Loading national rate data!"}</p>
            <h2>Unemployment Rates by Degrees</h2>
            <div id="unemployment-rate-degree-line" className="viz" >
            </div>
        </div>
    );
}