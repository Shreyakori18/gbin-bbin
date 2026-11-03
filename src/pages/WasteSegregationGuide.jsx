import React, { useState } from 'react';
import {
  Leaf,
  Recycle,
  Check,
  X,
  Search,
  Sparkles
} from 'lucide-react';

const WASTE_ITEMS_DATABASE = [
  // G-Bin Items (Wet / Biodegradable)
  { id: '1', name: 'Vegetable Peels & Trimmings', category: 'gbin', icon: '🥕', tips: 'Can be deposited directly or in compostable bio-bags.' },
  { id: '2', name: 'Fruit Rinds & Seeds', category: 'gbin', icon: '🍉', tips: 'Watermelon, melon, citrus, banana peels degrade rapidly.' },
  { id: '3', name: 'Leftover Cooked Food & Rice', category: 'gbin', icon: '🍛', tips: 'Drain excess gravy before putting into G-Bin to minimize leachate.' },
  { id: '4', name: 'Tea Bags & Coffee Grounds', category: 'gbin', icon: '☕', tips: 'Ensure plastic/nylon tags and staples are removed from tea bags.' },
  { id: '5', name: 'Garden Leaves & Dried Plants', category: 'gbin', icon: '🍂', tips: 'Ideal carbon balance material for municipal composting.' },
  { id: '6', name: 'Egg Shells & Nut Shells', category: 'gbin', icon: '🥚', tips: 'Crush egg shells to help them break down into calcium-rich soil.' },
  { id: '7', name: 'Bread, Bakery, & Roti Scraps', category: 'gbin', icon: '🍞', tips: 'Safe for organic aerobic decomposition.' },
  { id: '8', name: 'Used Coconut Shells (Small)', category: 'gbin', icon: '🥥', tips: 'Organic fiber; chopped shells decompose within standard cycles.' },

  // B-Bin Items (Dry / Recyclable)
  { id: '9', name: 'Newspapers, Magazines & Books', category: 'bbin', icon: '📰', tips: 'Keep dry and flat. Wet newsprint cannot be fed into pulpers.' },
  { id: '10', name: 'Cardboard & Delivery Boxes', category: 'bbin', icon: '📦', tips: 'Flatten boxes to save bin space; remove adhesive plastic tapes.' },
  { id: '11', name: 'Plastic Bottles (PET 1 & HDPE 2)', category: 'bbin', icon: '🧴', tips: 'Rinse with clean water, compress, and replace the cap.' },
  { id: '12', name: 'Aluminum Cans & Beverage Tins', category: 'bbin', icon: '🥫', tips: '100% recyclable indefinitely. Crush lightly to conserve volume.' },
  { id: '13', name: 'Glass Bottles & Food Jars', category: 'bbin', icon: '🫙', tips: 'Rinse clean. Avoid broken shards whenever possible for worker safety.' },
  { id: '14', name: 'Milk & Juice Cartons (Tetra Pak)', category: 'bbin', icon: '🧃', tips: 'Rinse clean and flatten. Poly-aluminum layer is extracted at MRF.' },
  { id: '15', name: 'Metal Bottle Caps & Foil Containers', category: 'bbin', icon: '🥣', tips: 'Clean off food remnants before putting in B-Bin.' },
  { id: '16', name: 'Clean Paper Bags & Packaging Envelopes', category: 'bbin', icon: '🛍️', tips: 'Remove plastic bubble linings before disposal.' }
];

