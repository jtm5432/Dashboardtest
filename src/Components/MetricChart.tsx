import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { transformDataForD3 } from './DataController';

/**
 * @typedef {Object} DataType
 * @property {string} date - 데이터의 날짜.
 * @property {number} unique_view - 유니크 조회수.
 * @property {number} page_view - 페이지 조회수.
 */
type DataType = {
    date: string;
    unique_view: number;
    page_view: number;
};
    
/**
 * @typedef {Object} SummaryComponentProps
 * @property {'unique_view' | 'page_view'} viewType - 요약할 조회수의 타입.
 */
interface SummaryComponentProps {
    viewType: 'unique_view' | 'page_view';
}

interface MetricChartProps {
    title: string;
    value: number;
    description: string;
}

/**
 * 가져올 JSON 데이터의 URL.
 * @constant
 * @type {string}
 */
const fixedUrl = "https://static.adbrix.io/front/coding-test/event_1.json";

/**
 * 고정된 URL에서 데이터를 가져와 `viewType` prop ('unique_view' 또는 'page_view')을 기반으로 요약하는 컴포넌트.
 * 요약된 데이터 (이벤트 합계와 조회수 차이)가 표시됩니다.
 *
 * @component
 * @param {SummaryComponentProps} props
 */
const SummaryComponent: React.FC<SummaryComponentProps> = ({ viewType }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    /**
     * `ref.current`의 현재 차원을 `dimensions` 상태로 업데이트합니다.
     */
    const updateDimensions = () => {
        if (ref.current) {
            setDimensions({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    };

    /**
     * 창 `resize` 이벤트에 이벤트 리스너를 추가하여 차원을 업데이트합니다.
     */
    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    /**
     * `viewType`, `dimensions.width`, 또는 `dimensions.height`가 변경될 때마다 `fixedUrl`에서 데이터를 가져옵니다.
     * 데이터는 변환되고 요약되며, 그 요약은 `ref.current`에 표시됩니다.
     */
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
                        .text(`이벤트 합계: ${eventSum}`);

                    d3.select(ref.current)
                        .append('p')
                        .html(` <span style="color: red;">&darr; - ${viewDifference}</span>`);
                }
            }
        });
    }, [viewType, dimensions.width, dimensions.height]);

    return <div ref={ref}></div>
}

export default SummaryComponent;