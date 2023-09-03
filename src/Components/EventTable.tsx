import { useEffect, useState, useRef } from 'react';
import { useMemo, Fragment } from 'react';
import React from 'react';
/**
 * @typedef TableProps
 * @property {Array<Array<string | number>>} data - 테이블 데이터.
 * @property {React.CSSProperties} [style] - (optional) 컴포넌트의 스타일.
 * @property {Array<number>} [columnWidths] - (optional) 각 칼럼의 너비.
 * @property {number} [width] - (optional) 테이블의 너비.
 * @property {number} [height] - (optional) 테이블의 높이.
 */

interface TableProps {
    data: (string | number)[][];
    style?: React.CSSProperties;
    columnWidths?: number[];
    width?: number;
    height?: number;
}


const EventTable: React.FC<TableProps> = ({ data, style, columnWidths, width, height }) => {
    const tableContainerRef = useRef(null);
    const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
    const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

    const [tableWidth, setTableWidth] = useState(width);
    const [tableHeight, setTableHeight] = useState(height);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // added
    const [sortAscending, setSortAscending] = useState(false);
    const [sortCriterion, setSortCriterion] = useState<'sortOrder' | 'sortAscending'>('sortOrder');

    useEffect(() => {
        setTableWidth(width);
        setTableHeight(height);
    }, [width, height]);

    /**
     * 국가, 지역, 도시 인덱스를 통해 카운트 값을 가져옵니다.
     * @param {string} country 국가 인덱스
     * @param {string} region 지역 인덱스
     * @param {string} city 도시 인덱스
     * @returns {number}
     */
    const getCountValue = (country: string, region: string, city: string) => {
        if (country && region && city) return addArrayLength(countryData[country][region][city]);
        else if (country && region) return addArrayLength(countryData[country][region]);
        else return addArrayLength(countryData[country]);
    }
    /**
 * 지정된 값이 없거나 길이가 0이면 'etc'를 반환하고, 그렇지 않으면 값을 반환합니다.
 * @param {*} value
 * @returns {string}
 */
    const getValue = (value: any) => {
        if (value === null || value === undefined || value.length === 0) {
            return 'etc';
        }
        return value;
    };
    /**
 * 지정된 값이 없거나 길이가 0이면 'etc'를 반환하고, 그렇지 않으면 값을 반환합니다.
 * @param {*} value
 * @returns {string}
 */
    const addArrayLength = (value: any) => {

        if (typeof (value) === 'object') {
            //if(value.city==='etc')console.log('addArrayLength', value,value.city)
            let counter = 0;
            for (let ii in value) {
                //if(value.city==='etc') console.log('object',value[ii])
                if (typeof (value[ii]) === 'object') counter = counter + addArrayLength(value[ii]);
                else if (ii !== 'count') counter++;
            }
            return counter;
        }
        else return 1;

    }
    /**
 * 정렬 순서를 전환합니다.
 */
    const toggleSort = () => {
        setSortAscending(!sortAscending);
        setSortCriterion('sortAscending');


    };

    /**
     * 정렬 핸들러.
     */
    const handleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortCriterion('sortOrder');

    };
    /**
      * 지정된 국가의 확장 상태를 전환합니다.
      * @param {string} country
      */
    const toggleExpandCountry = (country: string) => {
        const newExpandedCountries = new Set(expandedCountries);
        if (newExpandedCountries.has(country)) {
            newExpandedCountries.delete(country);
        } else {
            newExpandedCountries.add(country);
        }
        setExpandedCountries(newExpandedCountries);
    };

    /**
     * 지정된 지역의 확장 상태를 전환합니다.
     * @param {string} regionKey
     */
    const toggleExpandRegion = (regionKey: string) => {
        const newExpandedRegions = new Set(expandedRegions);
        if (newExpandedRegions.has(regionKey)) {
            newExpandedRegions.delete(regionKey);
        } else {
            newExpandedRegions.add(regionKey);
        }
        setExpandedRegions(newExpandedRegions);
    };
    /**
       * countryData 객체를 생성합니다. 
       * 이 객체는 국가, 지역, 도시별로 그룹화된 데이터를 포함합니다.
       */
    const countryData = data?.reduce((acc: any, item) => {
        console.log('drawData')
        const country = getValue(item[0]) as string;
        const region = getValue(item[1]) as string;
        const city = getValue(item[2]) as string;
        const count = item[3] as number;

        if (!acc[country]) acc[country] = {};
        if (!acc[country][region]) acc[country][region] = [];
        acc[country][region].push({ city, count });
        return acc;
    }, {});
    /**
  * sortedCountryData 객체를 생성합니다.
  * 이 객체는 countryData 객체를 정렬된 순서로 포함합니다.
  */
    const sortedCountryData = useMemo(() => {
        if (!countryData) return [];
        return Object.entries(countryData).sort(([countryA, regionsA], [countryB, regionsB]) => {
            const countA = Object.values(regionsA as string).reduce(
                (acc, cities: any) => acc + cities.reduce((cityAcc: number, cityData: { count: number }) => cityAcc + Number(cityData.count), 0),
                0
            );
            const countB = Object.values(regionsB as string).reduce(
                (acc, cities: any) => acc + cities.reduce((cityAcc: number, cityData: { count: number }) => cityAcc + Number(cityData.count), 0),
                0
            );


            if (sortCriterion === 'sortAscending') {
                return sortAscending ? countA - countB : countB - countA;
            }
            else {
                const countA = getCountValue(countryA, '', ''); // 수정
                const countB = getCountValue(countryB, '', ''); // 수정
                console.log('sortCriterion', countA, countB)
                return sortOrder === 'asc' ? countA - countB : countB - countA;
            }
        });
    }, [countryData, sortOrder, sortAscending, sortCriterion]);
    // console.log('tableContainerRef', tableWidth, tableHeight)
    return (
        <div ref={tableContainerRef} style={{ overflow: 'auto', width: tableWidth, height: tableHeight }}>
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: `${columnWidths ? columnWidths[0] : 'auto'}%`, textAlign: 'center' }}></th>
                        <th style={{ width: `${columnWidths ? columnWidths[1] : 'auto'}%`, textAlign: 'center' }}>Country / Region / City
                            Country / Region / City
                            <button onClick={handleSort}>
                                {sortOrder === 'asc' ? '▲' : '▼'}
                            </button>
                        </th>
                        <th style={{ width: `$${columnWidths ? columnWidths[2] : 'auto'}%`, textAlign: 'center' }} onClick={toggleSort}>
                            Event Count {sortAscending ? '▲' : '▼'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedCountryData.map(([country, regions]: [string, unknown], countryIndex: number) => {
                            regions = regions as Record<string, { city: string, count: number }>;
                            console.log('regions', regions)
                            let countryCount;
                            let sortedRegions;
                            if (typeof regions === 'object' && regions !== null) {
                                countryCount = Object.values(regions).reduce(
                                    (acc, cities: any) => acc + cities.reduce((cityAcc: number, cityData: any) => cityAcc + Number(cityData.count), 0),
                                    0
                                );

                                sortedRegions = Object.entries(regions).sort(([regionA, citiesA], [regionB, citiesB]) => {
                                    const countA = getCountValue(country, regionA, ''); // 수정
                                    const countB = getCountValue(country, regionB, ''); // 수정
                                    // console.log('sortOrder',sortOrder)
                                    return sortOrder === 'asc' ? countA - countB : countB - countA;
                                });
                            }

                            return (
                                <Fragment key={countryIndex}>
                                    <tr>
                                        <td onClick={() => toggleExpandCountry(country)}>
                                            {expandedCountries.has(country) ? '-' : '+'}
                                        </td>
                                        <td style={{ paddingLeft: '20px' }}>{getValue(country)} ({getCountValue(country, '', '')})</td>
                                        <td style={{ paddingLeft: '20px' }}>{countryCount}</td>
                                    </tr>
                                    {expandedCountries.has(country) &&
                                        sortedRegions?.map(([region, cities], regionIndex) => {
                                            const regionKey = `${country}-${region}`;
                                            const regionCount = (cities as any[]).reduce((acc, cityData) => acc + Number(cityData.count), 0);
                                            const sortedCities = (cities as any[]).sort((cityA, cityB) => {
                                                const countA = Number(cityA.count);
                                                const countB = Number(cityB.count);
                                                return sortAscending ? countA - countB : countB - countA;
                                            });

                                            return (
                                                <Fragment key={regionIndex}>
                                                    <tr>
                                                        <td onClick={() => toggleExpandRegion(regionKey)}>
                                                            {expandedRegions.has(regionKey) ? '-' : '+'}
                                                        </td>
                                                        <td style={{ paddingLeft: '40px' }}>{getValue(region)} ({getCountValue(country, region, '')})</td>
                                                        <td style={{ paddingLeft: '40px' }}>{regionCount}</td>
                                                    </tr>
                                                    {expandedRegions.has(regionKey) &&
                                                        sortedCities.map((cityData, cityIndex) => (
                                                            <tr key={cityIndex}>
                                                                <td style={{ paddingLeft: '20px' }}></td>
                                                                <td style={{ paddingLeft: '60px' }}>{getValue(cityData.city)} ({getCountValue(country, region, cityData.city)}) </td>
                                                                <td style={{ paddingLeft: '60px' }}>{cityData.count}</td>
                                                            </tr>
                                                        ))}
                                                </Fragment>
                                            );
                                        })}
                                </Fragment>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;
