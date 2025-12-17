const Summary = ({ summary }) => {
  if (!summary || Object.keys(summary).length === 0) {
    return <p>No preprocessing summary available.</p>;
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2 text-left font-medium w-1/3">Column</th>
            <th className="px-3 py-2 text-left font-medium">Action Taken</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {Object.entries(summary).map(([column, action]) => (
            <tr key={column} className="hover:bg-slate-50">
              <td className="px-3 py-2 text-slate-900 font-medium">{column}</td>
              <td className="px-3 py-2 text-slate-700">
                {action}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
