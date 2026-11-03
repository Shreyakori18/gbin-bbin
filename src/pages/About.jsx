import React from 'react';
import { Leaf, Recycle, ShieldCheck, Target, HeartHandshake, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="container">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, color: '#047857', marginBottom: '1rem' }}>
          Sustainable Urban Sanitation
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          About the <span style={{ color: '#10b981' }}>G-Bin</span> & <span style={{ color: '#0284c7' }}>B-Bin</span> Initiative
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
          Transforming urban waste management through household-level segregation, structured collection routes, and data-driven circular economy practices.
        </p>
      </div>

      {/* Mission & Vision */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        <div className="card card-gbin">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#ecfdf5', padding: '0.65rem', borderRadius: '10px', color: '#10b981' }}>
              <Target size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Our Mission</h2>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
            To achieve 100% source-level segregation of domestic solid waste across every municipal ward. By providing standardized Green (biodegradable) and Blue (recyclable) bins alongside scheduled collections, we divert tons of organic materials to bio-composting facilities and recover valuable plastics and papers for zero-landfill operations.
          </p>
        </div>

        <div className="card card-bbin">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f0f9ff', padding: '0.65rem', borderRadius: '10px', color: '#0284c7' }}>
              <ShieldCheck size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Our Vision</h2>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
            To pioneer a transparent, smart, and community-powered waste management ecosystem where every household is assigned a verified digital identity, collection drivers operate on predictable, optimized schedules, and municipal authorities monitor segregation health in real-time.
          </p>
        </div>
      </div>

      {/* The Two-Bin Strategy Explained */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
          The Scientific Two-Bin Strategy
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          <div style={{ background: '#f0fdf4', padding: '1.75rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#10b981', color: 'white', padding: '0.4rem', borderRadius: '6px' }}>
                <Leaf size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>G-Bin: Wet Stream Processing</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#166534', lineHeight: 1.6, marginBottom: '1rem' }}>
              Wet waste consists of heavy moisture-bearing organic compounds. When mixed with dry trash, it decomposes anaerobically into dangerous methane gas and foul leachate that pollutes urban aquifers.
            </p>
            <p style={{ fontSize: '0.925rem', color: '#166534', lineHeight: 1.6 }}>
              <strong>The Solution:</strong> Separated in the G-Bin, this waste is transported daily to decentralized ward vermi-composting plants and aerobic biogas units, generating bio-fertilizer for city gardens and parks.
            </p>
          </div>

          <div style={{ background: '#f0f9ff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#0284c7', color: 'white', padding: '0.4rem', borderRadius: '6px' }}>
                <Recycle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#075985' }}>B-Bin: Dry Stream Processing</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#0369a1', lineHeight: 1.6, marginBottom: '1rem' }}>
              Paper, corrugated boxes, beverage cartons, metals, and packaging polymers are valuable secondary raw materials. However, if contaminated with curries or tea leaves, their commercial recyclability drops to near zero.
            </p>
            <p style={{ fontSize: '0.925rem', color: '#0369a1', lineHeight: 1.6 }}>
              <strong>The Solution:</strong> Placed in B-Bin clean and dry, these materials are sent to Material Recovery Facilities (MRFs) where authorized recyclers bail and turn them into new products.
            </p>
          </div>
        </div>
      </div>

      {/* Key Core Principles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <HeartHandshake size={32} color="#10b981" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Citizen Empowerment</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
            Every household holds a unique Household ID, giving citizens visibility into scheduled collections and direct access to municipal bins.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Award size={32} color="#0284c7" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Dignity for Sanitation Workers</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
            Sanitation workers no longer have to manually sift through hazardous mixed refuse. Segregated bins ensure hygienic, safer working conditions.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <ShieldCheck size={32} color="#10b981" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Accountable Schedules</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
            Instead of ad-hoc pickups, our scheduled route system guarantees regular collections with assigned drivers and vehicles for each ward.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #0369a1 100%)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Be the Catalyst for Clean Living</h2>
        <p style={{ fontSize: '1.05rem', color: '#e2e8f0', maxWidth: '600px', margin: '0 auto 1.75rem' }}>
          Join thousands of active homes already participating in the G-Bin & B-Bin program in your ward.
        </p>
        <Link to="/register" className="btn" style={{ background: 'white', color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem' }}>
          Register Household Now
        </Link>
      </div>
    </div>
  );
};
