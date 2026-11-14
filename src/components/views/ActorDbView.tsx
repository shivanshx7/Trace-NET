import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  KeyRound, 
  Wallet, 
  ChevronRight,
  X,
  UserCheck
} from 'lucide-react';
import { ThreatActor, InfrastructureItem, ActorLinkage } from '../../types';
import { GraphVisualization } from '../ui/GraphVisualization';
import { useToast } from '../ui/Toast';

interface ActorDbViewProps {
  actors?: ThreatActor[];
  infrastructure?: InfrastructureItem[];
  linkages?: ActorLinkage[];
  onSaveActor: (actor: ThreatActor) => void;
  onDeleteActor: (id: string) => void;
  onSaveInfrastructure: (item: InfrastructureItem) => void;
  onSaveLinkage: (linkage: ActorLinkage) => void;
}

export const ActorDbView: React.FC<ActorDbViewProps> = ({
  actors = [],
  infrastructure = [],
  linkages = [],
  onSaveActor,
  onDeleteActor,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'table' | 'graph'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(actors?.[0] || null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingActor, setEditingActor] = useState<Partial<ThreatActor> | null>(null);

  // Filtered actors
  const filteredActors = actors.filter(act => {
    const matchesSearch = act.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.realNameCandidate && act.realNameCandidate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      act.pgpKey.fingerprint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.wallets.some(w => w.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === 'ALL' || act.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingActor({
      id: `act-${Date.now().toString().slice(-4)}`,
      handle: '',
      realNameCandidate: '',
      category: 'Darknet Market',
      confidenceScore: 75,
      confidenceBreakdown: {
        serverStatus: 70,
        sslCertLeak: 70,
        bannerHash: 70,
        keyReuse: 70,
        clearnetDeps: 70,
        descriptorOverlap: 70,
        timingCorrelation: 70
      },
      lastSeen: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      status: 'ACTIVE',
      locationCandidate: 'Unknown',
      timezoneEstimate: 'UTC+0',
      notes: '',
      pgpKey: {
        fingerprint: '1029 4810 2948 1029 4810  2948 1029 4810 2948 0001',
        keyId: '0x10290001',
        created: '2026-01-01',
        email: 'operator@onion.me'
      },
      wallets: [
        { currency: 'BTC', address: 'bc1q' + Math.random().toString(36).slice(2, 14), totalBalance: '10.5 BTC', txCount: 120 }
      ],
      infrastructureIds: [],
      identifiers: [],
      mitreAttacks: ['T1584.004', 'T1592.002']
    });
    setIsAddModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActor?.handle) {
      showToast('error', 'Validation Error', 'Actor name is required');
      return;
    }

    onSaveActor(editingActor as ThreatActor);
    showToast('success', 'Profile Saved', `Profile for ${editingActor.handle} updated.`);
    setIsAddModalOpen(false);
    setEditingActor(null);
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="p-6 rounded-2xl bg-[#111317] border border-white/[0.08] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#FF3E11]" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Actor Dossiers &amp; Forensics
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1 max-w-2xl leading-relaxed">
            Database of profiled operators, cryptocurrency wallets, PGP fingerprints, server clues, and match strength ratings.
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full p-1 text-xs">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'table' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              Profiles ({actors.length})
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'graph' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              Visual Connections
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF3E11] hover:bg-[#FF3E11]/90 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-[#FF3E11]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Profile</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Profiles List & Details Split View */}
      {activeTab === 'table' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Actor Filter & List Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name, real ID, PGP, wallet..."
                  className="w-full bg-[#111317] border border-white/[0.08] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-[#111317] border border-white/[0.08] rounded-full px-4 py-2 text-xs text-white focus:outline-none"
              >
                <option value="ALL" className="bg-[#111317]">All Categories</option>
                <option value="Darknet Market" className="bg-[#111317]">Darknet Market</option>
                <option value="Ransomware" className="bg-[#111317]">Ransomware</option>
                <option value="Financial Crime" className="bg-[#111317]">Financial Crime</option>
                <option value="Phishing / Initial Access" className="bg-[#111317]">Phishing / Initial Access</option>
              </select>
            </div>

            {/* Actors List */}
            <div className="rounded-2xl bg-[#111317] border border-white/[0.08] backdrop-blur-md overflow-hidden shadow-xl">
              <div className="divide-y divide-white/[0.06]">
                {filteredActors.map(actor => {
                  const isSelected = selectedActor?.id === actor.id;
                  return (
                    <div
                      key={actor.id}
                      onClick={() => setSelectedActor(actor)}
                      className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                        isSelected ? 'bg-white/[0.05] border-l-4 border-[#FF3E11]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white font-mono">{actor.handle}</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase bg-white/[0.06] text-white/70 border border-white/[0.08]">
                            {actor.category}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                            actor.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/50'
                          }`}>
                            {actor.status}
                          </span>
                        </div>
                        <div className="text-xs text-white/50 flex items-center gap-3">
                          <span>Real ID: <strong className="text-white/80 font-medium">{actor.realNameCandidate || 'Unknown'}</strong></span>
                          <span>&bull;</span>
                          <span>Location: <strong className="text-white/80 font-medium">{actor.locationCandidate}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono">
                        <div className="text-right">
                          <div className="text-xs font-bold text-white bg-white/[0.08] border border-white/[0.1] px-2.5 py-0.5 rounded-full">{actor.confidenceScore}% Match</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mt-0.5">Confidence</div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#FF3E11] translate-x-1' : 'text-white/30'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Selected Actor Details Card */}
          {selectedActor ? (
            <div className="p-6 rounded-2xl bg-[#111317] border border-white/[0.08] backdrop-blur-md space-y-4 text-xs shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{selectedActor.handle}</h2>
                  <div className="text-[11px] text-white/40 font-mono">ID: {selectedActor.id}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingActor(selectedActor);
                      setIsAddModalOpen(true);
                    }}
                    className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete profile for ${selectedActor.handle}?`)) {
                        onDeleteActor(selectedActor.id);
                        setSelectedActor(actors[0] || null);
                        showToast('info', 'Profile Deleted', selectedActor.handle);
                      }
                    }}
                    className="p-2 rounded-full bg-[#FF3E11]/15 hover:bg-[#FF3E11]/25 text-[#FF3E11] transition-all"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Match Strength Bar */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/80 font-bold uppercase tracking-wider">Match Strength:</span>
                  <span className="font-bold text-white text-sm">{selectedActor.confidenceScore}%</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${selectedActor.confidenceScore}%` }}
                  />
                </div>
              </div>

              {/* Identity & Candidate Details */}
              <div className="space-y-2">
                <div className="text-white font-bold text-xs uppercase tracking-wider">[+] Identity Clues:</div>
                <div className="p-3.5 rounded-xl bg-black/20 border border-white/15 space-y-2 text-white/90">
                  <div>Candidate Name: <strong className="text-white font-bold">{selectedActor.realNameCandidate || 'Under Investigation'}</strong></div>
                  <div>Estimated Timezone: <span className="text-white font-mono">{selectedActor.timezoneEstimate}</span></div>
                  <div>Probable Location: <span className="text-white">{selectedActor.locationCandidate}</span></div>
                  <div>Last Active: <span className="text-white/70 text-[11px] font-mono">{selectedActor.lastSeen}</span></div>
                </div>
              </div>

              {/* PGP Public Key */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-bold text-xs uppercase tracking-wider">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>PGP Public Key:</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/20 border border-white/15 space-y-1 select-all">
                  <div className="text-white font-mono text-[11px] break-all">{selectedActor.pgpKey.fingerprint}</div>
                  <div className="text-[11px] text-white/70 font-mono">Key ID: {selectedActor.pgpKey.keyId} &bull; Email: {selectedActor.pgpKey.email}</div>
                </div>
              </div>

              {/* Wallets */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-bold text-xs uppercase tracking-wider">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Cryptocurrency Wallets:</span>
                </div>
                <div className="space-y-1.5">
                  {selectedActor.wallets.map((w, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/15 select-all space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{w.currency}</span>
                        <span className="text-white font-mono font-bold bg-[#1E262C] px-2 py-0.5 rounded-full text-[10px]">{w.totalBalance}</span>
                      </div>
                      <div className="text-[11px] font-mono text-white/80 break-all">{w.address}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedActor.notes && (
                <div className="p-3.5 rounded-xl bg-black/20 border border-white/15 text-[11px] text-white/80 leading-relaxed">
                  <strong className="text-white">Case Notes: </strong> {selectedActor.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-black/15 border border-white/20 text-white/80 text-xs">
              Select a profile to view full investigative details.
            </div>
          )}
        </div>
      )}

      {/* Main Tab 2: Interactive Graph Visualization */}
      {activeTab === 'graph' && (
        <div className="h-[620px] rounded-2xl overflow-hidden border border-white/20 shadow-lg">
          <GraphVisualization
            actors={actors}
            infrastructure={infrastructure}
            linkages={linkages}
            onSelectActor={act => setSelectedActor(act)}
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && editingActor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#1E262C] border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4 text-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-white" />
                <h2 className="font-bold text-base text-white">
                  {editingActor.id ? 'Edit Profile' : 'New Profile'}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Handle / Name *</label>
                  <input
                    type="text"
                    required
                    value={editingActor.handle || ''}
                    onChange={e => setEditingActor({ ...editingActor, handle: e.target.value })}
                    placeholder="e.g. DarkVendor"
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Real Name Candidate</label>
                  <input
                    type="text"
                    value={editingActor.realNameCandidate || ''}
                    onChange={e => setEditingActor({ ...editingActor, realNameCandidate: e.target.value })}
                    placeholder="e.g. Dmitry V."
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Category</label>
                  <select
                    value={editingActor.category}
                    onChange={e => setEditingActor({ ...editingActor, category: e.target.value as any })}
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Darknet Market" className="bg-[#1E262C]">Darknet Market</option>
                    <option value="Ransomware" className="bg-[#1E262C]">Ransomware</option>
                    <option value="Financial Crime" className="bg-[#1E262C]">Financial Crime</option>
                    <option value="Phishing / Initial Access" className="bg-[#1E262C]">Phishing / Initial Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Location Candidate</label>
                  <input
                    type="text"
                    value={editingActor.locationCandidate || ''}
                    onChange={e => setEditingActor({ ...editingActor, locationCandidate: e.target.value })}
                    placeholder="e.g. Frankfurt, Germany"
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Match Strength (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingActor.confidenceScore || 50}
                    onChange={e => setEditingActor({ ...editingActor, confidenceScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-1 font-semibold">Timezone Estimate</label>
                  <input
                    type="text"
                    value={editingActor.timezoneEstimate || ''}
                    onChange={e => setEditingActor({ ...editingActor, timezoneEstimate: e.target.value })}
                    placeholder="e.g. UTC+2"
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-semibold">Case Notes</label>
                <textarea
                  rows={3}
                  value={editingActor.notes || ''}
                  onChange={e => setEditingActor({ ...editingActor, notes: e.target.value })}
                  placeholder="Summary of findings and server clues..."
                  className="w-full bg-black/30 border border-white/20 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

