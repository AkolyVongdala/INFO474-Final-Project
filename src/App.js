import React from "react";
import { useFetch } from "./hooks/useFetch";
import UnemploymentRateLine from "./visualizations/UnemploymentRateLineChart";
import NationalAndWALine from "./visualizations/NaitonalAndWALineChart"
import DegreeUnempLine from "./visualizations/UnemploymentRateLineChartDegree"

const App = () => {
    return (
        <div>
            <h1>Covid-19: The Bug that Paralyzed our World</h1>
            <p className="author">University of Washington, INFO 474 Final Project <br></br>By Alex Honeycutt, Jisu Kim, Kayla Lee, Rayna Tilley, and Akoly Vongdala</p>

            <p>On January 21st, 2020, the first confirmed case of Covid -19 was found in the United States. Less than two months later on March 11th, 2020, the Covid-19 outbreak was declared a pandemic by the World Health Organization (WHO). Shortly after, the United States declared a state of emergency and multiple states started to enact stay-at-home orders. This resulted in most, if not all, non-essential businesses to shut down for an unknown period of time. After weeks, and eventually months of waiting, businesses had to start laying off and firing employees to ensure their survival in the long term. This resulted in one of the biggest unemployment spikes our country has seen in the past two decades. What we hope to show in our article is how educational disparities have affected unemployment rates both nationally, and within Washington state as the Covid-19 pandemic first hit, and how people with different levels of education have recovered.</p>
            <UnemploymentRateLine/>
            <p>In the years leading up to the Covid-19 pandemic, unemployment rates were steadily decreasing across all education levels until they started to level off around January 1st, 2018. Those with a lower level of education tended to have a higher level of unemployment than those with a higher level of education. Between January 1st, 2019 and January 1st, 2020, people with less than a highschool diploma of education had an average unemployment rate of 5.41%. People with a highschool education, but no college education had a 3.67% average unemployment rate. Those with some college education or an associates degree had an average unemployment rate of 3.01%. Finally, people with a bachelor's degree or higher had an average unemployment rate of 2.10%. Even before the Covid-19 pandemic, we could see the disparities between those with a relatively high level of education and those who weren’t able to achieve that higher level. What the Covid-19 pandemic showed us is how large that disparity becomes when a lot of the businesses have to shut down, as well as how difficult it is for the different groups to recover from these events.</p>

            <h2>Post-Covid Unemployment: Economic Turmoil at it’s Finest</h2>
            <p>When Covid-19 started to hit the U.S., many businesses were forced to close their doors and lay off workers to prevent the company from going under. This caused a massive spike in unemployment across the country that affected almost everyone. The unemployment rate for people with less than a highschool diploma of education peaked at 21%, about 3.9 times higher than the average unemployment rate before the pandemic started. The people who had a highschool education, but no college education had their unemployment rates peak at about 17.3%, which was about 4.7 times higher than the average rate before the pandemic. Those that had some college education or an associates degree had their unemployment rate peak at 15%, about 5 times higher than the average rate before the pandemic. Finally, those with a bachelor's degree or higher, their unemployment rate peaked at 8.4%, also about 4 times higher than their average unemployment rate before the pandemic. What we find from these statistics is that people in the middle, those with a highschool education, but no college education and those with some college education or an associates degree were hit the hardest by the pandemic in terms of unemployment. People in the less than a highschool diploma of education and bachelor's degree or higher groups were affected the least by unemployment, but the increase was still substantial. As for why this trend occurred, we are unsure, and recommend further research to be done into why the two middle groups had a higher increase in their unemployment rates. As for the overall conclusion, we can safely say that no one group was safe from the effects of Covid-19 on unemployment.</p>

            <h2>Education in the U.S:</h2>

            <h2>Pre and Post Covid Unemployment Rates:</h2>

            <NationalAndWALine />

            <h2>The Long Road Ahead, and The Decisions we Need to Make</h2>
            <p>COVID-19's global impact, both in terms of lives lost and economic ruin, is expected to leave a devastating impact for years to come. The best path forward is to ensure that we learn from the lessons that were acquired during this crisis so that we can better prepare for the next one. And given the continuous history of economic and educational inequality that continues to produce unequal outcomes affecting practically every element of life in the United States, the negative socio-economic impact of COVID-19 outlined in this report should come as no surprise. We must work tirelessly to address the long-standing inequality in economic, educational, and health outcomes if we are to shield those who are most vulnerable from experiencing the same needlessly heavy burden during the next economic or public health crisis.</p>
            <br></br>

            <DegreeUnempLine />
        </div>
    );
    
};

export default App;