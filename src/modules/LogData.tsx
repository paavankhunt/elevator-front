import React, { useCallback, useEffect, useState } from 'react';

interface Log {
  passengers: number;
  fromFloor: number;
  toFloor: number;
  dateTime: string;
}

function LogData() {
  const [data, setData] = useState<Array<Log>>();
  const getLog = useCallback(async () => {
    const result = await fetch(`${process.env.REACT_APP_API_URL}`)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setData(result);
        return result;
      });

    return result;
  }, []);

  useEffect(() => {
    getLog();
  }, [getLog]);

  return (
    <div>
      <table>
        <thead>
          <th
            style={{
              paddingInline: '1rem',
            }}
          >
            passengers
          </th>
          <th
            style={{
              paddingInline: '1rem',
            }}
          >
            fromFloor
          </th>
          <th
            style={{
              paddingInline: '1rem',
            }}
          >
            toFloor
          </th>
          <th>datetime</th>
        </thead>
        <tbody>
          {data &&
            data.map((i, index) => {
              return (
                <tr key={index}>
                  <td
                    style={{
                      paddingInline: '1rem',
                    }}
                  >
                    {i.passengers}
                  </td>
                  <td
                    style={{
                      paddingInline: '1rem',
                    }}
                  >
                    {i.fromFloor}
                  </td>
                  <td
                    style={{
                      paddingInline: '1rem',
                    }}
                  >
                    {i.toFloor}
                  </td>
                  <td>{String(i?.dateTime)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default LogData;
