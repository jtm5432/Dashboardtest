import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { transformDataForD3 } from './DataController';

type DataType = {
    date: string;
    unique_view: number;
    page_view: number;
};

interface SummaryComponentProps {
    viewType: 'unique_view' | 'page_view'; // viewType만 props로 남깁니다.
}

const fixedUrl = "https://static.adbrix.io/front/coding-test/event_1.json"; // 고정된 url 값

const SummaryComponent: React.FC<SummaryComponentProps> = ({ viewType }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        d3.json<DataType[]>(fixedUrl).then(res => {
            if (res) {
                const d3FormattedData = transformDataForD3(res);

                const eventSum = d3.sum(d3FormattedData, d => d[viewType]);
                const latestView = d3FormattedData[d3FormattedData.length - 1][viewType];
                const prevView = d3FormattedData[d3FormattedData.length - 2]?.[viewType] || 0;
                const viewDifference = latestView - prevView;

                if (ref.current) {
                    d3.select(ref.current).selectAll("*").remove();
                    d3.select(ref.current)
                        .append('p')
                        .text(`Event Sum: ${eventSum}`);

                    d3.select(ref.current)
                        .append('p')
                        .text(`View Difference (Today vs Yesterday): ${viewDifference}`);
                }
            }
        });
    }, [viewType]);

    return <div ref={ref}></div>
}

export default SummaryComponent;
