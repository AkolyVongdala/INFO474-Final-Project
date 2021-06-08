import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand, scaleTime } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { nest } from 'd3-collection';

//Line Chart #3: unemployment rate National vs. Washington 2019 - 2021
export default function NationalAndWALine() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

    if (loading === true) {
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            tooltip = { width: 100, height: 100, x: 10, y: -30 };


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

        // before 2019 rate
        var before2019 = data.filter(function(d) {
            return d.UR_Year >= 2011 && d.UR_Year <= 2019;
        })

        //filtering 2019-2021 rate
        var filteredData = data.filter(function(d) {
            return d.UR_Year >= 2019 && d.UR_Year <= 2021;
        })
        // group by year and then avg the national rate (before 2019)
        let avgBefore2019RateNational = nest()
        .key(function(d) { return d.UR_Year;})
        .rollup(function(d) { 
            return d3.sum(d, function(g) {return g.National_rate; });
        }).entries(before2019);

        // group by year and then avg the WA rate (before 2019)
        let avgBefore2019RateWA = nest()
        .key(function(d) { return d.UR_Year;})
        .rollup(function(d) { 
            return d3.sum(d, function(g) {return g.Washington; });
        }).entries(before2019);

        // group by year and then avg the national rate
        let avgUnempRateNational = nest()
        .key(function(d) { return d.UR_Year;})
        .rollup(function(d) { 
            return d3.sum(d, function(g) {return g.National_rate; });
        }).entries(filteredData);

        // group by year and then avg the WA rate
        let avgUnempRateWA = nest()
        .key(function(d) { return d.UR_Year;})
        .rollup(function(d) { 
            return d3.sum(d, function(g) {return g.Washington; });
        }).entries(filteredData);

        years = [];

        // put national rate into array & put years into array (before 2019)
        avgRateNational2019 = [];
        avgRateWA2019 = [];

        avgBefore2019RateNational.forEach(function (row) {
            avgRateNational2019.push(row.value);
            years.push(row.key);
        });

        avgBefore2019RateWA.forEach(function (row) {
            avgRateWA2019.push(row.value);
            years.push(row.key);
        });

        // put national rate into array & put years into array
        avgRateNational = [];
        avgRateWA = [];

        avgUnempRateNational.forEach(function (row) {
            avgRateNational.push(row.value);
            years.push(row.key);
        });

        avgUnempRateWA.forEach(function (row) {
            avgRateWA.push(row.value);
            years.push(row.key);
        });

        const xScale = scaleBand() //years
            .rangeRound([0, width]).padding(1)
            .domain(years.map(function(d) { return d; }));
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        const yScale = scaleLinear() //unemployment rate
            .domain([0, max(avgRateNational2019, function(d) { return d; })])
            .range([ height , 0 ]);
        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("path") // add the avg unemployeement National rate line to svg (before 2019)
            .datum(avgBefore2019RateNational)
            .attr("fill", "none")
            .attr("stroke", "#d3d3d3")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.key) })
                .y(function(d) { return yScale(d.value) })
            )
            .style("stroke-dasharray", ("3, 3")) 


        svg.append("path") // add the avg unemployeement WA rate line to svg (before 2019)
            .datum(avgBefore2019RateWA)
            .attr("fill", "none")
            .attr("stroke", "#FFCCCB")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.key) })
                .y(function(d) { return yScale(d.value) })
            )
            .style("stroke-dasharray", ("3, 3")) 

         svg.append("path") // add the avg unemployeement National rate line to svg 
            .datum(avgUnempRateNational)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.key) })
                .y(function(d) { return yScale(d.value) })
            )

        svg.append("path") // add the avg unemployeement WA rate line to svg
            .datum(avgUnempRateWA)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.key) })
                .y(function(d) { return yScale(d.value) })
            )

        // Add dots for National Unemployment rate
        var National_circle = svg.append('g')
            .selectAll("circle")
            .data(avgUnempRateNational)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.key); } )
            .attr("cy", function (d) { return yScale(d.value); } )
            .attr("r", 4)
            .style("fill", "Black")
            .append("svg:title")
            .text(function(d) { return " Year: " + d.key + " Rate: " + d.value; });

        // Add dots for Washington Unemployment rate
        svg.append('g')
            .selectAll("circle")
            .data(avgUnempRateWA)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.key); } )
            .attr("cy", function (d) { return yScale(d.value); } )
            .attr("r", 4)
            .style("fill", "red")
            .append("svg:title")
            .text(function(d) { return " Year: " + d.key + " Rate: " + d.value; });

/*         //National line label
        svg.append("text")
            .attr("transform", "translate(" + (width/5 + 10) + "," + yScale(avgRateNational[0] - 3) + ")")
            .attr("dy", ".4em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            //.style("font-weight", "bold")
            .text("National");

        //WA line label
        svg.append("text")
            .attr("transform", "translate(" + (width/5 - 30) + "," + yScale(avgRateWA[0] - 2) + ")")
            .attr("dy", ".4em")
            .attr("text-anchor", "start")
            .style("fill", "red")
            //.style("font-weight", "bold")
            .text("Washington");   */

        // x-axis label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Year');

        // y-axis label
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr('transform', `translate(-40, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Unemployment Rate (National Rate & WA)');
        
        // WA legend
        svg.append("circle")
            .attr("cx", width / 2 + 400)
            .attr("cy",130)
            .attr("r", 6)
            .style("fill", "red")
            
        svg.append("text")
            .attr("x", (width + 20) / 2 + 400)
            .attr("y", 130)
            .text("Washington")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle")

        // National legend
        svg.append("circle")
            .attr("cx", width / 2 + 400)
            .attr("cy",160)
            .attr("r", 6)
            .style("fill", "black")
            
        svg.append("text")
            .attr("x", (width + 20) / 2 + 400)
            .attr("y", 160)
            .text("National")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle")
    }
    
    
    return (
        <div>
            <p>{loading && "Loading national rate data!"}</p>
            <h2>Average Unemployment Rate National vs. Washington (2019-2021)</h2>
            <div id="unemp-national-WA-line" className="viz">
            </div>
        </div>
    );
}