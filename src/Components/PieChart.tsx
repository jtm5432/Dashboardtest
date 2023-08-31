import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface PieChartData {
    referrer: string;
    users: number;
    color?: string; // optional color property
}

interface ChartProps {
    width?: number;
    height?: number;
}

const PieChart: React.FC<ChartProps> = ({ width = 600, height = 400 }) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const [chartWidth, setChartWidth] = useState(width);
    const [chartHeight, setChartHeight] = useState(height - 100);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [legendData, setLegendData] = useState<PieChartData[]>([]); // State 선언
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const legendItemRef = useRef<HTMLDivElement | null>(null);
    const legendContainerRef = useRef<HTMLDivElement | null>(null);
    const [maxItemsInView, setMaxItemsInView] = useState(6);//최대 legend 개수
    const drawChart = () => {
        if (ref.current) {
            d3.select(ref.current).selectAll("*").remove(); // Clear existing chart elements

            d3.json("https://static.adbrix.io/front/coding-test/event_3.json")
                .then((response: any) => {
                    const rawData: PieChartData[] = response.data.rows.map((row: any) => ({
                        referrer: row[0],
                        users: +row[1]
                    }));

                    const sortedData = rawData.sort((a, b) => b.users - a.users);

                    let top4Data = sortedData.slice(0, 4);
                    let otherData = sortedData.slice(4);
                    let otherSum = otherData.reduce((acc, curr) => acc + curr.users, 0);

                    if (otherSum > 0) {
                        top4Data.push({ referrer: 'etc', users: otherSum });
                    }
                    top4Data = top4Data.map((item, index) => ({
                        ...item,
                        color: d3.schemeCategory10[index]
                    }));
                    const pie = d3.pie<PieChartData>().value(d => d.users);
                    const data = pie(top4Data);

                    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
                        .innerRadius(0)
                        .outerRadius(Math.min(chartWidth, chartHeight - 100) / 2);  // 높이에서 100px을 뺀 값을 반경으로 설정

                    const color = d3.scaleOrdinal(d3.schemeCategory10);

                    const svg = d3.select(ref.current);

                    const arcs = svg.selectAll(".arc")
                        .data(data)
                        .enter().append("g")
                        .attr('class', 'arc')
                        .attr('transform', `translate(${chartWidth / 2}, ${(chartHeight - 100) / 2})`);  // 높이에서 100px을 뺀 값을 중심으로 설정

                    arcs.append('path')
                        .attr('d', arc)
                        .attr('fill', d => color(d.data.referrer))
                        .attr('stroke', 'white')
                        .attr('stroke-width', '2px');

                    setLegendData(top4Data); // Set legend data
                });
        }
    }


    useEffect(() => {
        drawChart(); // Draw chart initially

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setChartWidth(entry.contentRect.width);
                setChartHeight(entry.contentRect.height);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };


    }, []);

    const handlePrev = () => {
        setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
        setStartIndex((prevIndex) => Math.min(legendData.length - 1, prevIndex + 1));
    };

    useEffect(() => {
        drawChart(); // Redraw chart on resize
    }, [chartWidth, chartHeight]);
    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <svg ref={ref} style={{ flex: 1 }} width={chartWidth}></svg>
            <div ref={legendContainerRef} style={{ height: '30px', display: 'flex',marginBottom:'30px' }}>
                <button onClick={handlePrev} disabled={startIndex === 0}>&lt;</button>
                <div style={{ flexGrow: 1, display: 'flex', overflowX: 'hidden' }}>
                    {legendData.slice(startIndex, startIndex + maxItemsInView).map((item, index) => (
                        <div ref={index === 0 ? legendItemRef : null} key={index} className="legend-item">
                            <span
                                className="legend-color"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="legend-label">{item.referrer}</span>
                        </div>
                    ))}
                </div>
                <button onClick={handleNext} disabled={startIndex >= legendData.length}>&gt;</button>
            </div>
        </div>
    );
 

};

export default PieChart;
