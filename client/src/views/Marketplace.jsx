import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Filter, DollarSign, Clock, Star, ExternalLink, ShieldCheck, Plus, Check, Scale, AlertTriangle } from 'lucide-react';

export default function Marketplace() {
  const { gigs, orders, currentUser, studentProfile, handleCreateGig, handleHireStudent, refreshAllData } = useContext(AppContext);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGig, setSelectedGig] = useState(null);
  
  // Gig creation form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPricing, setNewPricing] = useState('');
  const [newDelivery, setNewDelivery] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newTags, setNewTags] = useState('');

  // Dispute & Jury states
  const [showDisputeModal, setShowDisputeModal] = useState(null);
  const [disputeReason, setDisputeReason] = useState('Deliverables did not meet the agreed specifications.');
  const [proofText, setProofText] = useState('I built all features in the contract milestone, but buyer failed to release escrow.');
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState(null);
  const [juryPhase, setJuryPhase] = useState(0); // 0 = ready, 1 = deliberating, 2 = resolved
  const [juryLog, setJuryLog] = useState([]);

  const submitDispute = async (orderId) => {
    try {
      const res = await fetch(`/api/v1/marketplace/orders/${orderId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: disputeReason, proofText: proofText })
      });
      if (res.ok) {
        alert("🔒 Escrow Locked. Case submitted to the AI Arbitration Jury.");
        setShowDisputeModal(null);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const runArbitrationJury = async (orderId) => {
    setJuryPhase(1);
    setJuryLog(['Jury Assembling: summoning Dr. Marcus Vance, Sarah K. and complianceBot...', 'Inspecting contract ledger...', 'Reading student work proofs...']);
    
    await new Promise(r => setTimeout(r, 1000));
    setJuryLog(prev => [...prev, 'Dr. Marcus Vance (CS Mentor): "Analyzing code layout... 90% correct."']);
    
    await new Promise(r => setTimeout(r, 1000));
    setJuryLog(prev => [...prev, 'Sarah K. (Google Alumni): "Checking usability... 80% matches UX standard."']);
    
    await new Promise(r => setTimeout(r, 1000));
    setJuryLog(prev => [...prev, 'complianceBot (AI Audit): "Verifying deadline timeline... 100% compliant."']);
    
    try {
      const res = await fetch(`/api/v1/marketplace/orders/${orderId}/arbitrate`, { method: 'POST' });
      if (res.ok) {
        setJuryPhase(2);
        refreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Web Development', 'UI/UX', 'Graphic Design', 'AI/ML', 'Content Writing'];

  const filteredGigs = gigs.filter(gig => {
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gig.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOrderSubmit = async (gigId) => {
    const success = await handleHireStudent(gigId);
    if (success) {
      alert("🎉 Service Contract Initiated! Payment held in escrow. Check your notifications.");
      setSelectedGig(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newPricing || !newDelivery) {
      alert("Please fill out all fields.");
      return;
    }
    const tagsArr = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const success = await handleCreateGig({
      title: newTitle,
      description: newDesc,
      pricing: Number(newPricing),
      deliveryTime: Number(newDelivery),
      category: newCategory,
      tags: tagsArr
    });

    if (success) {
      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewPricing('');
      setNewDelivery('');
      setNewTags('');
      alert("🚀 Service listed successfully in the Campus Marketplace!");
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      const res = await fetch(`/api/v1/marketplace/orders/${orderId}/submit`, { method: 'POST' });
      if (res.ok) {
        alert("📁 Project files submitted to client for approval.");
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const res = await fetch(`/api/v1/marketplace/orders/${orderId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 5, comment: 'Fantastic deliverable! Handled task optimization exceptionally.' })
      });
      if (res.ok) {
        alert("💰 ESCROW RELEASED: Funds successfully credited to Student wallet!");
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Skill Marketplace</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Hire verified student freelancers or offer your own skills for peer-to-peer economic gigs.</p>
        </div>
        
        {currentUser.role === 'student' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white text-sm font-semibold hover:glow-purple transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Post a Skill Service
          </button>
        )}
      </div>

      {/* Categories & Search Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? 'bg-primary text-white border-primary glow-purple' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search skills, gigs, developers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-primary transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Marketplace listings grid */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Active Service Offerings ({filteredGigs.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGigs.map((gig, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedGig(gig)}
                className="glass-card glass-card-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between h-[250px] relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase font-bold text-secondary tracking-wider bg-secondary/15 border border-secondary/20 px-2 py-0.5 rounded">
                      {gig.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                      <Star size={12} fill="currentColor" />
                      <span className="font-semibold">{gig.rating}</span>
                      <span className="text-zinc-500">({gig.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-md font-bold text-white mt-3 group-hover:text-primary transition-all line-clamp-2">
                    {gig.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {gig.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={gig.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'} 
                      alt="" 
                      className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                    />
                    <span className="text-[10px] text-zinc-400 font-semibold">{gig.studentName}</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-zinc-500">Starts at</span>
                    <p className="text-sm font-bold text-success">${gig.pricing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Gigs & Escrow Manager */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>My Contracts & Escrow</span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-semibold">
                {orders.length} active
              </span>
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs leading-relaxed">
                No active contracts. Hire a student or accept client work to see details here.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord, idx) => {
                  const isStudentWork = ord.studentId === 'stud-1'; // alex chen
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ord.status === 'completed' ? 'bg-success/20 text-success border border-success/30' :
                          ord.status === 'submitted' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                          ord.status === 'disputed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          ord.status === 'resolved' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          'bg-primary/20 text-primary border border-primary/30'
                        }`}>
                          {ord.status}
                        </span>
                        <span className="text-xs font-bold text-success">${ord.amount}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-1">{ord.title}</h4>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>{isStudentWork ? `Client: ${ord.buyerName}` : 'Student Job'}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {new Date(ord.timelineDeadline).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Interactive work state flows */}
                      <div className="border-t border-zinc-800/80 pt-2 flex flex-col gap-2">
                        {isStudentWork && ord.status === 'in_progress' && (
                          <button
                            onClick={() => handleDeliver(ord.id)}
                            className="w-full py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 hover:bg-zinc-800 transition-all"
                          >
                            Submit Deliverables
                          </button>
                        )}
                        
                        {!isStudentWork && ord.status === 'submitted' && (
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => handleAccept(ord.id)}
                              className="flex-1 py-1.5 rounded-lg bg-success hover:bg-success-hover text-[10px] font-bold text-white transition-all"
                            >
                              Accept & Release
                            </button>
                            <button
                              onClick={() => {
                                setShowDisputeModal(ord);
                                setDisputeReason('Substandard deliverables or incomplete milestones.');
                                setProofText('The UI is bugged and does not run correctly.');
                              }}
                              className="py-1.5 px-2.5 rounded-lg bg-red-950 border border-red-900/50 hover:bg-red-900/35 text-[10px] font-bold text-red-400 transition-all flex items-center justify-center"
                            >
                              <AlertTriangle size={10} />
                            </button>
                          </div>
                        )}

                        {ord.status === 'disputed' && (
                          <button
                            onClick={() => {
                              setSelectedDisputeOrder(ord);
                              setJuryPhase(0);
                              setJuryLog([]);
                            }}
                            className="w-full py-1.5 rounded-lg bg-red-500 hover:bg-red-650 text-[10px] font-bold text-white transition-all flex items-center justify-center gap-1.5"
                          >
                            <Scale size={10} />
                            Enter Jury Room
                          </button>
                        )}

                        {ord.status === 'resolved' && (
                          <button
                            onClick={() => {
                              setSelectedDisputeOrder(ord);
                              setJuryPhase(2);
                            }}
                            className="w-full py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-[10px] font-bold text-cyan-400 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Scale size={10} />
                            View Verdict
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* GIG PREVIEW MODAL */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-xl rounded-2xl p-6 relative overflow-hidden animate-zoomIn">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-secondary/20 text-secondary border border-secondary/30">
                  {selectedGig.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 leading-snug">{selectedGig.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedGig(null)}
                className="text-zinc-500 hover:text-white font-bold text-lg p-1"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-300 leading-relaxed">
              {selectedGig.description}
            </div>

            {/* Seller profile snippet */}
            <div className="mt-4 flex items-center gap-3">
              <img 
                src={selectedGig.studentAvatar} 
                alt="" 
                className="w-10 h-10 rounded-full object-cover border border-zinc-800"
              />
              <div>
                <h4 className="text-xs font-bold text-white">{selectedGig.studentName}</h4>
                <div className="flex items-center gap-1 text-[10px] text-yellow-500">
                  <Star size={10} fill="currentColor" /> {selectedGig.rating} Verified Seller
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedGig.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Escrow assurance */}
            <div className="mt-6 p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-[10px] text-zinc-400">
              <ShieldCheck size={16} className="text-primary" />
              <span>Payments held securely by University Escrow and only released on project completion.</span>
            </div>

            {/* Modal actions */}
            <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
              <div>
                <span className="text-[10px] text-zinc-500">Investment Cost</span>
                <p className="text-lg font-extrabold text-success">${selectedGig.pricing}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedGig(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleOrderSubmit(selectedGig.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:glow-purple text-white text-xs font-semibold transition-all"
                >
                  Order Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SERVICE GIG MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateSubmit}
            className="glass-card w-full max-w-lg rounded-2xl p-6 relative overflow-hidden animate-zoomIn space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create a Skill Service Offering</h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Service Title</label>
              <input
                type="text"
                placeholder="e.g. I will build an API gateway script in FastAPI"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500 block">Service Description</label>
              <textarea
                placeholder="Describe your portfolio deliverables in details..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all resize-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Pricing ($ USD)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={newPricing}
                  onChange={(e) => setNewPricing(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Delivery Time (Days)</label>
                <input
                  type="number"
                  placeholder="3"
                  value={newDelivery}
                  onChange={(e) => setNewDelivery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-primary transition-all"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Content Writing">Content Writing</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Keywords / Tags</label>
                <input
                  type="text"
                  placeholder="React, API, Wireframes"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:glow-purple text-white text-xs font-semibold transition-all"
              >
                Publish Gig
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ESCROW DISPUTE FORM MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 relative overflow-hidden animate-zoomIn border border-red-900/40">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={18} />
              <span>Raise Escrow Dispute</span>
            </h3>
            <p className="text-zinc-400 text-xs mt-1">This will lock order funds in escrow and request AI Jury Arbitration.</p>

            <div className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Dispute Claim / Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
                >
                  <option value="Deliverables do not meet the agreed specifications.">Substandard deliverables</option>
                  <option value="Student missed the contractual timeline.">Missed milestone deadline</option>
                  <option value="Code does not run and compiles with critical errors.">Non-functional deliverables</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500 block">Your Proof / Supporting Statement</label>
                <textarea
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Explain why the deliverables are rejected..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800/80 pt-4">
              <button
                onClick={() => setShowDisputeModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-855 animate-all"
              >
                Cancel
              </button>
              <button
                onClick={() => submitDispute(showDisputeModal.id)}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-650 text-white text-xs font-semibold"
              >
                File Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ARBITRATION JURY COURTROOM MODAL */}
      {selectedDisputeOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-3xl rounded-2xl p-6 relative overflow-hidden animate-zoomIn border border-zinc-800 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
            
            {/* Left side: Case specs */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  Case ID: #{selectedDisputeOrder.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 leading-snug">{selectedDisputeOrder.title}</h3>
                <p className="text-[10px] text-zinc-500">Escrow Value locked: <strong className="text-success">${selectedDisputeOrder.amount}</strong></p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">Dispute Reason</span>
                  <p className="text-xs text-red-300 font-semibold">{selectedDisputeOrder.disputeReason || disputeReason}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">Client Proof Submission</span>
                  <p className="text-xs text-zinc-400 leading-relaxed italic">"{selectedDisputeOrder.proofText || proofText}"</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-900">
                <button
                  onClick={() => setSelectedDisputeOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  Exit Courtroom
                </button>
              </div>
            </div>

            {/* Right side: Jury timeline or results */}
            <div className="flex-1 bg-zinc-955/60 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between min-h-[350px]">
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Scale size={16} className="text-red-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">AI Arbitration Board</span>
                </div>

                {juryPhase === 0 && (
                  <div className="space-y-4 text-center py-10 animate-fadeIn">
                    <p className="text-xs text-zinc-450 leading-relaxed">
                      Summons the peer mentor, alumni panelist, and legal bot to arbitrate the dispute.
                    </p>
                    <button
                      onClick={() => runArbitrationJury(selectedDisputeOrder.id)}
                      className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-lg shadow-red-500/10"
                    >
                      Assemble Jury Panel
                    </button>
                  </div>
                )}

                {juryPhase === 1 && (
                  <div className="space-y-3 font-mono animate-fadeIn">
                    <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Live Deliberation Log</span>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {juryLog.map((log, i) => (
                        <div key={i} className="text-[10px] text-zinc-400 p-2 rounded bg-zinc-950 border border-zinc-900 leading-relaxed">
                          ⚡ {log}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-red-400 py-2 animate-pulse">
                      <RefreshCw className="animate-spin" size={10} />
                      <span>Jury voting in progress...</span>
                    </div>
                  </div>
                )}

                {juryPhase === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-3 bg-cyan-950/20 border border-cyan-900/50 rounded-xl">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Jury Verdict</span>
                      <p className="text-xs text-white font-semibold mt-1">
                        {selectedDisputeOrder.verdict || "Jury split verdict: Student awarded 90%, Client refunded 10%."}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider block border-b border-zinc-900 pb-1">Juror Breakdown</span>
                    <div className="space-y-3">
                      {(selectedDisputeOrder.deliberationLog || [
                        { speaker: 'Dr. Marcus Vance (CS Mentor)', vote: 90, comment: 'Code structure is sound and matches milestone specs. Recommend 90% payout.' },
                        { speaker: 'Sarah K. (Google Alumni)', vote: 80, comment: 'UX layout matches Figma designs, but there are a few styling errors. Payout 80% to student.' },
                        { speaker: 'AI complianceBot', vote: 100, comment: 'Ledger indicates files submitted before deadline. Recommend 100% payout.' }
                      ]).map((j, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 text-[11px]">
                          <div className="flex justify-between font-bold text-[10px]">
                            <span className="text-zinc-300">{j.speaker}</span>
                            <span className="text-success">{j.vote}% Payout</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed italic">"{j.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
