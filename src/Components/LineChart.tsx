import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { transformRawDataToDataSet } from './DataController';

interface DataPoint {
    date: Date;
    unique_view: number;
    page_view: number;
}

type DataSet = DataPoint[];

interface ChartProps {
    width?: number;
    height?: number;
    margin?: { top: number, right: number, bottom: number, left: number };
}

const TrendChart: React.FC<ChartProps> = ({ 
    width = 600, 
    height = 400, 
    margin = { top: 20, right: 20, bottom: 50, left: 50 } // 여기에 margin을 추가했습니다.
}) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            d3.json("https://static.adbrix.io/front/coding-test/event_1.json")
                .then((response: any) => {
                    d3.select(ref.current).selectAll("*").remove();
    
                    const data: DataSet = transformRawDataToDataSet(response);
    
                    const svg = d3.select(ref.current)
                                  .append('g')
                                  .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
                    const xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => d.date) as [Date, Date])
                        .range([0, width - margin.left - margin.right]);
    
                        const yScaleLine = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.page_view) as number])
                        .range([height - margin.top - margin.bottom - 200, 500]);
                    
                    // For the bar chart
                    const yScaleBar = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.page_view) as number])
                        .range([height - margin.top - margin.bottom, 0]);
    
                    const xAxis = d3.axisBottom(xScale);
    
                    svg.append("g")
                        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
                        .call(xAxis);
    
                    const line = d3.line<DataPoint>()
                        .x(d => xScale(d.date))
                        .y(d => yScaleLine(d.unique_view));
    
                    svg.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "blue")
                        .attr("stroke-width", 0.5)
                        .attr("d", line);
    
                    // Uncomment this if you want to add the bars back
                    svg.selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", d => xScale(d.date) as number)
                        .attr("y", d => yScaleBar(d.page_view) as number)
                        .attr("width", 5)
                        .attr("height", d => height - margin.top - margin.bottom - (yScaleBar(d.page_view) as number))
                        .attr("fill", "red");
                    
                });
        }
    }, [width, height, margin]);

    return <svg ref={ref} width={width} height={height}></svg>;
};

export default TrendChart;
