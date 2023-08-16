import  { useEffect, useState, useRef } from 'react';

interface TableProps {
    data: (string | number)[][];
    style?: React.CSSProperties;
    columnWidths?: number[];
    width?: number;
    height?: number;
}

const getValue = (value: any) => {
    if (value === null || value === undefined || value.length === 0) {
        return 'etc';
    }
    return value;
};

const EventTable: React.FC<TableProps> = ({ data, style, columnWidths, width, height }) => {
    const tableContainerRef = useRef(null);
    const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
    const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
    const [sortAscending, setSortAscending] = useState(false);
    const [tableWidth, setTableWidth] = useState(width);
    const [tableHeight, setTableHeight] = useState(height);

    useEffect(() => {
        setTableWidth(width);
        setTableHeight(height);
    }, [width, height]);


    const toggleSort = () => {
        setSortAscending(!sortAscending);
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
        const country = getValue(item[0]) as string;
        const region = getValue(item[1]) as string;
        const city = getValue(item[2]) as string;
        const count = item[3] as number;

        if (!acc[country]) acc[country] = {};
        if (!acc[country][region]) acc[country][region] = [];
        acc[country][region].push({ city, count });
        return acc;
    }, {});

    const sortedCountryData = Object.entries(countryData).sort(([countryA, regionsA], [countryB, regionsB]) => {
        const countA = Object.values(regionsA as any).reduce(
            (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0), 
            0
        );
        const countB = Object.values(regionsB as any).reduce(
            (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0), 
            0
        );
        return sortAscending ? countA - countB : countB - countA;
    });
    console.log('tableContainerRef',tableWidth,tableHeight)
    return (
        <div ref={tableContainerRef} style={{ overflow: 'auto', width: tableWidth, height: tableHeight }}>
              <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ width: `${columnWidths[0]}%`, textAlign: 'center' }}></th>
                        <th style={{ width: `${columnWidths[1]}%`, textAlign: 'center' }}>Country / Region / City</th>
                        <th style={{ width: `${columnWidths[2]}%`, textAlign: 'center' }} onClick={toggleSort}>
                            Event Count {sortAscending ? '▲' : '▼'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCountryData.map(([country, regions], countryIndex) => {
                        const countryCount = Object.values(regions).reduce(
                            (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0),
                            0
                        );

                        const sortedRegions = Object.entries(regions).sort(([regionA, citiesA], [regionB, citiesB]) => {
                            const countA = (citiesA as any[]).reduce((acc, cityData) => acc + Number(cityData.count), 0);
                            const countB = (citiesB as any[]).reduce((acc, cityData) => acc + Number(cityData.count), 0);
                            return sortAscending ? countA - countB : countB - countA;
                        });

                        return (
                            <React.Fragment key={countryIndex}>
                                <tr>
                                    <td onClick={() => toggleExpandCountry(country)}>
                                        {expandedCountries.has(country) ? '-' : '+'}
                                    </td>
                                    <td style={{ paddingLeft: '20px', textAlign: 'center' }}>{getValue(country)}</td>
                                    <td style={{ textAlign: 'center' }}>{countryCount}</td>
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
                                                    <td style={{ paddingLeft: '20px' }}>{getValue(region)}</td>
                                                    <td>{regionCount}</td>
                                                </tr>
                                                {expandedRegions.has(regionKey) &&
                                                    sortedCities.map((cityData, cityIndex) => (
                                                        <tr key={cityIndex}>
                                                            <td style={{ textAlign: 'center' }}></td>
                                                            <td style={{ paddingLeft: '40px', textAlign: 'center' }}>{getValue(cityData.city)}</td>
                                                            <td style={{ textAlign: 'center' }}>{cityData.count}</td>
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
    