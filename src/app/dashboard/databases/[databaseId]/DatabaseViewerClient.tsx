"use client";
import { useState, useEffect } from "react";

interface RecruiterRecord {
  _id: string;
  name: string;
  companyName: string;
  jobTitle: string;
  location: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  companyWebsite?: string;
}

interface DatabaseViewerProps {
  databaseId: string;
  databaseName: string;
  databaseDescription: string;
}

export default function DatabaseViewerClient({ databaseId, databaseName, databaseDescription }: DatabaseViewerProps) {
  const [records, setRecords] = useState<RecruiterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [showFeatureAlert, setShowFeatureAlert] = useState(false);

  const fetchRecords = async (searchTerm: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "25",
        ...(searchTerm && { search: searchTerm }),
      });

      console.log("Fetching records from:", `/api/databases/${databaseId}/records?${params}`);
      const res = await fetch(`/api/databases/${databaseId}/records?${params}`);
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await res.json();
      console.log("Response data:", data);
      
      if (data.success) {
        setRecords(data.data.records);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || "Failed to fetch records");
      }
    } catch (err) {
      console.error("Error fetching records:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(search, page);
  }, [databaseId, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRecords(search, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePhoneClick = () => {
    setShowFeatureAlert(true);
    setTimeout(() => setShowFeatureAlert(false), 3000);
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{databaseName}</h1>
        <p style={{ color: "var(--sub)", fontSize: 16 }}>{databaseDescription}</p>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search recruiter, company, role or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ maxWidth: 400 }}
        />
        <button type="submit" className="btn btn-primary" style={{ marginLeft: 8 }}>
          Search
        </button>
      </form>

      {error && (
        <div style={{ padding: 16, backgroundColor: "#fee", border: "1px solid #fcc", borderRadius: 8, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {showFeatureAlert && (
        <div style={{ padding: 16, backgroundColor: "#e3f2fd", border: "1px solid #2196f3", borderRadius: 8, marginBottom: 24, color: "#1976d2" }}>
          🚀 Phone numbers will be available in an upcoming feature!
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--sub)" }}>Loading records...</div>
      ) : (
        <>
          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 14 }}>Name</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 14 }}>Company</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 14 }}>Role</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 14 }}>Location</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 14 }}>Email</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 14 }}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: 12, fontSize: 14 }}>{record.name}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>{record.companyName}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>{record.jobTitle}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>{record.location}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>{record.email || "-"}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <button
                        onClick={handlePhoneClick}
                        style={{
                          background: "linear-gradient(90deg, #ccc 0%, #999 50%, #ccc 100%)",
                          backgroundSize: "200% 100%",
                          border: "none",
                          padding: "4px 8px",
                          cursor: "pointer",
                          color: "transparent",
                          fontSize: 14,
                          fontWeight: "600",
                          filter: "blur(6px)",
                          userSelect: "none",
                          textShadow: "0 0 10px rgba(0,0,0,0.5)",
                          opacity: 0.7,
                          borderRadius: "4px"
                        }}
                        title="Click to see upcoming feature"
                      >
                        ••••••••••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--sub)" }}>
              No records found matching your search.
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{ padding: "8px 16px" }}
              >
                Previous
              </button>
              <span style={{ color: "var(--sub)" }}>
                Page {page} of {pagination.totalPages} ({pagination.total} total records)
              </span>
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
                style={{ padding: "8px 16px" }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
