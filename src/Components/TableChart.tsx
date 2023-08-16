import React, { useEffect, useState } from 'react';
import EventTable from './EventTable';

const EventTableApp: React.FC = () => {
  const [data, setData] = useState<(string | number)[][]>([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(window.innerWidth - 100); // Reduce 100px from window width
  const [height, setHeight] = useState(window.innerHeight - 100); // Reduce 100px from window height

  useEffect(() => {
    fetch("https://static.adbrix.io/front/coding-test/event_4.json")
      .then(response => response.json())
      .then(data => {
        setData(data.data.rows); // 가정: rows에 원하는 데이터가 배열로 담겨있다.
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });

    // Resize observer를 이용하여 EventTableApp의 크기 변화를 감지
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width - 100);
        setHeight(entry.contentRect.height - 100);
      }
    });

    const container = document.getElementById('eventTableAppContainer');
    if (container) {
      resizeObserver.observe(container);
    }

    // Cleanup function: observer를 중지
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="eventTableAppContainer" style={{ width: `${width}px`, height: `${height}px` }}>
      <EventTable data={data} style={{ width, height }} columnWidths={[10, 60, 30]} />
    </div>
  );
};

export default EventTableApp;
