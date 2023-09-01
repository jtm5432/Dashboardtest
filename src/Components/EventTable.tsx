import { useEffect, useState, useRef } from 'react';

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
     * 
     * @param country 국가index
     * @param region 지역 index
     * @param city 시 index
     * @returns 
     */
    const getCountValue = (country: string, region: string, city: string) => {
        if (country && region && city) return addArrayLength(countryData[country][region][city]);
        else if (country && region) return addArrayLength(countryData[country][region]);
        else return addArrayLength(countryData[country]);
    }
    const getValue = (value: any) => {
        if (value === null || value === undefined || value.length === 0) {
            return 'etc';
        }
        return value;
    };
    const addArrayLength = (value: any) => {

        if (typeof (value) === 'object') {
            //console.log('addArrayLength', value, Array.isArray(value))
            let counter = 0;
            for (let ii in value) {
                if (typeof (value[ii]) === 'object') counter = counter + addArrayLength(value[ii]);
                else counter++;
            }
            return counter;
        }
        else return 1;

    }
    const toggleSort = () => {
        setSortAscending(!sortAscending);
        setSortCriterion('sortAscending');


    };

    const handleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortCriterion('sortOrder');

    };

    const toggleExpandCountry = (country: string) => {
        const newExpandedCountries = new Set(expandedCountries);
        if (newExpandedCountries.has(country)) {
            newExpandedCountries.delete(country);
        } else {
            newExpandedCountries.add(country);
        }
        setExpandedCountries(newExpandedCountries);
    };

    const toggleExpandRegion = (regionKey: string) => {
        const newExpandedRegions = new Set(expandedRegions);
        if (newExpandedRegions.has(regionKey)) {
            newExpandedRegions.delete(regionKey);
        } else {
            newExpandedRegions.add(regionKey);
        }
        setExpandedRegions(newExpandedRegions);
    };

    const countryData = data.reduce((acc: any, item) => {
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
    const sortedCountryData = React.useMemo(() => {
        return Object.entries(countryData).sort(([countryA, regionsA], [countryB, regionsB]) => {
            const countA = Object.values(regionsA as string).reduce(
                (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0),
                0
            );
            const countB = Object.values(regionsB as string).reduce(
                (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0),
                0
            );
            
            if (sortCriterion === 'sortAscending') {
                return sortAscending ? countA - countB : countB - countA;
            }
            else {
                const countA = getCountValue(countryA, '', ''); // 수정
                const countB = getCountValue(countryB, '', ''); // 수정
                console.log('sortCriterion',countA,countB)
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
                        <th style={{ width: `${columnWidths[0]}%`, textAlign: 'center' }}></th>
                        <th style={{ width: `${columnWidths[1]}%`, textAlign: 'center' }}>Country / Region / City
                            Country / Region / City
                            <button onClick={handleSort}>
                                {sortOrder === 'asc' ? '▲' : '▼'}
                            </button>
                        </th>
                        <th style={{ width: `${columnWidths[2]}%`, textAlign: 'center' }} onClick={toggleSort}>
                            Event Count {sortAscending ? '▲' : '▼'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedCountryData.map(([country, regions], countryIndex) => {
                            const countryCount = Object.values(regions).reduce(
                                (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0),
                                0
                            );

                            const sortedRegions = Object.entries(regions).sort(([regionA, citiesA], [regionB, citiesB]) => {
                                const countA = getCountValue(country, regionA, ''); // 수정
                                const countB = getCountValue(country, regionB, ''); // 수정
                               // console.log('sortOrder',sortOrder)
                                return sortOrder === 'asc' ? countA - countB : countB - countA;
                            });

                            return (
                                <React.Fragment key={countryIndex}>
                                    <tr>
                                        <td onClick={() => toggleExpandCountry(country)}>
                                            {expandedCountries.has(country) ? '-' : '+'}
                                        </td>
                                        <td style={{ paddingLeft: '20px' }}>{getValue(country)} ({getCountValue(country, '', '')})</td>
                                        <td style={{ paddingLeft: '20px' }}>{countryCount}</td>
                                    </tr>
                                    {expandedCountries.has(country) &&
                                        sortedRegions.map(([region, cities], regionIndex) => {
                                            const regionKey = `${country}-${region}`;
                                            const regionCount = (cities as any[]).reduce((acc, cityData) => acc + Number(cityData.count), 0);
                                            const sortedCities = (cities as any[]).sort((cityA, cityB) => {
                                                const countA = Number(cityA.count);
                                                const countB = Number(cityB.count);
                                                return sortAscending ? countA - countB : countB - countA;
                                            });

                                            return (
                                                <React.Fragment key={regionIndex}>
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
                                                </React.Fragment>
                                            );
                                        })}
                                </React.Fragment>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;
