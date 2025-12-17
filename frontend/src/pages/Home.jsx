import { useState } from "react";
import FileUpload from "../components/FileUpload";
import DatasetPreview from "../components/DatasetPreview";
import Summary from "../components/Summary";
import Loader from "../components/Loader";
import { preprocessDataset } from "../api/preprocessApi";

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [preview, setPreview] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setError("");
    setLoading(true);
    setSummary(null);
    setPreview(null);
    setDownloadUrl(null);

    try {
      const response = await preprocessDataset(file);

      setSummary(response.summary);
      setPreview(response.preview);
      setDownloadUrl(response.download_url);
    } catch (err) {
      setError(err?.message || "Failed to process dataset. Please try again."); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">cleanCSV</h1>
            <p className="mt-2 text-slate-600">
              Upload a CSV to automatically fill missing values and encode categorical features.
            </p>
          </div>

          <div className="space-y-6">
            <FileUpload file={file} setFile={setFile} />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Processing..." : "Start Preprocessing"}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-white font-medium shadow-sm hover:bg-emerald-700"
                >
                  Download Cleaned CSV
                </a>
              )}
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </p>
            )}

            {loading && <Loader />}

            {summary && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Preprocessing Summary</h2>
                <Summary summary={summary} />
              </div>
            )}

            {preview && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Dataset Preview</h2>
                <DatasetPreview data={preview} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
