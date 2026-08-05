'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, database, ref, set, onValue, get, push } from '@/services/firebase';
import { useTheme } from 'next-themes';
import { 
  Activity, 
  Shield, 
  Radio, 
  LogOut, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  Ban,
  PauseCircle,
  Save,
  Terminal,
  Sun,
  Moon,
  Copy,
  Settings,
  MessageSquare,
  Trash2,
  X,
  ClipboardList,
  Maximize2,
  Minimize2,
  Download,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAIL = 'gauravpatil9262@gmail.com';

type Tab = 'nodes' | 'broadcast' | 'appeals' | 'logs';

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('nodes');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem('adminActiveTab') as Tab;
      if (savedTab) setActiveTab(savedTab);
    }
  }, []);

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('adminActiveTab', tab);
    }
  };

  // Search & Modal State
  const [hwidSearch, setHwidSearch] = useState('');
  const [managingNode, setManagingNode] = useState<any>(null);
  const [showClearLogsConfirm, setShowClearLogsConfirm] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenancePayload, setMaintenancePayload] = useState('');
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [isFullScreenLogs, setIsFullScreenLogs] = useState(false);

  // Data States
  const [liveVersion, setLiveVersion] = useState<string>('0.1.0');
  const [broadcastData, setBroadcastData] = useState({ version: '0.1.0', maintenance: false, message: '' });
  const [isPushingUpdate, setIsPushingUpdate] = useState(false);
  const [nodesList, setNodesList] = useState<any[]>([]);
  const [appealsList, setAppealsList] = useState<any[]>([]);
  const [logsList, setLogsList] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, banned: 0, hold: 0 });

  useEffect(() => {
    setMounted(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        auth.signOut();
        router.push('/admin');
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load Broadcast
  useEffect(() => {
    if (isLoading) return;
    const unsub = onValue(ref(database, 'system/broadcast'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setBroadcastData(data);
        if (data.version) setLiveVersion(data.version);
      }
    });
    return () => unsub();
  }, [isLoading]);

  // Load Appeals
  useEffect(() => {
    if (isLoading) return;
    const unsub = onValue(ref(database, 'appeals'), (snapshot) => {
      if (snapshot.exists()) {
        const list: any[] = [];
        Object.entries(snapshot.val()).forEach(([hwid, appeal]: [string, any]) => {
          if (appeal.status === 'pending') list.push({ hwid, ...appeal });
        });
        setAppealsList(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setAppealsList([]);
      }
    });
    return () => unsub();
  }, [isLoading]);

  // Load Logs
  useEffect(() => {
    if (isLoading) return;
    const unsub = onValue(ref(database, 'logs'), (snapshot) => {
      if (snapshot.exists()) {
        const list: any[] = [];
        Object.entries(snapshot.val()).forEach(([id, log]: [string, any]) => {
          list.push({ id, ...log });
        });
        setLogsList(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setLogsList([]);
      }
    });
    return () => unsub();
  }, [isLoading]);

  // Load Nodes
  useEffect(() => {
    if (isLoading) return;
    const unsub = onValue(ref(database, 'nodes'), (snapshot) => {
      if (snapshot.exists()) {
        const nodes = snapshot.val();
        let active = 0, banned = 0, hold = 0;
        const list: any[] = [];
        
        Object.entries(nodes).forEach(([hwid, node]: [string, any]) => {
          if (node.status === 'banned') banned++;
          else if (node.status === 'hold') hold++;
          else active++;
          list.push({ hwid, ...node });
        });

        setStats({ total: list.length, active, banned, hold });
        setNodesList(list);
        
        // Update modal state if managing a node
        setManagingNode((prev: any) => {
          if (!prev) return null;
          const updatedNode = list.find(n => n.hwid === prev.hwid);
          return updatedNode ? { ...prev, ...updatedNode } : prev;
        });
      } else {
        setStats({ total: 0, active: 0, banned: 0, hold: 0 });
        setNodesList([]);
      }
    });
    return () => unsub();
  }, [isLoading]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const showToast = (msg: string) => {
    setUpdateStatus(msg);
    setTimeout(() => setUpdateStatus(''), 3000);
  };

  const logAdminAction = async (message: string, targetHwid: string) => {
    try {
      const newLogRef = push(ref(database, 'logs'));
      await set(newLogRef, {
        type: 'ADMIN_ACTION',
        message,
        hwid: targetHwid,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("Failed to write admin log:", e);
    }
  };

  const handleUpdateNodeStatus = async (status: string, targetHwid: string) => {
    try {
      const existingNode = nodesList.find(n => n.hwid === targetHwid) || managingNode;
      await set(ref(database, `nodes/${targetHwid}`), {
        ...existingNode,
        status,
        updatedAt: Date.now()
      });
      showToast(`Set ${targetHwid.substring(0, 6)}... to ${status.toUpperCase()}`);
      await logAdminAction(`Admin changed node status to ${status.toUpperCase()}`, targetHwid);
    } catch (e) {
      console.error(e);
      showToast('Error updating status');
    }
  };

  const handleBumpVersion = (type: 'major' | 'minor' | 'patch') => {
    try {
      const parts = broadcastData.version.split('.');
      if (parts.length === 3) {
        let major = parseInt(parts[0], 10);
        let minor = parseInt(parts[1], 10);
        let patch = parseInt(parts[2], 10);
        
        if (isNaN(major) || isNaN(minor) || isNaN(patch)) return;

        if (type === 'major') {
          major += 1; minor = 0; patch = 0;
        } else if (type === 'minor') {
          minor += 1; patch = 0;
        } else if (type === 'patch') {
          patch += 1;
        }
        
        setBroadcastData({ ...broadcastData, version: `${major}.${minor}.${patch}` });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateBroadcast = async () => {
    setShowBroadcastModal(false);
    setIsPushingUpdate(true);
    try {
      // When pushing from the main Broadcast button, we only push the Version (Maintenance is handled separately now)
      await set(ref(database, 'system/broadcast'), broadcastData);
      showToast('System broadcast updated');
      await logAdminAction(`Admin updated System Broadcast to v${broadcastData.version}`, 'GLOBAL');
    } catch (e) {
      showToast('Error updating broadcast');
    } finally {
      setTimeout(() => setIsPushingUpdate(false), 500);
    }
  };

  const handleToggleMaintenance = () => {
    if (broadcastData.maintenance) {
      // Turn OFF immediately
      const newBroadcast = { ...broadcastData, maintenance: false, message: '' };
      set(ref(database, 'system/broadcast'), newBroadcast).then(() => {
        setBroadcastData(newBroadcast);
        showToast('Maintenance Mode DISABLED');
        logAdminAction('Admin disabled Maintenance Mode globally', 'GLOBAL');
      });
    } else {
      // Turn ON -> Show Modal
      setMaintenancePayload(broadcastData.message || 'The network is currently undergoing scheduled maintenance. Please check back later.');
      setShowMaintenanceModal(true);
    }
  };

  const handleEnableMaintenance = async () => {
    try {
      const newBroadcast = { ...broadcastData, maintenance: true, message: maintenancePayload };
      await set(ref(database, 'system/broadcast'), newBroadcast);
      setBroadcastData(newBroadcast);
      showToast('Maintenance Mode ENABLED');
      await logAdminAction('Admin enabled Maintenance Mode globally', 'GLOBAL');
      setShowMaintenanceModal(false);
    } catch (e) {
      showToast('Error enabling Maintenance Mode');
    }
  };

  const handleResolveAppeal = async (hwid: string, action: 'unban' | 'reject') => {
    try {
      if (action === 'unban') {
        await handleUpdateNodeStatus('active', hwid);
      }
      await set(ref(database, `appeals/${hwid}/status`), action === 'unban' ? 'approved' : 'rejected');
      showToast(`Appeal ${action === 'unban' ? 'APPROVED' : 'REJECTED'}`);
      await logAdminAction(`Admin ${action === 'unban' ? 'approved unban' : 'rejected'} appeal`, hwid);
    } catch (e) {
      showToast('Error resolving appeal');
    }
  };

  const handleClearLogs = () => {
    setShowClearLogsConfirm(true);
  };

  const executeClearLogs = async () => {
    try {
      await set(ref(database, 'logs'), null);
      showToast('Logs cleared.');
      await logAdminAction('Admin permanently cleared all audit logs', 'GLOBAL');
    } catch (e) {
      showToast('Error clearing logs.');
    }
    setShowClearLogsConfirm(false);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast("Please allow popups to export logs");
      return;
    }
    let html = `
      <html>
      <head>
        <title>Security Audit Logs - Send2Me</title>
        <style>
          body { font-family: monospace; padding: 20px; color: #1a1a1a; }
          h1 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
          .log { margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 12px; }
          .meta { color: #666; font-size: 0.9em; margin-bottom: 4px; }
          .type { font-weight: bold; margin-right: 10px; padding: 2px 6px; border-radius: 4px; border: 1px solid #ccc; font-size: 0.8em; }
          .msg { font-size: 1.1em; }
          .footer { margin-top: 50px; font-size: 0.8em; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Send2Me Security Audit Logs</h1>
    `;
    logsList.forEach(log => {
       html += `
         <div class="log">
           <div class="meta">
             <span class="type">${log.type}</span> 
             <span>[${new Date(log.timestamp).toLocaleString()}]</span> 
             <span><strong>HWID:</strong> ${log.hwid}</span>
           </div>
           <div class="msg">${log.message}</div>
         </div>`;
    });
    html += `<div class="footer">Exported on ${new Date().toLocaleString()}</div></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-muted">Initializing Secure Console...</div>;
  }

  const filteredNodes = nodesList.filter(n => n.hwid.toLowerCase().includes(hwidSearch.toLowerCase()));

  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary font-mono overflow-hidden selection:bg-primary/20 selection:text-primary relative">
      
      {/* TOPBAR */}
      <div className="h-14 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-text-muted" />
          <span className="font-semibold tracking-wide uppercase">Command Center // Send2Me</span>
          <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest hidden sm:block">v{liveVersion}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-4 hidden md:flex mr-4">
             <span className="text-success-text"><span className="font-bold">{stats.active}</span> Active</span>
             <span className="text-warning"><span className="font-bold">{stats.hold}</span> Hold</span>
             <span className="text-error-text"><span className="font-bold">{stats.banned}</span> Banned</span>
          </div>
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 hover:bg-bg-elevated rounded border border-transparent hover:border-border-subtle transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <span className="px-2 py-1 bg-bg-elevated rounded border border-border-subtle hidden sm:inline-block">{ADMIN_EMAIL}</span>
          <button onClick={handleLogout} className="hover:text-text-primary transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Exit
          </button>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {updateStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-primary text-primary-foreground border border-primary/30 rounded-full font-semibold shadow-lg shadow-primary/20"
          >
            {updateStatus}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPLIT LAYOUT (SIDEBAR + CONTENT) */}
      <div className="flex flex-1 min-h-0 bg-bg-primary">
        
        {/* SIDEBAR */}
        <div className="w-16 md:w-64 border-r border-border-subtle bg-bg-surface p-2 md:p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
          <button 
            onClick={() => changeTab('nodes')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'nodes' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
          >
            <Activity className="w-5 h-5 md:w-4 md:h-4 shrink-0" /> <span className="hidden md:inline font-medium">Network Nodes</span>
          </button>
          <button 
            onClick={() => changeTab('broadcast')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'broadcast' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
          >
            <Radio className="w-5 h-5 md:w-4 md:h-4 shrink-0" /> <span className="hidden md:inline font-medium">System Broadcast</span>
          </button>
          <button 
            onClick={() => changeTab('appeals')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'appeals' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
          >
            <div className="relative shrink-0">
              <MessageSquare className="w-5 h-5 md:w-4 md:h-4" />
              {appealsList.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warning"></span>}
            </div>
            <span className="hidden md:inline font-medium">Ban Appeals</span>
          </button>
          <button 
            onClick={() => changeTab('logs')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'logs' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
          >
            <ClipboardList className="w-5 h-5 md:w-4 md:h-4 shrink-0" /> <span className="hidden md:inline font-medium">Audit Logs</span>
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col min-h-0 relative bg-bg-primary/50">
          
          {/* TAB: NETWORK NODES */}
          {activeTab === 'nodes' && (
            <div className="flex-1 glass-panel flex flex-col min-h-0 rounded-xl border border-border-subtle overflow-hidden shadow-sm animate-in fade-in duration-200 w-full max-w-6xl mx-auto bg-bg-surface">
              <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-3 bg-bg-surface/50 shrink-0">
                <h2 className="font-bold flex items-center gap-2 text-lg"><Activity className="w-5 h-5 text-primary" /> Network Nodes</h2>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    value={hwidSearch}
                    onChange={(e) => setHwidSearch(e.target.value)}
                    placeholder="Search Node HWID..."
                    className="w-full bg-bg-elevated border border-border-strong rounded-full px-9 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-muted uppercase bg-bg-surface sticky top-0 border-b border-border-subtle z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider">Hardware ID</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">OS Signature</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right font-semibold tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNodes.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-text-muted">No nodes found matching your query.</td></tr>
                    ) : (
                      filteredNodes.map((node) => (
                        <tr key={node.hwid} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm text-text-primary flex items-center gap-2">
                            {node.hwid}
                            <button onClick={() => copyToClipboard(node.hwid)} className="text-text-muted hover:text-primary p-1"><Copy className="w-4 h-4" /></button>
                          </td>
                          <td className="px-6 py-4 text-text-secondary">{node.os || 'Unknown'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                              node.status === 'active' ? 'bg-success-bg text-success-text' :
                              node.status === 'banned' ? 'bg-error-bg text-error-text' : 'bg-warning/10 text-warning'
                            }`}>
                              {node.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => setManagingNode(node)}
                              className="px-4 py-2 bg-bg-surface border border-border-strong hover:border-primary hover:text-primary rounded-md text-xs font-bold transition-all shadow-sm"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="flex-1 glass-panel flex flex-col min-h-0 rounded-xl border border-border-subtle overflow-hidden shadow-sm animate-in fade-in duration-200 w-full max-w-6xl mx-auto bg-bg-surface">
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-surface/50 shrink-0">
                <h2 className="font-bold flex items-center gap-2 text-lg"><Radio className="w-5 h-5 text-primary" /> System Broadcast</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    disabled={isPushingUpdate}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-primary/20"
                  >
                    {isPushingUpdate ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Pushing Live...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Push Update
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-muted uppercase bg-bg-surface sticky top-0 border-b border-border-subtle z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider w-1/3">Setting</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-subtle hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-6 align-top">
                        <div className="font-bold text-text-primary mb-1 flex items-center gap-2">
                          Required Client Version
                          <button onClick={() => setActiveInfo(activeInfo === 'version' ? null : 'version')} className="text-text-muted hover:text-primary transition-colors focus:outline-none">
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <AnimatePresence>
                          {activeInfo === 'version' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-lg text-xs mt-2 mb-3">
                                <strong>What this does:</strong><br/>
                                This strictly dictates the minimum allowed version for clients connecting to the network. If a user opens a Desktop App with a lower version, they will be instantly blocked and forced to download the update before proceeding.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="text-xs text-text-muted mb-2">
                          Currently live: <span className="font-mono text-primary font-bold">v{liveVersion}</span>
                        </div>
                        <div className="text-xs text-text-muted mb-3">The minimum version number required for clients to connect to the network.</div>
                      </td>
                      <td className="px-6 py-6 align-top">
                        <div className="flex flex-col gap-2 max-w-md">
                          <input 
                            type="text" 
                            value={broadcastData.version}
                            onChange={(e) => setBroadcastData({...broadcastData, version: e.target.value})}
                            className="w-full bg-bg-elevated border border-border-strong rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none font-mono font-bold"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleBumpVersion('major')}
                              className="flex-1 bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-[0.95]"
                            >
                              + 1.0.0
                            </button>
                            <button 
                              onClick={() => handleBumpVersion('minor')}
                              className="flex-1 bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-[0.95]"
                            >
                              + 0.1.0
                            </button>
                            <button 
                              onClick={() => handleBumpVersion('patch')}
                              className="flex-1 bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-[0.95]"
                            >
                              + 0.0.1
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    <tr className="border-b border-border-subtle hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-6 align-top">
                        <div className="font-bold text-text-primary mb-1 flex items-center gap-2">
                          Maintenance Mode
                          <button onClick={() => setActiveInfo(activeInfo === 'maintenance' ? null : 'maintenance')} className="text-text-muted hover:text-primary transition-colors focus:outline-none">
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <AnimatePresence>
                          {activeInfo === 'maintenance' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="bg-warning/10 text-warning border border-warning/20 p-3 rounded-lg text-xs mt-2 mb-3">
                                <strong>What this does:</strong><br/>
                                Instantly disconnects and locks out all non-admin users globally. Any active transfers will be gracefully paused or interrupted. Use this during critical backend updates or when investigating an ongoing attack on the network.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="text-xs text-text-muted">Lock out all non-admin connections globally.</div>
                      </td>
                      <td className="px-6 py-6 align-top">
                        <label className="flex items-center gap-3 cursor-pointer w-fit">
                          <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${broadcastData.maintenance ? 'bg-warning' : 'bg-border-strong'}`}>
                            <motion.div 
                              layout
                              className={`w-4 h-4 rounded-full bg-white shadow-sm absolute ${broadcastData.maintenance ? 'right-1' : 'left-1'}`}
                            />
                          </div>
                          <input 
                            type="checkbox" 
                            checked={broadcastData.maintenance}
                            onChange={handleToggleMaintenance}
                            className="hidden"
                          />
                          <span className={`text-sm font-bold ${broadcastData.maintenance ? 'text-warning' : 'text-text-muted'}`}>
                            {broadcastData.maintenance ? 'ACTIVE' : 'OFF'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BAN APPEALS */}
          {activeTab === 'appeals' && (
            <div className="flex-1 glass-panel flex flex-col min-h-0 rounded-xl border border-border-subtle overflow-hidden shadow-sm animate-in fade-in duration-200 w-full max-w-4xl mx-auto bg-bg-surface">
              <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-bg-surface/50 shrink-0">
                <h2 className="font-bold flex items-center gap-2 text-xl"><MessageSquare className="w-6 h-6 text-warning" /> Ban Appeals Queue</h2>
                <div className="bg-warning/20 text-warning px-4 py-1.5 rounded-full font-bold text-sm border border-warning/30">
                  {appealsList.length} Pending
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide p-6 bg-bg-primary/30">
                {appealsList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-60">
                    <CheckCircle2 className="w-16 h-16 mb-4 text-success-text" />
                    <p className="text-lg">The queue is completely empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appealsList.map((appeal) => (
                      <div key={appeal.hwid} className="bg-bg-surface border border-border-strong rounded-xl p-6 shadow-md hover:border-border-subtle transition-colors">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-1">Hardware ID</span>
                            <span className="font-mono text-sm text-text-primary">{appeal.hwid}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-1">Submitted</span>
                            <span className="text-sm text-text-secondary">{new Date(appeal.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="bg-bg-elevated p-4 rounded-lg mb-6 border border-border-subtle">
                           <span className="text-xs uppercase font-bold text-text-muted tracking-wider block mb-2">Appeal Message</span>
                           <p className="text-base text-text-primary italic leading-relaxed">&quot;{appeal.message}&quot;</p>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => handleResolveAppeal(appeal.hwid, 'unban')}
                            className="flex-1 bg-success-bg/20 text-success-text hover:bg-success-bg border border-success-text/30 py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve & Unban Node
                          </button>
                          <button 
                            onClick={() => handleResolveAppeal(appeal.hwid, 'reject')}
                            className="flex-1 bg-error-bg/20 text-error-text hover:bg-error-bg border border-error-text/30 py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <Ban className="w-4 h-4" /> Reject Appeal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className={`transition-all duration-300 ease-in-out ${isFullScreenLogs ? 'fixed inset-0 z-40 bg-bg-primary p-4 md:p-8 flex flex-col' : 'flex-1 glass-panel flex flex-col min-h-0 rounded-xl border border-border-subtle overflow-hidden shadow-sm animate-in fade-in duration-200 w-full max-w-6xl mx-auto bg-bg-surface'}`}>
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-surface shrink-0">
                <h2 className="font-bold flex items-center gap-2 text-lg"><Terminal className="w-5 h-5 text-primary" /> Security Audit Logs</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportPDF}
                    className="text-sm text-text-primary hover:bg-bg-elevated px-4 py-2 border border-border-strong hover:border-border-subtle rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                  <button 
                    onClick={handleClearLogs}
                    className="text-sm text-error-text hover:bg-error-bg px-4 py-2 border border-error-text/30 hover:border-error-text/50 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                  <div className="w-px h-6 bg-border-subtle mx-1"></div>
                  <button 
                    onClick={() => setIsFullScreenLogs(!isFullScreenLogs)}
                    className="p-2 hover:bg-bg-elevated text-text-muted hover:text-text-primary rounded-lg transition-colors border border-transparent hover:border-border-subtle"
                    title={isFullScreenLogs ? "Exit Fullscreen" : "Expand Fullscreen"}
                  >
                    {isFullScreenLogs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-bg-elevated text-text-primary font-mono text-sm leading-relaxed scrollbar-hide shadow-inner">
                {logsList.length === 0 ? (
                  <div className="text-text-muted opacity-50 flex h-full items-center justify-center">No recent security events recorded.</div>
                ) : (
                  logsList.map((log) => (
                    <div key={log.id} className="mb-3 border-b border-border-subtle pb-3 hover:bg-bg-surface p-2 rounded transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-start gap-4">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-xs shrink-0 mt-0.5 shadow-sm ${
                          log.type === 'TAMPER' ? 'bg-error-bg text-error-text border border-error-text/30' : 
                          log.type === 'ADMIN_ACTION' ? 'bg-primary/10 text-primary border border-primary/30' : 
                          log.type === 'OFFLINE' ? 'bg-warning/10 text-warning border border-warning/30' : 
                          'bg-success-bg/20 text-success-text border border-success-text/30'
                        }`}>
                          {log.type}
                        </span>
                        <div className="flex flex-col gap-1">
                           <span className="font-semibold text-text-primary">{log.message}</span>
                           <span className="text-xs text-text-muted font-bold tracking-wider">{log.hwid}</span>
                        </div>
                      </div>
                      <div className="text-xs text-text-secondary whitespace-nowrap opacity-80 shrink-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MANAGE NODE MODAL */}
      <AnimatePresence>
        {managingNode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-elevated/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Manage Node</h2>
                </div>
                <button onClick={() => setManagingNode(null)} className="p-1 hover:bg-bg-surface rounded-full text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 flex-1">
                <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle mb-6 space-y-4 shadow-inner">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Hardware ID</label>
                    <div className="font-mono text-sm break-all text-text-primary flex items-center justify-between mt-1">
                      {managingNode.hwid}
                      <button onClick={() => copyToClipboard(managingNode.hwid)} className="text-text-muted hover:text-primary"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">OS Signature</label>
                      <div className="text-sm font-medium mt-1">{managingNode.os || 'Unknown'}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Current Status</label>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase shadow-sm ${
                          managingNode.status === 'active' ? 'bg-success-bg text-success-text border border-success-text/30' :
                          managingNode.status === 'banned' ? 'bg-error-bg text-error-text border border-error-text/30' : 'bg-warning/10 text-warning border border-warning/30'
                        }`}>
                          {managingNode.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Last Seen</label>
                     <div className="text-sm text-text-secondary mt-1">
                       {managingNode.lastSeen ? new Date(managingNode.lastSeen).toLocaleString() : 'Never'}
                     </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider mb-1">Administrative Actions</label>
                  <button 
                    onClick={() => handleUpdateNodeStatus('active', managingNode.hwid)}
                    className="w-full py-3.5 bg-success-bg/20 text-success-text border border-success-text/30 rounded-xl hover:bg-success-bg transition-colors flex items-center justify-center gap-2 font-bold"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Set Node to ACTIVE
                  </button>
                  <button 
                    onClick={() => handleUpdateNodeStatus('hold', managingNode.hwid)}
                    className="w-full py-3.5 bg-warning/10 text-warning border border-warning/30 rounded-xl hover:bg-warning/20 transition-colors flex items-center justify-center gap-2 font-bold"
                  >
                    <PauseCircle className="w-5 h-5" /> Place Node on HOLD
                  </button>
                  <button 
                    onClick={() => handleUpdateNodeStatus('banned', managingNode.hwid)}
                    className="w-full py-3.5 bg-error-bg text-error-text border border-error-text/30 rounded-xl hover:bg-error-text/20 transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-error-bg/20 mt-2"
                  >
                    <Ban className="w-5 h-5" /> PERMANENT BAN
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLEAR LOGS CONFIRMATION MODAL */}
      <AnimatePresence>
        {showClearLogsConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-bg-surface border border-error-text/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-error-bg/20">
                <AlertTriangle className="w-6 h-6 text-error-text" />
                <h2 className="font-bold text-lg text-error-text">Clear Audit Logs</h2>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-text-secondary">
                  Are you absolutely sure you want to clear all security audit logs? This action is <strong className="text-error-text">permanent</strong> and cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowClearLogsConfirm(false)}
                    className="flex-1 py-3 bg-bg-elevated hover:bg-bg-surface border border-border-strong rounded-xl text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeClearLogs}
                    className="flex-1 py-3 bg-error-bg text-error-text border border-error-text/30 hover:bg-error-text/20 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-error-bg/20"
                  >
                    Yes, Delete Logs
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    {/* BROADCAST CONFIRMATION MODAL */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-bg-surface border border-primary/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-primary/10">
                <Radio className="w-6 h-6 text-primary" />
                <h2 className="font-bold text-lg text-primary">Push Update</h2>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-text-secondary">
                  You are about to push a live network update to all connected clients.
                </p>
                
                <div className="bg-bg-elevated p-4 rounded-xl border border-border-strong flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Current Live Version:</span>
                    <span className="font-mono text-text-primary">v{liveVersion}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-text-primary">New Broadcast Version:</span>
                    <span className="font-mono text-primary">v{broadcastData.version}</span>
                  </div>
                  {broadcastData.maintenance && (
                    <div className="mt-2 pt-2 border-t border-border-strong text-xs text-warning flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5" /> Maintenance Mode Enabled
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 py-3 bg-bg-elevated hover:bg-bg-surface border border-border-strong rounded-xl text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateBroadcast}
                    className="flex-1 py-3 bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20"
                  >
                    Confirm & Push
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: ENABLE MAINTENANCE MODE */}
      <AnimatePresence>
        {showMaintenanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMaintenanceModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-surface border border-border-subtle rounded-2xl p-6 w-full max-w-lg shadow-2xl relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4 border border-warning/20 shadow-inner">
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Enable Maintenance Mode?</h3>
              <p className="text-text-muted mb-6 px-4">
                This will forcefully disconnect <strong>ALL non-admin nodes</strong> globally. Enter the message that users will see on their locked screens:
              </p>
              
              <textarea 
                value={maintenancePayload}
                onChange={(e) => setMaintenancePayload(e.target.value)}
                className="w-full bg-bg-elevated border border-border-strong rounded-lg px-4 py-3 text-sm focus:border-warning transition-colors resize-none h-32 focus:outline-none mb-8 shadow-inner"
                placeholder="The network is currently undergoing scheduled maintenance..."
              />
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowMaintenanceModal(false)}
                  className="flex-1 px-6 py-3 bg-bg-elevated hover:bg-border-subtle text-text-primary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEnableMaintenance}
                  className="flex-1 px-6 py-3 bg-warning hover:bg-warning/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-warning/20 hover:shadow-warning/40"
                >
                  Enable Lockdown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
