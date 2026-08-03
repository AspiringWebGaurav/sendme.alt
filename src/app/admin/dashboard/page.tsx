'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, database, ref, set, onValue, get } from '@/services/firebase';
import { useTheme } from 'next-themes';
import { 
  Activity, 
  Shield, 
  Radio, 
  LogOut, 
  Search, 
  AlertTriangle,
  Monitor,
  Laptop,
  CheckCircle2,
  Ban,
  PauseCircle,
  Save,
  Terminal,
  Sun,
  Moon,
  Copy,
  Settings
} from 'lucide-react';

const ADMIN_EMAIL = 'gauravpatil9262@gmail.com';

type Tab = 'stats' | 'access' | 'broadcast';

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [isLoading, setIsLoading] = useState(true);

  // Access Control State
  const [hwidSearch, setHwidSearch] = useState('');
  const [currentNodeState, setCurrentNodeState] = useState<{status: string, os?: string, lastActive?: number} | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  // System Broadcast State
  const [broadcastData, setBroadcastData] = useState({ version: '1.0.0', maintenance: false, message: '' });

  // Stats State
  const [stats, setStats] = useState({ total: 0, win11: 0, win10: 0, active: 0, banned: 0, hold: 0 });
  const [nodesList, setNodesList] = useState<any[]>([]);

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

  // Load Broadcast Data
  useEffect(() => {
    if (isLoading) return;
    const sysRef = ref(database, 'system/broadcast');
    const unsub = onValue(sysRef, (snapshot) => {
      if (snapshot.exists()) {
        setBroadcastData(snapshot.val());
      }
    });
    return () => unsub();
  }, [isLoading]);

  // Load Stats and Nodes
  useEffect(() => {
    if (isLoading) return;
    const nodesRef = ref(database, 'nodes');
    const unsub = onValue(nodesRef, (snapshot) => {
      if (snapshot.exists()) {
        const nodes = snapshot.val();
        let total = 0, win11 = 0, win10 = 0, active = 0, banned = 0, hold = 0;
        const list: any[] = [];
        
        Object.entries(nodes).forEach(([hwid, node]: [string, any]) => {
          total++;
          if (node.os?.includes('11')) win11++;
          if (node.os?.includes('10')) win10++;
          if (node.status === 'banned') banned++;
          else if (node.status === 'hold') hold++;
          else active++;
          
          list.push({ hwid, ...node });
        });

        setStats({ total, win11, win10, active, banned, hold });
        setNodesList(list);
      }
    });
    return () => unsub();
  }, [isLoading]);

  const handleSearchHwid = async (overrideHwid?: string) => {
    const target = overrideHwid || hwidSearch;
    if (!target.trim()) return;
    try {
      const nodeRef = ref(database, `nodes/${target}`);
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        setCurrentNodeState(snapshot.val());
        setUpdateStatus('');
      } else {
        setCurrentNodeState({ status: 'not_found' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleManageNode = (hwid: string) => {
    setHwidSearch(hwid);
    setActiveTab('access');
    handleSearchHwid(hwid);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleUpdateNodeStatus = async (status: string) => {
    if (!hwidSearch.trim()) return;
    try {
      const nodeRef = ref(database, `nodes/${hwidSearch}`);
      await set(nodeRef, {
        ...currentNodeState,
        status,
        updatedAt: Date.now()
      });
      setCurrentNodeState(prev => prev ? { ...prev, status } : { status });
      setUpdateStatus(`Successfully set to ${status.toUpperCase()}`);
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (e) {
      console.error(e);
      setUpdateStatus('Error updating status');
    }
  };

  const handleUpdateBroadcast = async () => {
    try {
      const sysRef = ref(database, 'system/broadcast');
      await set(sysRef, broadcastData);
      setUpdateStatus('System broadcast updated');
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (e) {
      console.error(e);
      setUpdateStatus('Error updating broadcast');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-muted">Initializing Secure Console...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-mono selection:bg-primary/20 selection:text-primary">
      
      {/* Topbar */}
      <div className="h-14 border-b border-border-subtle bg-bg-surface flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-text-muted" />
          <span className="font-semibold tracking-wide">SEND2ME // ADMIN CONSOLE</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 hover:bg-bg-elevated rounded border border-transparent hover:border-border-subtle transition-colors"
              title="Toggle Theme"
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

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <div className="w-16 md:w-64 border-r border-border-subtle bg-bg-surface p-2 md:p-4 flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'stats' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
            title="Active Nodes"
          >
            <Activity className="w-5 h-5 md:w-4 md:h-4 shrink-0" /> <span className="hidden md:inline">Active Nodes</span>
          </button>
          <button 
            onClick={() => setActiveTab('access')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'access' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
            title="Access Control"
          >
            <Shield className="w-5 h-5 md:w-4 md:h-4 shrink-0" /> <span className="hidden md:inline">Access Control</span>
          </button>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`w-full flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-3 rounded-md text-sm transition-all ${activeTab === 'broadcast' ? 'bg-bg-elevated text-text-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:bg-bg-elevated/50 hover:text-text-primary'}`}
            title="System Broadcast"
          >
            <Radio className="w-5 h-5 md:w-4 md:h-4 shrink-0" /> <span className="hidden md:inline">System Broadcast</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Activity className="w-5 h-5 text-success-text" /> Telemetry Overview
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="glass-panel p-6 rounded-lg">
                  <div className="text-text-muted text-sm mb-2">Total App Installations</div>
                  <div className="text-4xl font-bold">{stats.total}</div>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <div className="text-text-muted text-sm mb-2">Currently Active (Allowed)</div>
                  <div className="text-4xl font-bold text-success-text">{stats.active}</div>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <div className="text-text-muted text-sm mb-2">Total Banned Nodes</div>
                  <div className="text-4xl font-bold text-error-text">{stats.banned}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4 text-text-secondary">OS Distribution</h3>
                  <div className="flex flex-col gap-4">
                    <div className="glass-panel p-4 md:p-6 rounded-lg flex items-center gap-4 hover-lift">
                      <Monitor className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="text-xl font-bold">{stats.win11}</div>
                        <div className="text-sm text-text-muted">Windows 11</div>
                      </div>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-lg flex items-center gap-4 hover-lift">
                      <Laptop className="w-8 h-8 text-blue-400" />
                      <div>
                        <div className="text-xl font-bold">{stats.win10}</div>
                        <div className="text-sm text-text-muted">Windows 10</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-text-secondary">Connected Nodes List</h3>
                  <div className="glass-panel rounded-lg overflow-hidden border border-border-subtle">
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-muted uppercase bg-bg-elevated sticky top-0 border-b border-border-subtle">
                          <tr>
                            <th className="px-4 py-3">HWID</th>
                            <th className="px-4 py-3">OS</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nodesList.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-text-muted">No nodes found.</td>
                            </tr>
                          ) : (
                            nodesList.map((node) => (
                              <tr key={node.hwid} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs">{node.hwid}</td>
                                <td className="px-4 py-3 text-text-secondary">{node.os || 'Unknown'}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                    node.status === 'active' ? 'bg-success-bg text-success-text' :
                                    node.status === 'banned' ? 'bg-error-bg text-error-text' :
                                    'bg-warning/10 text-warning'
                                  }`}>
                                    {node.status || 'Active'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 flex justify-end gap-2">
                                  <button 
                                    onClick={() => copyToClipboard(node.hwid)}
                                    className="p-1.5 bg-bg-surface border border-border-subtle rounded hover:bg-bg-elevated text-text-muted transition-colors"
                                    title="Copy HWID"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleManageNode(node.hwid)}
                                    className="p-1.5 bg-bg-surface border border-border-subtle rounded hover:bg-bg-elevated text-primary transition-colors flex items-center gap-1"
                                    title="Manage Node"
                                  >
                                    <Settings className="w-4 h-4" /> <span className="text-xs hidden sm:inline">Manage</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCESS CONTROL */}
          {activeTab === 'access' && (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Shield className="w-5 h-5 text-error-text" /> Hardware ID Targeting
              </h2>

              <div className="glass-panel p-6 rounded-lg mb-6">
                <label className="block text-sm text-text-muted mb-2">Target Node HWID</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      value={hwidSearch}
                      onChange={(e) => setHwidSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchHwid()}
                      placeholder="Paste HWID from screenshot..."
                      className="w-full bg-bg-surface border border-border-strong rounded px-10 py-2.5 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => handleSearchHwid()}
                    className="px-6 py-2.5 bg-bg-elevated hover:bg-bg-surface border border-border-strong rounded text-sm transition-colors shadow-sm font-medium"
                  >
                    Query
                  </button>
                </div>
              </div>

              {currentNodeState && (
                <div className="glass-panel rounded-lg overflow-hidden">
                  <div className="p-4 bg-bg-elevated border-b border-border-subtle flex items-center justify-between">
                    <span className="font-semibold text-text-primary">Target Resolution</span>
                    <span className="text-xs text-text-muted flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success-text animate-pulse"></span> Live Firebase Connection</span>
                  </div>
                  <div className="p-6">
                    {currentNodeState.status === 'not_found' ? (
                      <div className="text-warning flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> HWID not found in registry.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm bg-bg-elevated/50 p-4 rounded-md border border-border-subtle">
                          <div><span className="text-text-muted">Current Status:</span> <span className="font-bold text-text-primary uppercase ml-2">{currentNodeState.status}</span></div>
                          <div><span className="text-text-muted">OS Signature:</span> <span className="text-text-primary ml-2">{currentNodeState.os || 'Unknown'}</span></div>
                        </div>

                        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => handleUpdateNodeStatus('active')}
                            className="flex-1 py-3 bg-success-bg text-success-text border border-success-text/30 rounded hover:bg-success-text/20 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Set Active
                          </button>
                          <button 
                            onClick={() => handleUpdateNodeStatus('hold')}
                            className="flex-1 py-3 bg-warning/10 text-warning border border-warning/30 rounded hover:bg-warning/20 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <PauseCircle className="w-4 h-4" /> Place on Hold
                          </button>
                          <button 
                            onClick={() => handleUpdateNodeStatus('banned')}
                            className="flex-1 py-3 bg-error-bg text-error-text border border-error-text/30 rounded hover:bg-error-text/20 transition-colors flex items-center justify-center gap-2 font-medium btn-action-glow"
                          >
                            <Ban className="w-4 h-4" /> BAN NODE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {updateStatus && (
                <div className="mt-4 p-3 bg-primary/10 text-primary border border-primary/20 rounded text-sm text-center font-medium animate-fade-in">
                  {updateStatus}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-border-subtle flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" /> Global System Broadcast
              </h2>

              <div className="glass-panel rounded-lg p-6 space-y-6">
                
                <div>
                  <label className="block text-sm text-text-muted mb-2">Latest Required Version</label>
                  <input 
                    type="text" 
                    value={broadcastData.version}
                    onChange={(e) => setBroadcastData({...broadcastData, version: e.target.value})}
                    className="w-full bg-bg-surface border border-border-strong rounded px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-text-muted mt-2">Nodes running older versions will be prompted to update.</p>
                </div>

                <div className="pt-4 border-t border-border-subtle">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={broadcastData.maintenance}
                      onChange={(e) => setBroadcastData({...broadcastData, maintenance: e.target.checked})}
                      className="w-5 h-5 rounded border-border-strong bg-bg-surface checked:bg-primary focus:ring-0 focus:ring-offset-0 transition-colors"
                    />
                    <span className="font-medium">Enable Global Maintenance Mode</span>
                  </label>
                  <p className="text-xs text-text-muted mt-2 ml-8">Instantly locks all connected nodes with a maintenance screen.</p>
                </div>

                <div className="pt-4 border-t border-border-subtle">
                  <label className="block text-sm text-text-muted mb-2">Maintenance Message (Optional)</label>
                  <textarea 
                    value={broadcastData.message}
                    onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                    rows={3}
                    placeholder="We are currently upgrading the signaling server..."
                    className="w-full bg-bg-surface border border-border-strong rounded px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button 
                    onClick={handleUpdateBroadcast}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded text-sm transition-colors flex items-center gap-2 font-medium shadow-md"
                  >
                    <Save className="w-4 h-4" /> Transmit Broadcast
                  </button>
                  {updateStatus && <span className="text-sm text-success-text font-medium animate-fade-in">{updateStatus}</span>}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
