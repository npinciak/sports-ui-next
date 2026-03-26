'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { LeagueProgressionSelectors } from '@/lib/features/baseball/selectors';
import { useAppSelector } from '@/lib/hooks';

type Metric = 'totalPoints' | 'leagueRank';

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  teamId: number;
  scoringPeriodId: number;
  totalPoints: number;
  leagueRank: number;
};

export default function LeagueProgression() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [metric, setMetric] = useState<Metric>('totalPoints');
  const [focusedTeamId, setFocusedTeamId] = useState<number | null>(null);
  const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    teamId: 0,
    scoringPeriodId: 0,
    totalPoints: 0,
    leagueRank: 0,
  });
  const progression = useAppSelector(state => LeagueProgressionSelectors.selectAll(state));
  const activeTeamId = focusedTeamId ?? hoveredTeamId;

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
      .map(([espnTeamId, values]) => ({
        espnTeamId,
        values: values.sort((a, b) => a.scoringPeriodId - b.scoringPeriodId),
      }))
      .sort((a, b) => a.espnTeamId - b.espnTeamId);
  }, [progression]);

  useEffect(() => {
    const svgElement = svgRef.current;
    const containerElement = containerRef.current;
    if (!svgElement || !containerElement) {
      return;
    }

    const allValues = groupedProgression.flatMap(group => group.values);

    if (allValues.length === 0) {
      d3.select(svgElement).selectAll('*').remove();
      return;
    }

    const draw = () => {
      const bounds = containerElement.getBoundingClientRect();
      const width = Math.max(bounds.width, 320);
      const height = 360;

      const margin = { top: 20, right: 20, bottom: 44, left: 56 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const minPeriod = d3.min(allValues, d => d.scoringPeriodId);
      const maxPeriod = d3.max(allValues, d => d.scoringPeriodId);
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

      const colorScale = d3
        .scaleOrdinal<number, string>()
        .domain(groupedProgression.map(group => group.espnTeamId))
        .range(d3.schemeTableau10);

      const lineBuilder = d3
        .line<(typeof groupedProgression)[number]['values'][number]>()
        .x(d => xScale(d.scoringPeriodId))
        .y(d => yScale(d[metric]));

      const svg = d3.select(svgElement).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

      svg.selectAll('*').remove();

      const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      root
        .append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(6)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .attr('stroke-opacity', 0.12);

      root
        .append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .ticks(Math.min(maxPeriod - minPeriod + 1, 10))
            .tickFormat(d3.format('d'))
        );

      const yAxis = d3.axisLeft(yScale).ticks(6);
      if (isRankMetric) {
        yAxis.tickFormat(d3.format('d'));
      }
      root.append('g').call(yAxis);

      root
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .text('Scoring Period ID');

      root
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .text(metric === 'totalPoints' ? 'Total Points' : 'League Rank (1 = Best)');

      const teamSeries = root
        .append('g')
        .selectAll('g')
        .data(groupedProgression)
        .join('g')
        .attr('data-team-id', d => d.espnTeamId);

      teamSeries
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => colorScale(d.espnTeamId))
        .attr('stroke-width', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 2.5 : 1.5))
        .attr('stroke-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 1 : 0.2))
        .attr('d', d => lineBuilder(d.values) ?? '');

      teamSeries
        .selectAll('circle')
        .data(d => d.values.map(value => ({ ...value, espnTeamId: d.espnTeamId })))
        .join('circle')
        .attr('cx', d => xScale(d.scoringPeriodId))
        .attr('cy', d => yScale(d[metric]))
        .attr('r', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 3.5 : 2.5))
        .attr('fill', d => colorScale(d.espnTeamId))
        .attr('fill-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 1 : 0.24))
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('r', 6);
          const [x, y] = d3.pointer(event, containerElement);
          setTooltip({
            visible: true,
            x,
            y,
            teamId: d.espnTeamId,
            scoringPeriodId: d.scoringPeriodId,
            totalPoints: d.totalPoints,
            leagueRank: d.leagueRank,
          });
        })
        .on('mousemove', function (event, d) {
          const [x, y] = d3.pointer(event, containerElement);
          setTooltip({
            visible: true,
            x,
            y,
            teamId: d.espnTeamId,
            scoringPeriodId: d.scoringPeriodId,
            totalPoints: d.totalPoints,
            leagueRank: d.leagueRank,
          });
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 3.5);
          setTooltip(prev => ({ ...prev, visible: false }));
        });

      const legend = svg.append('g').attr('transform', `translate(${margin.left},${8})`);

      const legendItem = legend
        .selectAll('g')
        .data(groupedProgression)
        .join('g')
        .attr('transform', (_, index) => `translate(${index * 92},0)`)
        .style('cursor', 'pointer')
        .on('mouseenter', (_, d) => {
          if (focusedTeamId === null) {
            setHoveredTeamId(d.espnTeamId);
          }
        })
        .on('mouseleave', () => {
          if (focusedTeamId === null) {
            setHoveredTeamId(null);
          }
        })
        .on('click', (_, d) => {
          setHoveredTeamId(null);
          setFocusedTeamId(current => (current === d.espnTeamId ? null : d.espnTeamId));
        });

      legendItem
        .append('line')
        .attr('x1', 0)
        .attr('x2', 14)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', d => colorScale(d.espnTeamId))
        .attr('stroke-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 1 : 0.24))
        .attr('stroke-width', 2.5);

      legendItem
        .append('text')
        .attr('x', 18)
        .attr('y', 4)
        .attr('font-size', 10)
        .attr('fill-opacity', d => (activeTeamId === null || d.espnTeamId === activeTeamId ? 1 : 0.45))
        .text(d => `Team ${d.espnTeamId}`);
    };

    draw();

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [groupedProgression, activeTeamId, focusedTeamId, metric]);

  return (
    <div ref={containerRef} className="relative w-full space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={metric === 'totalPoints' ? 'default' : 'outline'} onClick={() => setMetric('totalPoints')}>
          Total Points
        </Button>
        <Button type="button" size="sm" variant={metric === 'leagueRank' ? 'default' : 'outline'} onClick={() => setMetric('leagueRank')}>
          League Rank
        </Button>
        {focusedTeamId !== null && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setFocusedTeamId(null)}>
            Clear Team Focus
          </Button>
        )}
      </div>
      {groupedProgression.length > 0 ? (
        <svg ref={svgRef} className="h-[360px] w-full" role="img" aria-label="League progression by team and scoring period" />
      ) : (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">No progression data available.</div>
      )}
      {tooltip.visible && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border bg-background/95 px-3 py-2 text-xs shadow-md"
          style={{ left: tooltip.x + 12, top: tooltip.y - 12 }}
        >
          <div className="font-medium">Team {tooltip.teamId}</div>
          <div>Scoring Period: {tooltip.scoringPeriodId}</div>
          <div>Total Points: {tooltip.totalPoints.toFixed(2)}</div>
          <div>League Rank: {tooltip.leagueRank}</div>
        </div>
      )}
    </div>
  );
}