export const WasteSegregationGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Interactive segregation quiz/game state
  const [quizItemIndex, setQuizItemIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizQuestions = [
    { name: 'Banana & Orange Peels', correct: 'gbin', explanation: 'Organic wet waste belongs in the G-Bin for composting.' },
    { name: 'Empty Shampoo Plastic Bottle', correct: 'bbin', explanation: 'Rigid recyclable plastics belong in the B-Bin after a quick rinse.' },
    { name: 'Used Tea Leaves & Coffee Grounds', correct: 'gbin', explanation: 'Rich organic matter that enriches garden soil in G-Bin.' },
    { name: 'Amazon Cardboard Delivery Box', correct: 'bbin', explanation: 'Clean cardboard is prime paper pulp material for B-Bin.' },
    { name: 'Leftover Dal and Rice', correct: 'gbin', explanation: 'All leftover cooked kitchen food belongs in the G-Bin.' },
    { name: 'Empty Soda Can (Aluminium)', correct: 'bbin', explanation: 'Metals are completely recyclable and go straight to the B-Bin.' }
  ];

  const handleQuizAnswer = (chosenBin) => {
    const currentQ = quizQuestions[quizItemIndex];
    if (chosenBin === currentQ.correct) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback({ correct: true, text: `Correct! ${currentQ.explanation}` });
    } else {
      setQuizFeedback({
        correct: false,
        text: `Incorrect. This belongs in the ${currentQ.correct === 'gbin' ? 'G-Bin (Green)' : 'B-Bin (Blue)'}. ${currentQ.explanation}`
      });
    }

    setTimeout(() => {
      if (quizItemIndex + 1 < quizQuestions.length) {
        setQuizItemIndex(prev => prev + 1);
        setQuizFeedback(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1800);
  };

  const restartQuiz = () => {
    setQuizItemIndex(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizCompleted(false);
  };

  const filteredItems = WASTE_ITEMS_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tips.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilter === 'all' || item.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: '#047857', marginBottom: '1rem' }}>
          <Sparkles size={16} /> Official Educational Guide
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Household Waste Segregation Guide
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.6 }}>
          Learn exactly what goes into your <strong>Green G-Bin</strong> and <strong>Blue B-Bin</strong>. Proper segregation at home ensures nothing valuable is lost to landfills.
        </p>
      </div>

      {/* Side-by-side G-Bin vs B-Bin Guidelines Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        {/* G-BIN Card */}
        <div className="card card-gbin" style={{ background: '#fcfdfd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--gbin-primary)', color: 'white', padding: '0.65rem', borderRadius: '10px' }}>
              <Leaf size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gbin-dark)' }}>
                G-Bin (Green Bin)
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>Biodegradable & Wet Waste</span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Wet waste refers to all kitchen and garden waste that naturally decomposes into humus and compost. Keep liquids drained before disposal.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#047857', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={18} color="#10b981" /> What Goes Into G-Bin:
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Fruit & vegetable trimmings, peels & seeds</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Leftover cooked food, breads, roti & gravies</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Egg shells, nut shells & coffee grounds</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Garden leaves, twigs, cut flowers & soil plants</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Soiled paper napkins used during meal eating</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <X size={16} /> Never Put in G-Bin:
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Plastic bags, milk packets, medicine strips, glass, foil wrappers, diapers or sanitary pads.
            </p>
          </div>
        </div>

        {/* B-BIN Card */}
        <div className="card card-bbin" style={{ background: '#fcfdfd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--bbin-primary)', color: 'white', padding: '0.65rem', borderRadius: '10px' }}>
              <Recycle size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--bbin-dark)' }}>
                B-Bin (Blue Bin)
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>Dry & Recyclable Waste</span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Dry waste includes recyclable items that do not decay naturally. Always ensure items are dry and rinsed to prevent contamination of paper.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0369a1', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Check size={18} color="#0284c7" /> What Goes Into B-Bin:
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Newspapers, office papers, notebooks, brochures</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Cardboard boxes, carton packaging, egg crates</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Clean plastic bottles, tubs, containers & jars</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Milk and beverage cartons (rinsed clean)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Beverage cans, metal tins & bottle caps</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>• Clean glass bottles and glass food jars</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <X size={16} /> Never Put in B-Bin:
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Wet kitchen gravy, medical syringes/bandages, wet organic waste, chemical paints or hazardous light bulbs.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Segregation Quiz Mini-Game */}
      <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '2rem', marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Interactive Waste Sorter Challenge
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Test your segregation skills! Where would you deposit the item shown below?
          </p>
        </div>

        {!quizCompleted ? (
          <div style={{ maxWidth: '520px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Question {quizItemIndex + 1} of {quizQuestions.length}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
              "{quizQuestions[quizItemIndex].name}"
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => handleQuizAnswer('gbin')}
                className="btn btn-gbin"
                style={{ flex: 1, padding: '0.75rem' }}
                disabled={Boolean(quizFeedback)}
                id="quiz-gbin-btn"
              >
                <Leaf size={18} /> G-Bin (Green)
              </button>
              <button
                onClick={() => handleQuizAnswer('bbin')}
                className="btn btn-bbin"
                style={{ flex: 1, padding: '0.75rem' }}
                disabled={Boolean(quizFeedback)}
                id="quiz-bbin-btn"
              >
                <Recycle size={18} /> B-Bin (Blue)
              </button>
            </div>

            {quizFeedback && (
              <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, background: quizFeedback.correct ? '#ecfdf5' : '#fef2f2', color: quizFeedback.correct ? '#065f46' : '#991b1b' }}>
                {quizFeedback.text}
              </div>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '480px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857', marginBottom: '0.5rem' }}>Challenge Complete!</h4>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#1e293b' }}>
              You scored <strong>{quizScore} out of {quizQuestions.length}</strong>!
            </p>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
              {quizScore === quizQuestions.length ? 'Outstanding! You are a master of waste segregation.' : 'Great job! Keep reviewing the guide to reach 100% accuracy.'}
            </p>
            <button onClick={restartQuiz} className="btn btn-outline btn-sm">
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Searchable Waste Directory */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Searchable Household Item Directory</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Quick lookup of everyday household items and disposal advice</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search item (e.g. egg, bottle)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', width: '240px', fontSize: '0.85rem' }}
                id="waste-search-input"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
            >
              <option value="all">All Bins</option>
              <option value="gbin">G-Bin (Wet Waste)</option>
              <option value="bbin">B-Bin (Dry Waste)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="card"
              style={{
                borderLeft: `5px solid ${item.category === 'gbin' ? 'var(--gbin-primary)' : 'var(--bbin-primary)'}`,
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                <span className={`status-badge ${item.category === 'gbin' ? 'badge-completed' : 'badge-in-progress'}`}>
                  {item.category === 'gbin' ? 'G-Bin (Wet)' : 'B-Bin (Dry)'}
                </span>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem', color: '#1e293b' }}>
                {item.name}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                {item.tips}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental & Recycling Impact Section */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
          Environmental Dividends of Segregation
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>17 Trees</div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Saved for every 1 ton of segregated paper recycled from B-Bins.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.25rem' }}>95% Less Energy</div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Required to manufacture new aluminium cans from recycled metal than from raw bauxite ore.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', marginBottom: '0.25rem' }}>70% Methane Cut</div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Reduction in greenhouse emissions by diverting organic kitchen waste from open dumps into compost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
