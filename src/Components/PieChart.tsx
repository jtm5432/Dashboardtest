import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartData {
    referrer: string;
    users: number;
}

interface ChartProps {
    width?: number;
    height?: number;
}

const PieChart: React.FC<ChartProps> = ({ width = 600, height = 400 }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (ref.current) {
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
    
                    const pie = d3.pie<PieChartData>().value(d => d.users);
                    const data = pie(top4Data);
    
                    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
                        .innerRadius(0)
                        .outerRadius(Math.min(width, height) / 2);
    
                    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
                    const svg = d3.select(ref.current);
    
                    // 파이 조각을 그룹으로 묶기 위한 <g> 요소 생성
                    const arcs = svg.selectAll(".arc")
                        .data(data)
                        .enter().append("g")
                        .attr('class', 'arc')
                        .attr('transform', `translate(${width / 2}, ${height / 2})`);
                    
                    // 각 그룹에 경로 추가
                    arcs.append('path')
                        .attr('d', arc)
                        .attr('fill', d => color(d.data.referrer))
                        .attr('stroke', 'white')
                        .attr('stroke-width', '2px');
                        console.log('arcs',arcs,data)
                });
        }
    }, [width, height]);
    

    return <svg ref={ref} width={width} height={height}></svg>;
};

export default PieChart;
