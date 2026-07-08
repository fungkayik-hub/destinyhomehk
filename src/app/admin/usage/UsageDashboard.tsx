"use client";

import { useCallback, useEffect, useState } from "react";
import type { UsageStats } from "@/lib/usage/types";

export default function UsageDashboard() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/usage");
      if (res.status === 401) {
        setNeedsLogin(true);
        setStats(null);
        return;
      }
      if (res.status === 503) {
        setError("ADMIN_USAGE_SECRET 尚未設定，請喺 Vercel 環境變數加入密碼。");
        return;
      }
      if (!res.ok) {
        setError("無法載入統計資料");
        return;
      }
      setNeedsLogin(false);
      setStats((await res.json()) as UsageStats);
    } catch {
      setError("連線失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/usage/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) {
      setLoginError("密碼錯誤");
      return;
    }
    setSecret("");
    await loadStats();
  };

  if (loading && !stats && !needsLogin && !error) {
    return <p className="text-sm text-destiny-purple/60">載入中…</p>;
  }

  if (needsLogin) {
    return (
      <form onSubmit={handleLogin} className="card max-w-md">
        <h2 className="font-display text-lg font-bold text-destiny-purple mb-2">管理員登入</h2>
        <p className="text-sm text-destiny-purple/65 mb-4">
          輸入 ADMIN_USAGE_SECRET 先可以睇統計。
        </p>
        <label className="block mb-4">
          <span className="text-sm text-destiny-purple/70 mb-1 block">密碼</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            autoComplete="current-password"
            required
          />
        </label>
        {loginError && <p className="text-sm text-destiny-red mb-3">{loginError}</p>}
        <button type="submit" className="btn-primary">
          登入
        </button>
      </form>
    );
  }

  if (error) {
    return <p className="text-sm text-destiny-red">{error}</p>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-destiny-purple/50">
          更新時間：{new Date(stats.generatedAt).toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" })}
        </p>
        <button type="button" onClick={() => void loadStats()} className="btn-secondary text-sm">
          重新整理
        </button>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-destiny-gold/10 border-destiny-gold/30">
          <p className="text-xs text-destiny-purple/60 mb-1">總使用次數（已排除你嘅 IP）</p>
          <p className="font-display text-3xl font-bold text-destiny-purple">{stats.totals.events}</p>
        </div>
        <div className="card bg-destiny-green/10 border-destiny-green/30">
          <p className="text-xs text-destiny-purple/60 mb-1">估計獨立訪客</p>
          <p className="font-display text-3xl font-bold text-destiny-purple">
            {stats.totals.uniqueVisitors}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-destiny-purple/60 mb-1">求籤（DB 記錄）</p>
          <p className="font-display text-3xl font-bold text-destiny-purple">
            {stats.fortuneStick.totalDraws}
          </p>
          <p className="text-xs text-destiny-purple/50 mt-1">
            付費解籤 {stats.fortuneStick.paidInterpretations} 次
          </p>
        </div>
      </section>

      {!stats.excludeConfigured && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          提示：設定 <code className="text-xs">ADMIN_EXCLUDE_IPS</code> 可以自動排除你自己嘅測試流量。
        </p>
      )}

      <section className="card overflow-x-auto">
        <h2 className="font-display text-lg font-bold text-destiny-purple mb-4">各工具用量</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-destiny-purple/60 border-b border-destiny-purple/10">
              <th className="pb-2 pr-4">工具</th>
              <th className="pb-2 pr-4">使用次數</th>
              <th className="pb-2">獨立訪客</th>
            </tr>
          </thead>
          <tbody>
            {stats.tools.map((row) => (
              <tr key={row.tool} className="border-b border-destiny-purple/5">
                <td className="py-2.5 pr-4 font-medium">{row.label}</td>
                <td className="py-2.5 pr-4">{row.total}</td>
                <td className="py-2.5">{row.uniqueVisitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="font-display text-lg font-bold text-destiny-purple mb-4">過去 7 日</h2>
        {stats.last7Days.length === 0 ? (
          <p className="text-sm text-destiny-purple/60">暫時未有記錄</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-destiny-purple/60 border-b border-destiny-purple/10">
                <th className="pb-2 pr-4">日期</th>
                <th className="pb-2 pr-4">使用次數</th>
                <th className="pb-2">獨立訪客</th>
              </tr>
            </thead>
            <tbody>
              {stats.last7Days.map((row) => (
                <tr key={row.date} className="border-b border-destiny-purple/5">
                  <td className="py-2.5 pr-4">{row.date}</td>
                  <td className="py-2.5 pr-4">{row.total}</td>
                  <td className="py-2.5">{row.uniqueVisitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="text-xs text-destiny-purple/55 space-y-1">
        <p>「獨立訪客」按 IP hash 估算，唔係精準人數；同一 Wi‑Fi 可能計成一人。</p>
        <p>GA4 亦會記錄 <code>tool_submit</code> event（如有設定 NEXT_PUBLIC_GA_ID）。</p>
      </section>
    </div>
  );
}
