import { useState, useEffect } from "react";

export default function ApiDataDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/bitlinks/api/minutes/fetchtempminutes");
        const apiResponse = await response.json();
        setData(apiResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="api-container">
      <h2 className="api-title">API Response Data</h2>

      {loading ? (
        <div className="api-loader">Loading data, please wait...</div>
      ) : (
        <div className="api-table-container">
          <table className="api-table">
            <thead className="api-table-header">
              <tr className="api-table-row">
                <th className="api-table-heading">ID</th>
                <th className="api-table-heading">Company or Persondetails</th>
                <th className="api-table-heading">Minutes</th>
                <th className="api-table-heading">Status</th>
                <th className="api-table-heading">Handler</th>
                <th className="api-table-heading">Date</th>
                <th className="api-table-heading">Deadline</th>
              </tr>
            </thead>
            <tbody className="api-table-body">
              {data.map((item) => (
                <tr key={item.id} className="api-table-row">
                  <td className="api-table-cell">{item.id}</td>
                  <td className="api-table-cell">{item.fullname}</td>
                  <td className="api-table-cell">{item.minutes}</td>
                  <td className="api-table-cell">{item.status}</td>
                  <td className="api-table-cell">{item.handler}</td>
                  <td className="api-table-cell">{new Date(item.date).toLocaleString()}</td>
                  <td className="api-table-cell">{new Date(item.deadline).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
