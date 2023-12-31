import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import DraggableWidget from './DraggableWidget';
import './App.css';     
import { Layout } from 'react-grid-layout';
import SummaryComponent from './Components/MetricChart';
import LineComponent from './Components/LineChart';
import PieComponent from './Components/PieChart';
import TableComponent from './Components/TableChart';
const ResponsiveGridLayout = WidthProvider(Responsive);


const App: React.FC = () => {
  const [layout, setLayout] = useState<Layout[]>(loadFromSessionStorage() || []);

  const layouts = layout ? {lg:layout,md:layout,sm:layout}:{
    lg: [
      { i: 'a', x: 0, y: 0, w: 6, h: 2 },
      { i: 'b', x: 6, y: 0, w: 6, h: 2 },
      { i: 'c', x: 0, y: 2, w: 12, h: 2 },
      { i: 'd', x: 0, y: 4, w: 6, h: 2 },
      { i: 'e', x: 6, y: 4, w: 6, h: 2 },
    ],
    md: [
      { i: 'a', x: 0, y: 0, w: 5, h: 2 },
      { i: 'b', x: 6, y: 0, w: 5, h: 2 },
      { i: 'c', x: 0, y: 2, w: 10, h: 2 },
      { i: 'd', x: 0, y: 4, w: 5, h: 2 },
      { i: 'e', x: 6, y: 4, w: 5, h: 2 },
    ],
    sm: [
      { i: 'a', x: 0, y: 0, w: 2, h: 2 },
      { i: 'b', x: 6, y: 0, w: 2, h: 2 },
      { i: 'c', x: 0, y: 2, w: 4, h: 2 },
      { i: 'd', x: 0, y: 4, w: 2, h: 2 },
      { i: 'e', x: 6, y: 4, w: 2, h: 2 },

    ]
  };
  const gridBoxStyle = {
    backgroundColor: "white",
    border: "1px solid blue",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",  // added shadow for a more "card-like" appearance
    borderRadius: "8px",  // added border radius for rounded corners
  };
  useEffect(() => {
    const savedLayout = loadFromSessionStorage();
    if (savedLayout) {
      setLayout(savedLayout);
    }
  }, []);
  useEffect(() => {
    saveToSessionStorage(layout)  ;
  }, [layout]);
  
  function saveToSessionStorage(layout: Layout[]) {
    sessionStorage.setItem('myGridLayout', JSON.stringify(layout));
  }
  function loadFromSessionStorage() {
    const savedLayout = sessionStorage.getItem('myGridLayout');
    return savedLayout ? JSON.parse(savedLayout) : undefined;
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ margin: "20px" }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          margin={[10, 10]}
          onLayoutChange={(newLayout: Layout[]) => {
            setLayout(newLayout);
            saveToSessionStorage(newLayout);
          }}
          onDragStop={(layout: Layout[]) => {
            setLayout(layout);
            saveToSessionStorage(layout);
          }}
        >
          <div key="a" style={gridBoxStyle}>
           <DraggableWidget title="접속 유저" component={<SummaryComponent viewType="unique_view" />} />

          </div>
          <div key="b" style={gridBoxStyle}>
          <DraggableWidget title="접속 횟수" component={<SummaryComponent viewType="page_view" />} />

          </div>
          <div key="c" style={gridBoxStyle}>
          <DraggableWidget title="DAU" component={<LineComponent />} />

          </div>
          <div key="d" style={gridBoxStyle}>
          <DraggableWidget title="Top Referral" component={<PieComponent />} />

          </div>
          <div key="e" style={gridBoxStyle}>
          <DraggableWidget title="Top Referral" component={<TableComponent />} />

          </div>
        </ResponsiveGridLayout>
      </div>
    </DndProvider>
  );
}

export default App;
