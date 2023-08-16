import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { transformDataForD3 } from './DataController';

type DataType = {
    date: string;
    unique_view: number;
    page_view: number;
};

interface SummaryComponentProps {
    viewType: 'unique_view' | 'page_view';
}

interface MetricChartProps {
    title: string;
    value: number;
    description: string;
}
const fixedUrl = "https://static.adbrix.io/front/coding-test/event_1.json";

const SummaryComponent: React.FC<SummaryComponentProps> = ({ viewType }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateDimensions = () => {
        if (ref.current) {
            setDimensions({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    };

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

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
                        .html(` <span style="color: red;">&darr; ${viewDifference}</span>`);
                }
            }
        });
    }, [viewType, dimensions.width, dimensions.height]);

    return <div ref={ref}></div>
}

export default SummaryComponent;
