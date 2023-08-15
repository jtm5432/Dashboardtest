import React, { useEffect, useState } from 'react';
import EventTable from './EventTable';
interface EventData {
  country: string;
  region: string;
  city: string;
  count: number;
}

const EventTableApp: React.FC = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://static.adbrix.io/front/coding-test/event_4.json")
      .then(response => response.json())
      .then(data => {
        setData(data.data.rows);  // 가정: rows에 원하는 데이터가 배열로 담겨있다.
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <EventTable data={data} />;
};

export default EventTableApp;
