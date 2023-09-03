import React, { useEffect, useState } from 'react';
import EventTable from './EventTable';
interface ChartProps {
    width?: number;
    height?: number;
}

const EventTableApp:  React.FC<ChartProps> = ({ width = 600, height = 400 }) => {
  const [data, setData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    fetch("https://static.adbrix.io/front/coding-test/event_4.json")
      .then(response => response.json())
      .then(data => {
        setData(data.data.rows); // 가정: rows에 원하는 데이터가 배열로 담겨있다.
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setData([]);
        setLoading(false);
      });

    
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="eventTableAppContainer">
      <EventTable data={data}  columnWidths={[10, 60, 30]} />
    </div>
  );
};

export default EventTableApp;
