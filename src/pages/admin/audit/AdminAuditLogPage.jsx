import { useState, useEffect } from "react";
import adminAuditApi from "../../../api/adminAuditApi";
import Pagination from "../../../components/common/Pagination";
import Loader from "../../../components/common/Loader";

const AdminAuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [currentPage]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await adminAuditApi.getLogs({ page: currentPage, limit: 20 });
            setLogs(data.logs || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("로그 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="admin-page-container" style={{ padding: "20px" }}>
            <h1 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
                🛡️ 보안 감사 로그 (Audit Log)
            </h1>

            <div className="table-wrapper" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}> {/* tableLayout: fixed 추가 */}
                    <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #eee" }}>
                        <tr>
                            <th style={{ padding: "12px", width: "15%" }}>일시</th>
                            <th style={{ padding: "12px", width: "15%" }}>관리자</th>
                            <th style={{ padding: "12px", width: "12%" }}>활동(Action)</th>
                            <th style={{ padding: "12px", width: "20%" }}>대상(Target)</th>
                            <th style={{ padding: "12px", width: "28%" }}>상세 내용(Details)</th> {/* 👈 추가됨! */}
                            <th style={{ padding: "12px", width: "10%" }}>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#888" }}>기록된 로그가 없습니다.</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "12px", fontSize: "13px" }}>{formatDate(log.createdAt)}</td>
                                    <td style={{ padding: "12px" }}>
                                        <div style={{ fontWeight: "bold" }}>{log.admin?.name || "알수없음"}</div>
                                        <div style={{ fontSize: "12px", color: "#888" }}>{log.admin?.email}</div>
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        <span style={{
                                            padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold",
                                            background: log.action.includes("삭제") || log.action.includes("거부") ? "#ffebee" : "#e3f2fd",
                                            color: log.action.includes("삭제") || log.action.includes("거부") ? "#c62828" : "#1565c0"
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "13px", wordBreak: "break-all" }}>{log.target}</td>

                                    {/* 👇 여기가 핵심! 상세 내용 보여주는 곳 */}
                                    <td style={{ padding: "12px", fontSize: "13px", color: "#555", wordBreak: "break-all" }}>
                                        {log.details || "-"}
                                    </td>

                                    <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px" }}>{log.ip || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AdminAuditLogPage;