import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { nest } from 'd3-collection';

// Sources Used:
// https://www.frameworkish.com/html/2016/05/04/grouped-dynamic-bar-chart-d3.html

// Chart #1: unemployment rate up until 2010 - 2021
export default function UnemploymentByEducation() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

    var level = ['K12LESS'];
    const edu_levels = ['K12LESS', 'HIGHSCHOOL', 'ASSOCIATE', 'BACHELOR']

    if (loading === true) {
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3 // create the svg box for the viz
            .select('#unemp-rate-education')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        data.forEach(function (d) { //parse values to int so that d3 can process them
            d.EUR_Year = +d.EUR_Year;
            d.K12LESS = +d.K12LESS;
            d.HIGHSCHOOL = +d.HIGHSCHOOL;
            d.ASSOCIATE = +d.ASSOCIATE;
            d.BACHELOR = +d.BACHELOR;
        });

        var avgLTAHSD = nest()
            .key(function(d) { return d.EUR_Year; })
            .rollup(function(d) {
                return d3.mean(d, function(g) { return g.K12LESS; });
            }).entries(data);

        var avgHSGNC  = nest()
        .key(function(d) { return d.EUR_Year; })
        .rollup(function(d) {
            return d3.mean(d, function(g) { return g.HIGHSCHOOL; });
        }).entries(data);

        var avgSCOAD  = nest()
        .key(function(d) { return d.EUR_Year; })
        .rollup(function(d) {
            return d3.mean(d, function(g) { return g.ASSOCIATE; });
        }).entries(data);

        var avgBDAH  = nest()
        .key(function(d) { return d.EUR_Year; })
        .rollup(function(d) {
            return d3.mean(d, function(g) { return g.BACHELOR; });
        }).entries(data);

        years = [];
        avgL = [];
        avgH = [];
        avgS = [];
        avgB = [];

        avgLTAHSD.forEach(function (row) {
            avgL.push(row.value);
            years.push(row.key);
        });

        avgHSGNC.forEach(function (row) {
            avgH.push(row.value);
            years.push(row.key);
        });

        avgSCOAD.forEach(function (row) {
            avgS.push(row.value);
            years.push(row.key);
        });

        avgBDAH.forEach(function (row) {
            avgB.push(row.value);
            years.push(row.key);
        });

        
        var x = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));
        var y = d3.scaleLinear()
            .domain([0, 17])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        var dataArray = [];

        for (i = 0; i < years.length; i++) {
            let newData = new Map();
            newData['year'] = years[i]
            newData['K12LESS'] = avgL[i]
            newData['HIGHSCHOOL'] = avgH[i]
            newData['ASSOCIATE'] = avgS[i]
            newData['BACHELOR'] = avgB[i]
            console.log(newData)
            dataArray.push(newData);
        }
        console.log(dataArray);

        let count = 0;
        d3.select('.categories').selectAll('.checkbox')
            .data(edu_levels)
            .enter()
            .append('div')
            .attr('class', 'checkbox')
            .append('label').html(function() {
                var checkbox = '<input id="' + edu_levels[count] + '" type="checkbox" class="category">';
                var label = edu_levels[count];
                count++;
                return checkbox + label;
            });
        
        function updateLevel(selectedLevel) {
            level = [];
            level = selectedLevel;
            var displayArray = [];
            for (dA in dataArray) {
                let newDisplay = new Map();
                newDisplay['year'] = dA['year'];
                for (l in level) {
                    newDisplay[l] = dA[l];
                }
                displayArray.push(newDisplay);
            }
            return displayArray;
        }

        function renderGraph(subgroups, displayArray, colors) {
            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(colors)
            svg.append("g")
                .selectAll("g")
                .data(displayArray)
                .enter()
                .append("g")
                    .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                .attr("x", function(d) { return xSubgroup(d.key); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function(d) { return height - y(d.value); })
                .attr("fill", function(d) { return color(d.key); });
        }
        
        d3.select('.categories').selectAll('.category').on('change', function() {
            var x = d3.select('.categories').selectAll('.category:checked'); // all the checkboxes that are checked
            let checked = Object.values(x)[0][0];
            let ids = [];
            for (let id of checked) {
                ids.push(id);
            }
            var dA = updateLevel(ids);
            var colors = ['#e41a1c','#377eb8','#4daf4a','#eda410'];
            var totalColors = dA.length - 1;
            if (totalColors < 0) {
                totalColors = 0;
            }
            renderGraph(edu_levels, dataArray, colors)
            //renderGraph(level, dA, colors.slice(0, totalColors));
        });
    }
    return (
        <div>
            <p>{loading && "Loading unemployment and education level data!"}</p>
            <h2>Unemployment Rates for Different Education Levels Over the Years 2001-2021</h2>
            <div className="categories"></div>
            <div id="unemp-rate-education" className="viz"></div>
        </div>
    );
}