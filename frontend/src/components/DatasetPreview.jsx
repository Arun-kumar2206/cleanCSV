const DatasetPreview = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No preview data available.</p>;
  }

  const previewRows = data.slice(0, 10);
  const columns = Object.keys(previewRows[0]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {previewRows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2 text-slate-900 whitespace-nowrap">
                    {row[col] !== null && row[col] !== undefined
                      ? row[col].toString()
                      : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 text-xs text-slate-500">Showing first 10 rows</div>
    </div>
  );
};

export default DatasetPreview;
