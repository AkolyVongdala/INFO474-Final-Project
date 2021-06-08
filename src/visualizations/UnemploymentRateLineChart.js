import React, {useState} from "react";
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

    // define state for our tooltip display status
    const [showTooltip, setShowTooltip] = useState(false);
    // define state for tooltip position
    const [tooltipPos, setTooltipPos] = useState({x: 0, y: 0});
    // define state for our tooltip content
    const [tooltipContent, setTooltipContent] = useState("");

    /*******************************************
     * Tooltip code
     *******************************************/
        // first, create a container for our tooltip
        const tooltip = (<div style={{
            width: "5rem",
            height: "5rem",
            position: "absolute",
            // if showtooltip is true, display the tooltip otherwise set display to none
            display: `${showTooltip ? "inline" : "none"}`,
            backgroundColor: "white",
            // set left and top (which you can think of as the "x" and "y" of our tooltip div)
            // to match the current state
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
            }}>
            
            {/* set the attack and defense to match the current state */}
            <span>Year: {tooltipContent.x}</span>
            <br />
            <span>Unemployment Rate: {d3.format(".2s")(tooltipContent.y)}</span>
        </div>)

        // called when our mouse enters a circle
        const onPointHover = (e) => {
            // set new position of tooltip
            // set the tooltip slightly to the right of our mouse for better viewability
            // set the tooltips y position to our mouse's y position
            setTooltipPos({ x: e.pageX + 30, y: e.pageY });
            setShowTooltip(true);

            // get the element our circle is hovering over
            const circle = e.target;
            // set our tooltip content
            // get our new year and percentage from the circle's properties
            setTooltipContent({
                x: circle.getAttribute("year"),
                y: circle.getAttribute("rate")
            });
        }

        // if the mouse exits the circle, hide the tooltip
        const onPointLeave = () => {
            setShowTooltip(false);
        }

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
            return d3.mean(d, function(g) {return g.National_rate; });
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
            .attr("year", function(d){ return d.key})
            .attr("rate", function(d){ return d.value})
            .attr("cx", function(d) {return xScale(d.key)})
            .attr("cy", function(d) {return yScale(d.value)})
            .attr("r", 3)
            .attr("stroke", "red")
            .attr("fill", "red")
                .on('mouseover', onPointHover)
                .on('mouseout', onPointLeave)
                // .on('mouseover', function(){
                //     d3.select(this)
                //     .transition()
                //     .duration(1000)
                //     .attr('fill', "steelblue")
                // })
                // .on('mouseout', function(){
                //     d3.select(this)
                //     .transition()
                //     .duration(1000)
                //     .attr('fill', "red")
                // })

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
            <h2>Pre-Covid Unemployment Rates: A Sign of Good Things to Come?</h2>
            <div id="unemployment-rate-line" className="viz" >
                {/* Make sure to include tooltip here!!! */}
                {tooltip}
                {/* add styling to center svg */}
            </div>
        </div>
    );
}