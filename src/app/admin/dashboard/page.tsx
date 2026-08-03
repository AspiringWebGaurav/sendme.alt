'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, database, ref, set, onValue, get } from '@/services/firebase';
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
  Terminal
} from 'lucide-react';

const ADMIN_EMAIL = 'gauravpatil9262@gmail.com';

type Tab = 'stats' | 'access' | 'broadcast';

export default function AdminDashboard() {
  const router = useRouter();
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

  useEffect(() => {
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

  // Load Stats
  useEffect(() => {
    if (isLoading) return;
    const nodesRef = ref(database, 'nodes');
    const unsub = onValue(nodesRef, (snapshot) => {
      if (snapshot.exists()) {
        const nodes = snapshot.val();
        let total = 0, win11 = 0, win10 = 0, active = 0, banned = 0, hold = 0;
        
        Object.values(nodes).forEach((node: any) => {
          total++;
          if (node.os?.includes('11')) win11++;
          if (node.os?.includes('10')) win10++;
          if (node.status === 'banned') banned++;
          else if (node.status === 'hold') hold++;
          else active++;
        });

        setStats({ total, win11, win10, active, banned, hold });
      }
    });
    return () => unsub();
  }, [isLoading]);

  const handleSearchHwid = async () => {
    if (!hwidSearch.trim()) return;
    try {
      const nodeRef = ref(database, `nodes/${hwidSearch}`);
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
    return <div className="min-h-screen bg-[#111111] flex items-center justify-center text-[#aaaaaa]">Initializing Secure Console...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-mono selection:bg-[#333] selection:text-white">
      
      {/* Topbar */}
      <div className="h-14 border-b border-[#222] bg-[#0F0F0F] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-gray-400" />
          <span className="font-semibold tracking-wide">SEND2ME // ADMIN CONSOLE</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="px-2 py-1 bg-[#1A1A1A] rounded border border-[#333]">{ADMIN_EMAIL}</span>
          <button onClick={handleLogout} className="hover:text-white transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Exit
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#222] bg-[#0F0F0F] p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all ${activeTab === 'stats' ? 'bg-[#222] text-white border border-[#333]' : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200'}`}
          >
            <Activity className="w-4 h-4" /> Active Nodes
          </button>
          <button 
            onClick={() => setActiveTab('access')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all ${activeTab === 'access' ? 'bg-[#222] text-white border border-[#333]' : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200'}`}
          >
            <Shield className="w-4 h-4" /> Access Control
          </button>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all ${activeTab === 'broadcast' ? 'bg-[#222] text-white border border-[#333]' : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200'}`}
          >
            <Radio className="w-4 h-4" /> System Broadcast
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-[#222] flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" /> Telemetry Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#141414] border border-[#222] p-6 rounded-lg">
                  <div className="text-gray-400 text-sm mb-2">Total App Installations</div>
                  <div className="text-4xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-[#141414] border border-[#222] p-6 rounded-lg">
                  <div className="text-gray-400 text-sm mb-2">Currently Active (Allowed)</div>
                  <div className="text-4xl font-bold text-green-500">{stats.active}</div>
                </div>
                <div className="bg-[#141414] border border-[#222] p-6 rounded-lg">
                  <div className="text-gray-400 text-sm mb-2">Total Banned Nodes</div>
                  <div className="text-4xl font-bold text-red-500">{stats.banned}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-gray-300">OS Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#141414] border border-[#222] p-6 rounded-lg flex items-center gap-4">
                  <Monitor className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-xl font-bold">{stats.win11}</div>
                    <div className="text-sm text-gray-400">Windows 11</div>
                  </div>
                </div>
                <div className="bg-[#141414] border border-[#222] p-6 rounded-lg flex items-center gap-4">
                  <Laptop className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-xl font-bold">{stats.win10}</div>
                    <div className="text-sm text-gray-400">Windows 10</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCESS CONTROL */}
          {activeTab === 'access' && (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-[#222] flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" /> Hardware ID Targeting
              </h2>

              <div className="bg-[#141414] border border-[#222] p-6 rounded-lg mb-6">
                <label className="block text-sm text-gray-400 mb-2">Target Node HWID</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="text" 
                      value={hwidSearch}
                      onChange={(e) => setHwidSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchHwid()}
                      placeholder="Paste HWID from screenshot..."
                      className="w-full bg-[#0A0A0A] border border-[#333] rounded px-10 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleSearchHwid}
                    className="px-6 py-2.5 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-sm transition-colors"
                  >
                    Query
                  </button>
                </div>
              </div>

              {currentNodeState && (
                <div className="bg-[#141414] border border-[#222] rounded-lg overflow-hidden">
                  <div className="p-4 bg-[#1A1A1A] border-b border-[#222] flex items-center justify-between">
                    <span className="font-semibold text-gray-200">Target Resolution</span>
                    <span className="text-xs text-gray-500">Live Firebase Connection</span>
                  </div>
                  <div className="p-6">
                    {currentNodeState.status === 'not_found' ? (
                      <div className="text-yellow-500 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> HWID not found in registry.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-gray-500">Current Status:</span> <span className="font-bold text-white uppercase">{currentNodeState.status}</span></div>
                          <div><span className="text-gray-500">OS Signature:</span> <span className="text-white">{currentNodeState.os || 'Unknown'}</span></div>
                        </div>

                        <div className="pt-6 border-t border-[#222] flex gap-4">
                          <button 
                            onClick={() => handleUpdateNodeStatus('active')}
                            className="flex-1 py-3 bg-green-500/10 text-green-500 border border-green-500/30 rounded hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Set Active
                          </button>
                          <button 
                            onClick={() => handleUpdateNodeStatus('hold')}
                            className="flex-1 py-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                          >
                            <PauseCircle className="w-4 h-4" /> Place on Hold
                          </button>
                          <button 
                            onClick={() => handleUpdateNodeStatus('banned')}
                            className="flex-1 py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
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
                <div className="mt-4 p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-sm text-center">
                  {updateStatus}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-[#222] flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-500" /> Global System Broadcast
              </h2>

              <div className="bg-[#141414] border border-[#222] rounded-lg p-6 space-y-6">
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Latest Required Version</label>
                  <input 
                    type="text" 
                    value={broadcastData.version}
                    onChange={(e) => setBroadcastData({...broadcastData, version: e.target.value})}
                    className="w-full bg-[#0A0A0A] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">Nodes running older versions will be prompted to update.</p>
                </div>

                <div className="pt-4 border-t border-[#222]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={broadcastData.maintenance}
                      onChange={(e) => setBroadcastData({...broadcastData, maintenance: e.target.checked})}
                      className="w-5 h-5 rounded border-[#444] bg-[#0A0A0A] checked:bg-purple-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="font-medium">Enable Global Maintenance Mode</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 ml-8">Instantly locks all connected nodes with a maintenance screen.</p>
                </div>

                <div className="pt-4 border-t border-[#222]">
                  <label className="block text-sm text-gray-400 mb-2">Maintenance Message (Optional)</label>
                  <textarea 
                    value={broadcastData.message}
                    onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                    rows={3}
                    placeholder="We are currently upgrading the signaling server..."
                    className="w-full bg-[#0A0A0A] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button 
                    onClick={handleUpdateBroadcast}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors flex items-center gap-2 font-medium"
                  >
                    <Save className="w-4 h-4" /> Transmit Broadcast
                  </button>
                  {updateStatus && <span className="text-sm text-green-400">{updateStatus}</span>}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
