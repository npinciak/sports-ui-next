'use client';

import { CategoryOption } from './category-breakdown.model';

interface HeaderProps {
  activeCat: CategoryOption | null;
  batters: any[];
  viewMode: string;
  setViewMode: (mode: string) => void;
}

export default function Header({ activeCat, batters, viewMode, setViewMode }: HeaderProps) {
  return (
    <div style={{ borderBottom: '3px solid #1a1208', paddingBottom: 16, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 1,
              color: '#1a1208',
            }}
          >
            CATEGORY CONTRIBUTION
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: activeCat?.color ?? '#1a1208',
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            BREAKDOWN
          </div>
          <div style={{ fontSize: 11, color: '#8a7a5a', marginTop: 6, letterSpacing: '0.12em' }}>
            WHO IS DRIVING YOUR ROSTER · {batters.length} PLAYERS
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {['bar', 'grid'].map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              style={{
                background: viewMode === m ? '#1a1208' : 'transparent',
                border: '1.5px solid #1a1208',
                borderRadius: 3,
                padding: '5px 14px',
                color: viewMode === m ? '#faf7f2' : '#1a1208',
                fontFamily: 'inherit',
                fontSize: 11,
                cursor: 'pointer',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
