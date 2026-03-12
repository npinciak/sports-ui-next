import { useState } from 'react';
import { PitcherWithRegressionMetrics } from '../model';

interface DetailsProps {
  player: PitcherWithRegressionMetrics | null | undefined;
}

function pct(value: number | null | undefined) {
  return value != null ? `${(value * 100).toFixed(1)}%` : '—';
}

function dec(value: number | null | undefined, d = 2) {
  return value != null ? value.toFixed(d) : '—';
}

function rpm(value: number | null | undefined) {
  return value != null ? `${Math.round(value)}` : '—';
}

export default function Details({ player }: DetailsProps) {
  const [detailTab, setDetailTab] = useState('arsenal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {player ? (
        <div
          key={player.name}
          data-name="anim-in"
          style={{
            background: '#fff',
            border: `1.5px solid ${player.bestPitch?.color || '#e8e0d0'}44`,
            borderTop: `4px solid ${player.bestPitch?.color || '#e85d26'}`,
            borderRadius: 8,
            padding: 18,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>{player.name}</div>
              <div style={{ fontSize: 10, color: '#8a7a5a', marginTop: 2 }}>
                {player.team} · {player.fangraphsStats?.G}G · Age {player.fangraphsStats?.Age} · {player.fangraphsStats?.Season}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontFamily: "'Playfair Display',serif", fontWeight: 900, color: '#1a1208' }}>
                {dec(player.fangraphsStats?.WAR)}
              </div>
              <div style={{ fontSize: 9, color: '#8a7a5a', letterSpacing: '0.1em' }}>fWAR</div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e8e0d0', marginBottom: 14, gap: 0 }}>
            {['arsenal', 'command', 'batted', 'value'].map(t => (
              <button
                key={t}
                name="detail-tab"
                onClick={() => setDetailTab(t)}
                style={{
                  padding: '6px 12px',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: detailTab === t ? '#1a1208' : '#8a7a5a',
                  borderBottom: detailTab === t ? '2px solid #e85d26' : '2px solid transparent',
                  fontFamily: 'inherit',
                  fontWeight: detailTab === t ? 600 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ARSENAL TAB */}
          {detailTab === 'arsenal' && (
            <div>
              {player.arsenal.length === 0 ? (
                <div style={{ fontSize: 12, color: '#8a7a5a', textAlign: 'center', padding: 24 }}>No pitch data available</div>
              ) : (
                player.arsenal
                  .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))
                  .map((pitch, i) => (
                    <div key={pitch.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span
                          style={{
                            background: pitch.color,
                            color: '#fff',
                            borderRadius: 3,
                            padding: '2px 8px',
                            fontSize: 10,
                            fontWeight: 700,
                            minWidth: 28,
                            textAlign: 'center',
                          }}
                        >
                          {pitch.label}
                        </span>
                        <span style={{ fontSize: 11, color: '#4a3c22' }}>{pitch.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600 }}>{pct(pitch.pct)}</span>
                      </div>
                      {/* usage bar */}
                      <div style={{ height: 6, background: '#f0ebe0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                        <div
                          data-name="bar-fill"
                          style={{
                            height: '100%',
                            // '--w': pct(pm.pct),
                            width: pct(pitch.pct),
                            background: pitch.color,
                            borderRadius: 3,
                            animationDelay: `${i * 0.08}s`,
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                        {[
                          { label: 'Velo', val: pitch.velocity != null ? `${pitch.velocity.toFixed(1)}` : '—' },
                          {
                            label: 'RV/C',
                            val:
                              pitch.runValue != null
                                ? pitch.runValue > 0
                                  ? `+${pitch.runValue.toFixed(1)}`
                                  : pitch.runValue.toFixed(1)
                                : '—',
                            color: pitch?.runValue
                              ? pitch.runValue > 0
                                ? '#16a34a'
                                : pitch.runValue < -0.5
                                  ? '#dc2626'
                                  : '#1a1208'
                              : undefined,
                          },
                          { label: 'Spin', val: pitch.spin != null ? rpm(pitch.spin) : '—' },
                          { label: 'Arm∠', val: pitch.armAngle != null ? `${pitch.armAngle.toFixed(1)}°` : '—' },
                        ].map(s => (
                          <div key={s.label} style={{ background: '#faf7f2', borderRadius: 3, padding: '5px 6px', textAlign: 'center' }}>
                            <div style={{ fontSize: 8, color: '#8a7a5a', letterSpacing: '0.08em' }}>{s.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: s.color || '#1a1208', marginTop: 1 }}>{s.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* COMMAND TAB */}
          {detailTab === 'command' && (
            <div>
              {[
                { label: 'K%', val: player.fangraphsStats?.['K%'], max: 0.4, fmt: pct, good: true },
                { label: 'BB%', val: player.fangraphsStats?.['BB%'], max: 0.14, fmt: pct, good: false },
                { label: 'SwStr%', val: player.fangraphsStats?.['SwStr%'], max: 0.2, fmt: pct, good: true },
                { label: 'F-Strike%', val: player.fangraphsStats?.['F-Strike%'], max: 0.75, fmt: pct, good: true },
                { label: 'O-Swing%', val: player.fangraphsStats?.['pfxO-Swing%'], max: 0.45, fmt: pct, good: true },
                { label: 'Zone%', val: player.fangraphsStats?.['pfxZone%'], max: 0.55, fmt: pct, good: null },
                { label: 'Contact%', val: player.fangraphsStats?.['pfxContact%'], max: 0.85, fmt: pct, good: false },
              ].map(m => {
                const barPct = m.val != null ? Math.min((m.val / m.max) * 100, 100) : 0;
                const barCol = m.good === true ? '#e85d26' : m.good === false ? '#4a9eff' : '#d4a017';
                return (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 62, fontSize: 10, color: '#8a7a5a' }}>{m.label}</div>
                    <div style={{ flex: 1, height: 7, background: '#e8e0d0', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${barPct}%`,
                          background: barCol,
                          borderRadius: 3,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1208', width: 42, textAlign: 'right' }}>{m.fmt(m.val)}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BATTED BALL TAB */}
          {detailTab === 'batted' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  {
                    label: 'GB%',
                    val: player.fangraphsStats?.['GB%'],
                    note: '>45% is elite',
                    good: (player.fangraphsStats?.['GB%'] || 0) > 0.45,
                  },
                  {
                    label: 'Hard%',
                    val: player.fangraphsStats?.['Hard%'],
                    note: '<30% is elite',
                    good: (player.fangraphsStats?.['Hard%'] || 1) < 0.3,
                  },
                  {
                    label: 'BABIP',
                    val: player.fangraphsStats?.['BABIP'],
                    note: '.290 avg',
                    good: (player.fangraphsStats?.['BABIP'] || 1) < 0.29,
                  },
                  {
                    label: 'HR/FB',
                    val: player.fangraphsStats?.['HR/FB'],
                    note: '<10% is safe',
                    good: (player.fangraphsStats?.['HR/FB'] || 1) < 0.1,
                  },
                ].map(s => (
                  <div
                    key={s.label}
                    style={{
                      background: s.good ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${s.good ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: 5,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ fontSize: 9, color: '#8a7a5a', letterSpacing: '0.1em' }}>{s.label}</div>
                    <div
                      style={{
                        fontSize: 22,
                        fontFamily: "'Playfair Display',serif",
                        fontWeight: 900,
                        color: s.good ? '#15803d' : '#dc2626',
                        marginTop: 2,
                      }}
                    >
                      {s.label === 'BABIP' ? dec(s.val, 3) : pct(s.val)}
                    </div>
                    <div style={{ fontSize: 9, color: s.good ? '#16a34a' : '#dc2626', marginTop: 2 }}>{s.note}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#6b5e3e',
                  lineHeight: 1.6,
                  background: '#faf7f2',
                  borderRadius: 5,
                  padding: '10px 12px',
                }}
              >
                {(player.fangraphsStats?.['GB%'] || 0) > 0.5 && (player.fangraphsStats?.['Hard%'] || 1) < 0.3
                  ? `${player.name.split(' ')[0]}'s batted ball profile is elite — high grounders, low hard contact. Results should be very sustainable.`
                  : (player.fangraphsStats?.['Hard%'] || 0) > 0.35
                    ? `High hard contact rate is a red flag. ${player.name.split(' ')[0]} may be allowing more damage than ERA reflects.`
                    : `Mixed batted ball signals. Monitor Hard% and BABIP over the next 2–3 weeks before acting.`}
              </div>
            </div>
          )}

          {/* VALUE TAB */}
          {detailTab === 'value' && (
            <div>
              {[
                { label: 'fWAR', val: dec(player.fangraphsStats?.WAR), sub: 'Fangraphs WAR' },
                { label: '$ Value', val: `$${dec(player.fangraphsStats?.Dollars)}M`, sub: 'FG dollar value' },
                { label: 'Roster TV', val: dec(player.fangraphsStats?.rTV, 1), sub: 'Total team value added' },
                { label: 'Field Value', val: dec(player.fangraphsStats?.rFTeamV, 1), sub: 'Fielding team value' },
                { label: 'Bat Value', val: dec(player.fangraphsStats?.rBTeamV, 1), sub: 'Batting team value' },
              ].map(s => (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom: '1px solid #f0ebe0',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: '#4a3c22', fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: '#8a7a5a' }}>{s.sub}</div>
                  </div>
                  <div style={{ fontSize: 16, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#1a1208' }}>{s.val}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            border: '1.5px solid #e8e0d0',
            borderRadius: 8,
            padding: 24,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 32, color: '#e8e0d0', fontFamily: "'Playfair Display', serif" }}>⚾</div>
          <div style={{ fontSize: 12, color: '#8a7a5a', textAlign: 'center', lineHeight: 1.7 }}>
            Hover or click a pitcher
            <br />
            to see their full arsenal,
            <br />
            command & regression profile
          </div>
        </div>
      )}
    </div>
  );
}
