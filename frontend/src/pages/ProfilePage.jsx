import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../api/library";
import UserInfo from "../components/UserInfo";
import History from "../components/History";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState("info"); // "info" | "history"
  const [records, setRecords] = useState([]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setRecords(data);
  }, []);

  useEffect(() => {
    if (tab === "history") {
      loadHistory();
    }
  }, [tab, loadHistory]);

  return (
    <div className="page profile-page">
      <div className="profile-tabs">
        <button
          className={tab === "info" ? "tab active" : "tab"}
          onClick={() => setTab("info")}
        >
          مشخصات کاربری
        </button>
        <button
          className={tab === "history" ? "tab active" : "tab"}
          onClick={() => setTab("history")}
        >
          تاریخچه
        </button>
      </div>

      <div className="profile-content">
        {tab === "info" && <UserInfo user={user} />}
        {tab === "history" && <History records={records} onChanged={loadHistory} />}
      </div>
    </div>
  );
}
