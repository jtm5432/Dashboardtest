// DataController.tsx

interface RowDataMetirc {
    daily: string;
    unique_view: number;
    page_view: number;
  }
  
// DataController.tsx

type DataTypeMetric = {
  unique_view: number;
  page_view: number;
};

interface RawDataLine {
  data: {
      headers: Array<{
          idx: number;
          key: string;
          label: string;
          description: string;
          property_type: string;
          value_type: string;
      }>;
      rows: Array<[string, string, string]>;
  };
  result: boolean;
  message: string;
  version: string;
  last_compile_time: string;
}

interface DataPointLine {
  date: Date;
  unique_view: number;
  page_view: number;
}

export function transformDataForD3(data: any): DataTypeMetric[] {
  console.log('transformDataForD3',data)
  data = data.data;
  const headers = data.headers.map((header: any) => header.key);
  
  // rows의 각 항목을 객체 형태로 변환
  return data.rows.map((row: any) => {
    let transformedRow: any = {};
    headers.forEach((header: string, index: number) => {
      if (header !== 'daily') {
        transformedRow[header] = +row[index];
      }
    });
    return transformedRow;
  });
}


export function transformRawDataToDataSet(rawData: RawDataLine): DataPointLine[] {
  const dataSet = rawData.data.rows.map(row => ({
      date: new Date(row[0]),
      unique_view: parseInt(row[1], 10),
      page_view: parseInt(row[2], 10)
  }));

  // 날짜를 기준으로 데이터를 정렬합니다.
  dataSet.sort((a, b) => a.date.getTime() - b.date.getTime());

  return dataSet;
}
