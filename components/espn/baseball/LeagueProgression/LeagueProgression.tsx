'use client';

import * as d3 from 'd3';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { LeagueProgressionSelectors } from '@/lib/features/baseball/league-progression/league-progression.selector';
import { LeagueProgressionClient } from '@/lib/features/baseball/league-progression/league-progresson.client';
import { BaseballLeagueSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

type Metric = 'totalPoints' | 'leagueRank';

type CircleDatum = {
  scoringPeriodId: number;
  totalPoints: number | null;
  leagueRank: number | null;
  espnTeamId: number;
};

type TooltipState = {
  visible: boolean;
  left: number;
  top: number;
  teamId: number;
  scoringPeriodId: number;
  totalPoints: number;
  leagueRank: number;
  color: string;
};

const TEAM_COLORS = [
  '#0f766e',
  '#2563eb',
  '#d97706',
  '#be123c',
  '#0891b2',
  '#4338ca',
  '#16a34a',
  '#ea580c',
  '#7c3aed',
  '#b91c1c',
  '#0369a1',
  '#4d7c0f',
];

export default function LeagueProgression() {
  const { isFetching } = LeagueProgressionClient.useGetLeagueProgressionQuery();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomOverlayRef = useRef<SVGRectElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGRectElement, unknown> | null>(null);
  const zoomTransformRef = useRef(d3.zoomIdentity);
  const clipPathId = useId().replace(/:/g, '');
  const [metric, setMetric] = useState<Metric>('totalPoints');
  const [focusedTeamId, setFocusedTeamId] = useState<number | null>(null);
  const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    left: 0,
    top: 0,
    teamId: 0,
    scoringPeriodId: 0,
    totalPoints: 0,
    leagueRank: 0,
    color: '#2563eb',
  });
  const progression = useAppSelector(state => LeagueProgressionSelectors.selectAll(state));
  const finalScoringPeriodId = useAppSelector(BaseballLeagueSelectors.getFinalScoringPeriodIdAsNumber);
  const activeTeamId = focusedTeamId ?? hoveredTeamId;

  const handleResetZoom = () => {
    if (!zoomOverlayRef.current || !zoomBehaviorRef.current) {
      return;
    }
    d3.select(zoomOverlayRef.current).transition().duration(250).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const groupedProgression = useMemo(() => {
    const latestByTeamAndPeriod = new Map<
      string,
      {
        espnLeagueId: number;
        espnTeamId: number;
        scoringPeriodId: number;
        totalPoints: number;
        leagueRank: number;
        createdAt: Date;
      }
    >();

    for (const entry of progression) {
      if (entry.espnLeagueId === null || entry.espnLeagueTeamId === null || entry.scoringPeriodId === null) {
        continue;
      }

      const key = `${entry.espnLeagueId}-${entry.espnLeagueTeamId}-${entry.scoringPeriodId}`;
      const createdAt = new Date(entry.createdAt);
      const existing = latestByTeamAndPeriod.get(key);

      if (!existing || createdAt > existing.createdAt) {
        latestByTeamAndPeriod.set(key, {
          espnLeagueId: entry.espnLeagueId,
          espnTeamId: entry.espnLeagueTeamId,
          scoringPeriodId: entry.scoringPeriodId,
          totalPoints: entry.totalPoints,
          leagueRank: entry.leagueRank,
          createdAt,
        });
      }
    }

    return d3
      .groups(Array.from(latestByTeamAndPeriod.values()), d => d.espnTeamId)
      .map(([espnTeamId, values]) => {
        const byPeriod = new Map(values.map(value => [value.scoringPeriodId, value]));
        return {
          espnTeamId,
          values: d3.range(1, finalScoringPeriodId + 1).map(scoringPeriodId => {
            const value = byPeriod.get(scoringPeriodId);
            return {
              scoringPeriodId,
              totalPoints: value?.totalPoints ?? null,
              leagueRank: value?.leagueRank ?? null,
            };
          }),
        };
      })
      .sort((a, b) => a.espnTeamId - b.espnTeamId);
  }, [progression]);

  const teamColorById = useMemo(() => {
    return new Map(groupedProgression.map((group, index) => [group.espnTeamId, TEAM_COLORS[index % TEAM_COLORS.length]]));
  }, [groupedProgression]);

  useEffect(() => {
    const svgElement = svgRef.current;
    const containerElement = containerRef.current;
    if (!svgElement || !containerElement) {
      return;
    }

    const allValues = groupedProgression
      .flatMap(group => group.values)
      .filter((value): value is { scoringPeriodId: number; totalPoints: number; leagueRank: number } => {
        return value.totalPoints !== null && value.leagueRank !== null;
      });

    if (allValues.length === 0) {
      d3.select(svgElement).selectAll('*').remove();
      return;
    }

    const draw = () => {
      const bounds = containerElement.getBoundingClientRect();
      const width = Math.max(bounds.width, 320);
      const height = 420;

      const margin = { top: 24, right: 20, bottom: 56, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const minPeriod = 1;
      const maxPeriod = finalScoringPeriodId;
      const minMetricValue = d3.min(allValues, d => d[metric]);
      const maxMetricValue = d3.max(allValues, d => d[metric]);
      const isRankMetric = metric === 'leagueRank';

      if (minPeriod === undefined || maxPeriod === undefined || minMetricValue === undefined || maxMetricValue === undefined) {
        d3.select(svgElement).selectAll('*').remove();
        return;
      }

      const yPadding = isRankMetric
        ? Math.max((maxMetricValue - minMetricValue) * 0.1, 0.5)
        : Math.max((maxMetricValue - minMetricValue) * 0.05, 1);

      const xScale = d3.scaleLinear().domain([minPeriod, maxPeriod]).range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain(
          isRankMetric
            ? [maxMetricValue + yPadding, Math.max(minMetricValue - yPadding, 1)]
            : [Math.max(minMetricValue - yPadding, 0), maxMetricValue + yPadding]
        )
        .nice()
        .range([innerHeight, 0]);

      const svg = d3.select(svgElement).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

      svg.selectAll('*').remove();

      svg
        .append('defs')
        .append('clipPath')
        .attr('id', clipPathId)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', innerWidth)
        .attr('height', innerHeight);

      const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const plotLayer = root.append('g').attr('clip-path', `url(#${clipPathId})`);

      root
        .append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(7)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .attr('stroke-opacity', 0.08);

      const xAxisGroup = root
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(12).tickFormat(d3.format('d')));

      const yAxis = d3.axisLeft(yScale).ticks(7);
      if (isRankMetric) {
        yAxis.tickFormat(d3.format('d'));
      }
      root.append('g').call(yAxis);

      root.selectAll('.domain,.tick line').attr('stroke', '#64748b').attr('stroke-opacity', 0.35);
      root.selectAll('.tick text').attr('fill', '#475569').attr('font-size', 11);

      root
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('fill', '#334155')
        .text('Scoring Period ID');

      root
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('fill', '#334155')
        .text(metric === 'totalPoints' ? 'Total Points' : 'League Rank (1 = Best)');

      const teamSeries = plotLayer
        .append('g')
        .selectAll('g')
        .data(groupedProgression)
        .join('g')
        .attr('data-team-id', d => d.espnTeamId);

      const pathSelection = teamSeries
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => teamColorById.get(d.espnTeamId) ?? '#2563eb')
        .attr('stroke-width', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 3 : 1.5))
        .attr('stroke-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 0.95 : 0.12))
        .attr('filter', d => (activeTeamId !== null && d.espnTeamId === activeTeamId ? 'drop-shadow(0 0 3px rgba(15,23,42,0.35))' : null))
        .attr('d', '');

      teamSeries
        .selectAll<SVGCircleElement, CircleDatum>('circle')
        .data<CircleDatum>(d => d.values.filter(value => value[metric] !== null).map(value => ({ ...value, espnTeamId: d.espnTeamId })))
        .join('circle')
        .attr('cy', d => yScale(d[metric] ?? 0))
        .attr('r', 0)
        .transition()
        .duration(280)
        .ease(d3.easeBackOut)
        .attr('r', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 4 : 2.5));

      teamSeries
        .selectAll<SVGCircleElement, CircleDatum>('circle')
        .attr('fill', d => teamColorById.get(d.espnTeamId) ?? '#2563eb')
        .attr('fill-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 1 : 0.18))
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('r', 6);
          const [x, y] = d3.pointer(event, containerElement);
          const tooltipWidth = 220;
          const tooltipHeight = 110;
          const pad = 10;
          const preferredTop = y - tooltipHeight - 12;
          const left = Math.min(Math.max(x + 12, pad), Math.max(pad, bounds.width - tooltipWidth - pad));
          const top =
            preferredTop > pad ? preferredTop : Math.min(Math.max(y + 12, pad), Math.max(pad, bounds.height - tooltipHeight - pad));
          setTooltip({
            visible: true,
            left,
            top,
            teamId: d.espnTeamId,
            scoringPeriodId: d.scoringPeriodId,
            totalPoints: d.totalPoints ?? 0,
            leagueRank: d.leagueRank ?? 0,
            color: teamColorById.get(d.espnTeamId) ?? '#2563eb',
          });
        })
        .on('mousemove', function (event, d) {
          const [x, y] = d3.pointer(event, containerElement);
          const tooltipWidth = 220;
          const tooltipHeight = 110;
          const pad = 10;
          const preferredTop = y - tooltipHeight - 12;
          const left = Math.min(Math.max(x + 12, pad), Math.max(pad, bounds.width - tooltipWidth - pad));
          const top =
            preferredTop > pad ? preferredTop : Math.min(Math.max(y + 12, pad), Math.max(pad, bounds.height - tooltipHeight - pad));
          setTooltip({
            visible: true,
            left,
            top,
            teamId: d.espnTeamId,
            scoringPeriodId: d.scoringPeriodId,
            totalPoints: d.totalPoints ?? 0,
            leagueRank: d.leagueRank ?? 0,
            color: teamColorById.get(d.espnTeamId) ?? '#2563eb',
          });
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', activeTeamId === null ? 4 : 2.5);
          setTooltip(prev => ({ ...prev, visible: false }));
        });

      const endpointLayer = plotLayer.append('g').attr('pointer-events', 'none');

      const renderWithXScale = (scaledX: d3.ScaleLinear<number, number>) => {
        const lineBuilder = d3
          .line<(typeof groupedProgression)[number]['values'][number]>()
          .defined(d => d[metric] !== null)
          .x(d => scaledX(d.scoringPeriodId))
          .y(d => yScale(d[metric] ?? 0));

        xAxisGroup.call(d3.axisBottom(scaledX).ticks(12).tickFormat(d3.format('d')));

        pathSelection.attr('d', d => lineBuilder(d.values) ?? '');
        teamSeries.selectAll<SVGCircleElement, CircleDatum>('circle').attr('cx', d => scaledX(d.scoringPeriodId));

        const endpoints = groupedProgression
          .map(group => {
            const lastValue = group.values.findLast(value => value[metric] !== null);
            if (!lastValue) {
              return null;
            }
            return {
              espnTeamId: group.espnTeamId,
              x: scaledX(lastValue.scoringPeriodId),
              y: yScale(lastValue[metric] ?? 0),
              metricValue: lastValue[metric] ?? 0,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
          .sort((a, b) => a.y - b.y);

        const minLabelGap = 12;
        let lastY = -Infinity;
        const adjusted = endpoints.map(endpoint => {
          const y = Math.max(endpoint.y, lastY + minLabelGap);
          lastY = y;
          return { ...endpoint, adjustedY: y };
        });

        for (let i = adjusted.length - 1; i >= 0; i -= 1) {
          const maxY = innerHeight - 4 - (adjusted.length - 1 - i) * minLabelGap;
          adjusted[i].adjustedY = Math.min(adjusted[i].adjustedY, maxY);
        }

        endpointLayer.selectAll('*').remove();

        endpointLayer
          .selectAll('line')
          .data(adjusted)
          .join('line')
          .attr('x1', d => d.x)
          .attr('y1', d => d.y)
          .attr('x2', d => Math.min(innerWidth - 34, d.x + 10))
          .attr('y2', d => d.adjustedY)
          .attr('stroke', d => teamColorById.get(d.espnTeamId) ?? '#2563eb')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 0.7 : 0.15));

        endpointLayer
          .selectAll('text')
          .data(adjusted)
          .join('text')
          .attr('x', d => Math.min(innerWidth - 30, d.x + 14))
          .attr('y', d => d.adjustedY + 4)
          .attr('font-size', 10)
          .attr('font-weight', 600)
          .attr('fill', d => teamColorById.get(d.espnTeamId) ?? '#2563eb')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 3)
          .attr('paint-order', 'stroke')
          .attr('fill-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 1 : 0.28))
          .text(d => `T${d.espnTeamId}: ${isRankMetric ? d3.format('d')(d.metricValue) : d3.format('.1f')(d.metricValue)}`);
      };

      renderWithXScale(zoomTransformRef.current.rescaleX(xScale));

      pathSelection.each(function () {
        const path = d3.select(this);
        const length = (this as SVGPathElement).getTotalLength();
        path
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(650)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0)
          .on('end', function () {
            d3.select(this).attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
          });
      });

      const zoomBehavior = d3
        .zoom<SVGRectElement, unknown>()
        .scaleExtent([1, 20])
        .translateExtent([
          [0, 0],
          [innerWidth, innerHeight],
        ])
        .extent([
          [0, 0],
          [innerWidth, innerHeight],
        ])
        .on('zoom', event => {
          zoomTransformRef.current = event.transform;
          renderWithXScale(event.transform.rescaleX(xScale));
        });

      const zoomOverlay = root
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .style('cursor', 'grab')
        .on('mousedown', function () {
          d3.select(this).style('cursor', 'grabbing');
        })
        .on('mouseup', function () {
          d3.select(this).style('cursor', 'grab');
        })
        .on('mouseleave', function () {
          d3.select(this).style('cursor', 'grab');
        });

      zoomOverlayRef.current = zoomOverlay.node();
      zoomBehaviorRef.current = zoomBehavior;
      zoomOverlay.call(zoomBehavior);
      zoomOverlay.call(zoomBehavior.transform, zoomTransformRef.current);
    };

    draw();

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [groupedProgression, activeTeamId, metric, teamColorById]);

  return (
    <div ref={containerRef} className="relative w-full space-y-3">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-800">League Progression</h3>
        <p className="text-xs text-slate-500">
          Hover points for detail. Hover legend to preview focus, click to lock. Scroll or drag to zoom.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={metric === 'totalPoints' ? 'default' : 'outline'} onClick={() => setMetric('totalPoints')}>
          Total Points
        </Button>
        <Button type="button" size="sm" variant={metric === 'leagueRank' ? 'default' : 'outline'} onClick={() => setMetric('leagueRank')}>
          League Rank
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleResetZoom}>
          Reset Zoom
        </Button>
        {focusedTeamId !== null && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setFocusedTeamId(null)}>
            Clear Team Focus
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {groupedProgression.map(group => {
          const color = teamColorById.get(group.espnTeamId) ?? '#2563eb';
          const isActive = activeTeamId === null || activeTeamId === group.espnTeamId;
          return (
            <button
              key={group.espnTeamId}
              type="button"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1 text-xs transition-colors"
              style={{ opacity: isActive ? 1 : 0.45 }}
              onMouseEnter={() => {
                if (focusedTeamId === null) {
                  setHoveredTeamId(group.espnTeamId);
                }
              }}
              onMouseLeave={() => {
                if (focusedTeamId === null) {
                  setHoveredTeamId(null);
                }
              }}
              onClick={() => {
                setHoveredTeamId(null);
                setFocusedTeamId(current => (current === group.espnTeamId ? null : group.espnTeamId));
              }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span>Team {group.espnTeamId}</span>
            </button>
          );
        })}
      </div>
      {groupedProgression.length > 0 ? (
        <svg ref={svgRef} className="h-[420px] w-full" role="img" aria-label="League progression by team and scoring period" />
      ) : (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">No progression data available.</div>
      )}
      {tooltip.visible && (
        <div
          className="pointer-events-none absolute z-10 min-w-52 rounded-md border bg-background/95 px-3 py-2 text-xs shadow-md"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          <div className="mb-1 flex items-center gap-2 font-medium">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tooltip.color }} />
            <span>Team {tooltip.teamId}</span>
          </div>
          <div>Scoring Period: {tooltip.scoringPeriodId}</div>
          <div>Total Points: {tooltip.totalPoints.toFixed(2)}</div>
          <div>League Rank: {tooltip.leagueRank}</div>
        </div>
      )}
    </div>
  );
}
