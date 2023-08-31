import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { transformRawDataToDataSet } from './DataController';

interface DataPoint {
    date: Date;
    unique_view: number;
    page_view: number;
}

type DataSet = DataPoint[];

interface ChartProps {
    margin?: { top: number, right: number, bottom: number, left: number };
}

const TrendChart: React.FC<ChartProps> = ({
    margin = { top: 20, right: 20, bottom: 60, left: 50 }
}) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                const scrollbarWidth = 17; // 스크롤바 너비 감안
                const newWidth = containerRef.current.offsetWidth - scrollbarWidth;
                const newHeight = containerRef.current.offsetHeight - scrollbarWidth;
                setWidth(newWidth);
                setHeight(newHeight);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);


    useEffect(() => {
        if (width === 0 || height === 0) {
            return;
        }
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
                        .range([1, width - margin.left - margin.right - 5]);

                    const yScaleLine = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.unique_view) as number])
                        .range([height - margin.top - margin.bottom, 0]);

                    const yScaleBar = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.page_view) as number])
                        .range([height - margin.top - margin.bottom, 0]);

                    const xAxis = d3.axisBottom(xScale);

                    const yAxisLeft = d3.axisLeft(yScaleLine);
                    const yAxisRight = d3.axisRight(yScaleBar);

                    svg.append("g")
                        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
                        .call(xAxis);

                    svg.append("g")
                        .call(yAxisLeft);

                    svg.append("g")
                        .attr("transform", `translate(${width - margin.right - margin.left},0)`)
                        .call(yAxisRight);

                    const line = d3.line<DataPoint>()
                        .x(d => xScale(d.date))
                        .y(d => yScaleLine(d.unique_view));

                    svg.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "blue")
                        .attr("stroke-width", 0.5)
                        .attr("d", line);

                    svg.selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", d => xScale(d.date) as number)
                        .attr("y", d => yScaleBar(d.page_view) as number)
                        .attr("width", 5)
                        .attr("height", d => Math.max(0, height - margin.top - margin.bottom - (yScaleBar(d.page_view) as number)))
                        .attr("fill", "red");
                    // Draw legend
                    const legend = svg.append("g")
                        .attr("transform", `translate(${ margin.left  + 100},${height - margin.bottom + 20})`);

                    const categories = ['Unique View', 'Page View'];
                    const colors = ['blue', 'red'];

                    categories.forEach((category, i) => {
                        const legendRow = legend.append('g')
                            .attr('transform', `translate(${i * 120}, 0)`); // Increase spacing between legend items
                    
                        legendRow.append('rect')
                            .attr('width', 10)
                            .attr('height', 10)
                            .attr('fill', colors[i]);
                    
                        legendRow.append('text')
                            .attr('x', 20)
                            .attr('y', 10)
                            .attr('text-anchor', 'start')
                            .style('text-transform', 'capitalize')
                            .text(category);
                    });
                    
                });
        }
    }, [width, height, margin]);
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const scrollbarWidth = 17; // 스크롤바 너비 감안
                const newWidth = containerRef.current.offsetWidth - scrollbarWidth;
                const newHeight = containerRef.current.offsetHeight - scrollbarWidth;
                setWidth(newWidth);
                setHeight(newHeight);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // 컴포넌트가 마운트될 때 크기를 업데이트
        updateSize();

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <svg ref={ref} width={width} height={height}></svg>
        </div>
    );
};

export default TrendChart;
