import { useRef } from "react";

const FileUpload = ({ file, setFile }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = ""; 
  };

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB"]; 
    const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
    const value = (bytes / Math.pow(1024, i)).toFixed(2);
    return `${value} ${sizes[i]}`;
  };

  return (
    <div className="space-y-3">
      <label htmlFor="csv-upload" className="block text-sm font-medium text-slate-700">
        Upload CSV File
      </label>

      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="sr-only"
        ref={inputRef}
      />

      <label
        htmlFor="csv-upload"
        className="block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50"
      >
        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 text-slate-400"
          >
            <path d="M12 2a5 5 0 00-5 5v2H6a4 4 0 000 8h12a4 4 0 000-8h-1V7a5 5 0 00-5-5zm-1 13.59V10a1 1 0 112 0v5.59l1.3-1.3a1 1 0 111.4 1.42l-3 3a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.42l1.3 1.3z" />
          </svg>
          <span className="text-sm text-slate-700">
            <span className="font-semibold text-indigo-700">Click to upload</span>
          </span>
          <span className="text-xs text-slate-500">CSV files only</span>
        </div>
      </label>

      {file && (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-200 text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6 2a2 2 0 00-2 2v16c0 1.1.9 2 2 2h9.5a2 2 0 001.6-.8l2.5-3.2a2 2 0 00.4-1.2V4a2 2 0 00-2-2H6zm8 14h4l-4 5v-5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="csv-upload"
              className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Change
            </label>
            <button
              type="button"
              onClick={clearFile}
              className="inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-rose-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
