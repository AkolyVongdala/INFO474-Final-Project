import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand } from "d3-scale";
import * as d3 from "d3";
import { nest } from 'd3-collection';

// Sources Used:
// https://www.frameworkish.com/html/2016/05/04/grouped-dynamic-bar-chart-d3.html

// Chart #1: unemployment rate up until 2010 - 2021
export default function UnemploymentByEducation() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

    var level = ['Less_than_a_high_school_diploma'];
    const edu_levels = ['Less_than_a_high_school_diploma', 'High_school_graduates_no_college', 'Some_college_or_associate_degree', 'Bachelor_s_degree_and_higher']

    if (loading === true) {
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width], .05)
        var y = d3.scaleLinear().range([height, 0]);


        const svg = d3 // create the svg box for the viz
            .select('#unemp-rate-education')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        data.forEach(function (d) { //parse values to int so that d3 can process them
            d.EUR_Year = +d.EUR_Year;
            d.Less_than_a_high_school_diploma = +d.Less_than_a_high_school_diploma;
            d.High_school_graduates_no_college = +d.High_school_graduates_no_college;
            d.Some_college_or_associate_degree = +d.Some_college_or_associate_degree;
            d.Bachelor_s_degree_and_higher = +d.Bachelor_s_degree_and_higher;
        });

        var avgLTAHSD = nest()
            .key(function(d) { return d.EUR_Year; })
            .rollup(function(d) {
                return d3.mean(d, function(g) { return g.Less_than_a_high_school_diploma; });
            }).entries(data);

        var avgHSGNC  = nest()
        .key(function(d) { return d.EUR_Year; })
        .rollup(function(d) {
            return d3.mean(d, function(g) { return g.High_school_graduates_no_college; });
        }).entries(data);

        var avgSCOAD  = nest()
        .key(function(d) { return d.EUR_Year; })
        .rollup(function(d) {
            return d3.mean(d, function(g) { return g.Some_college_or_associate_degree; });
        }).entries(data);

        var avgBDAH  = nest()
        .key(function(d) { return d.EUR_Year; })
        .rollup(function(d) {
            return d3.mean(d, function(g) { return g.Bachelor_s_degree_and_higher; });
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


        // stuck after this
        const xScale = scaleBand() //years
            .rangeRound([0, width]).padding(1)
            .domain(years.map(function(d) { return d; }));
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        const yScale = scaleLinear() //unemployment rate for current level
            .domain([0, 16])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(yScale));

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
        }

        d3.select('.categories').selectAll('.category').on('change', function() {
            var x = d3.select('.categories').selectAll('.category:checked'); // all the checkboxes that are checked
            let checked = Object.values(x)[0][0];
            let ids = [];
            for (let id of checked) {
                ids.push(id);
            }
            updateLevel(ids);
        });
    
        // x.domain([0, d3.max(data, function(d) {
        //     if (level === 'Less_than_a_high_school_diploma') {
        //         return d.Less_than_a_high_school_diploma;
        //     } else if (level === 'High_school_graduates_no_college') {
        //         return d.High_school_graduates_no_college;
        //     } else if (level === 'Some_college_or_associate_degree') {
        //         return d.Some_college_or_associate_degree;
        //     } else {
        //         return d.Bachelor_s_degree_and_higher;
        //     }
        // })]);
    
        // y.domain(data.map(function(d) {
        //     return d.EUR_Year;
        // }));

        var time_frame = svg.selectAll('.year').data(data);
        time_frame.enter()
            .append('g')
            .attr('class', 'year')
            .attr('transform', function(d) {
                return 'translate(0, ' + y(d.year) + ')';
            });
        
        // function getLevel() {
        //     if (level === 'Less_than_a_high_school_diploma') {
        //         return d.Less_than_a_high_school_diploma;
        //     } else if (level === 'High_school_graduates_no_college') {
        //         return d.High_school_graduates_no_college;
        //     } else if (level === 'Some_college_or_associate_degree') {
        //         return d.Some_college_or_associate_degree;
        //     } else {
        //         return d.Bachelor_s_degree_and_higher;
        //     }
        // }

        // var rate = time_frame.selectAll('rect')
        //     .data(function(d) {
        //         return getGroup();
        //     });

        // rate.enter().append('rect');

        // rate
        //     .attr('x', 0)
        //     .attr('y', function(d, index) { return y1(edu_levels[index]); })
        //     .attr('id', function(d) { return d.edu; })
        //     .style('fill', function(d) { return color(level); })
        //     .text(function(d) { return getGroup() })

        // rate.exit().transition().attr('width', 0).remove();
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