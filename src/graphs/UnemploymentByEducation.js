import React from "react";
import { useFetch } from "../hooks/useFetch";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import * as d3 from "d3";
import { nest } from 'd3-collection';

// Sources Used:
// https://www.frameworkish.com/html/2016/05/04/grouped-dynamic-bar-chart-d3.html

// Chart #1: unemployment rate up until 2010 - 2021
export default function UnemploymentEducation() {
    const [data, loading] = useFetch(
        "https://raw.githubusercontent.com/AkolyVongdala/INFO474-Final-Project/main/data/Info474_FinalData.csv"
    );

    var level = 'Less_than_a_high_school_diploma';
    var group = 'Year';

    if (loading === true) {
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }, //size
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);
        var y0 = d3.scale.ordinal().rangeBands([0, height], .1);


        const svg = d3 // create the svg box for the viz
            .select('.graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        data.forEach(function (d) { //parse values to int so that d3 can process them
            d.EUR_Year = +d.EUR_Year;
            d.EUR_Month = +d.EUR_Month;
            d.Less_than_a_high_school_diploma = +d.Less_than_a_high_school_diploma;
            d.High_school_graduates_no_college = +d.High_school_graduates_no_college;
            d.Some_college_or_associate_degree = +d.Some_college_or_associate_degree;
            d.Bachelor_s_degree_and_higher = +d.Bachelor_s_degree_and_higher;
        });
        
        var edu_levels = ['Less_than_a_high_school_diploma', 'High_school_graduates_no_college',
                          'Some_college_or_associate_degree', 'Bachelor_s_degree_and_higher']
        var time_groups = ['Year', 'Month']

        d3.select('.edu_categories').selectAll('.checkbox')
            .data(edu_levels)
            .enter()
            .append('div')
            .attr('class', 'checkbox')
            .append('label').html(function(edu, index) {
                var checkbox = '<input id="' + edu + '" type="checkbox" class="category">';
                return checkbox;
            });

        d3.select('.g_categories').selectAll('.checkbox')
            .data(time_groups)
            .enter()
            .append('div')
            .attr('class', 'checkbox')
            .append('label').html(function(group, index) {
                var checkbox = '<input id="' + group + '" type="checkbox" class="category">';
                return checkbox;
            });

        d3.select('.edu_categories').selectAll('.category').on('change', function() {
            var x = d3.select('.edu_categories').selectAll('.category:checked');
            var edu_levels = x[0].map(function(category) {
                return category.edu;
            });
            updateLevel(edu_levels);
        });
    
        d3.select('.g_categories').selectAll('.category').on('change', function() {
            var x = d3.select('.g_categories').selectAll('.category:checked');
            var time_groups = x[0].map(function(category) {
                return category.group;
            });
            updateGroup(time_groups);
        });
    
        function updateLevel(selectedLevel) {
            level = selectedLevel;
        }
    
        function updateGroup(selectedGroup) {
            group = selectedGroup;
        }
    
        x.domain([0, d3.max(data, function(d) {
            if (level === 'Less_than_a_high_school_diploma') {
                return d.Less_than_a_high_school_diploma;
            } else if (level === 'High_school_graduates_no_college') {
                return d.High_school_graduates_no_college;
            } else if (level === 'Some_college_or_associate_degree') {
                return d.Some_college_or_associate_degree;
            } else {
                return d.Bachelor_s_degree_and_higher;
            }
        })]);
    
        y0.domain(data.map(function(d) {
            if (group === 'Year') {
                return d.EUR_Year;
            } else {
                return d.EUR_Month;
            }
        }));

        function getLevel() {
            if (level === "Year") {
                return d.EUR_Year;
            } else {
                return d.EUR_Month;
            }
        }

        var time_frame = svg.selectAll('.' + level).data(data);
        time_frame.enter()
            .append('g')
            .attr('class', 'time')
            .attr('transform', function(d) {
                return 'translate(0, ' + y0(getLevel()) + ')';
            });
        
        function getGroup() {
            if (level === 'Less_than_a_high_school_diploma') {
                return d.Less_than_a_high_school_diploma;
            } else if (level === 'High_school_graduates_no_college') {
                return d.High_school_graduates_no_college;
            } else if (level === 'Some_college_or_associate_degree') {
                return d.Some_college_or_associate_degree;
            } else {
                return d.Bachelor_s_degree_and_higher;
            }
        }

        var rate = state.selectAll('rect')
            .data(function(d) {
                return getGroup();
            });

        rate.enter().append('rect');

        rate
            .attr('x', 0)
            .attr('y', function(d, index) { return y1(edu_levels[index]); })
            .attr('id', function(d) { return d.edu; })
            .style('fill', function(d) { return color(level); })
            .text(function(d) { return getGroup() })

        rate.exit().transition().attr('width', 0).remove();
    }
}