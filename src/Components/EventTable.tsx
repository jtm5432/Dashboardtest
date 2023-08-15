import { useState } from 'react';

interface TableProps {
    data: (string | number)[][];
}

const EventTable: React.FC<TableProps> = ({ data }) => {
    const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
    const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
    const [sortAscending, setSortAscending] = useState(false);
    const sortedData = [...data].sort((a, b) => {
        const countA = Number(a[3]);
        const countB = Number(b[3]);
        return sortAscending ? countA - countB : countB - countA;
    });

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
        const country = item[0] as string;
        const region = item[1] as string;
        const city = item[2] as string;
        const count = item[3] as number;
        if (!acc[country]) acc[country] = {};
        if (!acc[country][region]) acc[country][region] = [];
        acc[country][region].push({ city, count });
        return acc;
    }, {});
    const sortedCountryData = Object.entries(countryData).sort(([countryA, regionsA], [countryB, regionsB]) => {
        const countA = Object.values(regionsA as any).reduce(
            (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0), // 변환
            0
        );
        const countB = Object.values(regionsB as any).reduce(
            (acc, cities: any) => acc + cities.reduce((cityAcc, cityData) => cityAcc + Number(cityData.count), 0), // 변환
            0
        );
        return sortAscending ? countA - countB : countB - countA;
    });

    return (
        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Country / Region / City</th>
                        <th onClick={toggleSort}>
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
                                    <td>{country}</td>
                                    <td>{countryCount}</td>
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
                                                    <td style={{ paddingLeft: '20px' }}>{region}</td>
                                                    <td>{regionCount}</td>
                                                </tr>
                                                {expandedRegions.has(regionKey) &&
                                                    sortedCities.map((cityData, cityIndex) => (
                                                        <tr key={cityIndex}>
                                                            <td></td>
                                                            <td style={{ paddingLeft: '40px' }}>{cityData.city}</td>
                                                            <td>{cityData.count}</td>
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
