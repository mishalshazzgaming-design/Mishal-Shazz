import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { History, Filter, CheckCircle2, XCircle, Clock, Award, Calendar } from 'lucide-react';
import { PrayerRecord } from '../types';

export const PrayerHistorySection: React.FC = () => {
  const { prayers, activeUserId, currentLocalDateStr, pointsConfig } = useIbadah();
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'prev_month' | 'all'>('month');

  // Filter records by active user
  const userPrayers = prayers.filter(p => p.userId === activeUserId);

  // Compute date filter boundary
  const now = new Date();
  const filteredList = userPrayers.filter(p => {
    if (filterPeriod === 'all') return true;
    const pDate = new Date(p.date + 'T12:00:00');
    if (filterPeriod === 'week') {
      const diffTime = Math.abs(now.getTime() - pDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (filterPeriod === 'month') {
      return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    }
    if (filterPeriod === 'prev_month') {
      const prevMonth = (now.getMonth() - 1 + 12) % 12;
      return pDate.getMonth() === prevMonth;
    }
    return true;
  });

  const totalCompleted = filteredList.filter(p => p.status === 'completed').length;
  const totalMissed = filteredList.filter(p => p.status === 'missed').length;
  const totalPoints = filteredList.reduce((sum, p) => sum + (p.points || 0), 0);

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#8DB7D9] font-medium flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Prayer Consistency</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            Prayer History
          </h2>
        </div>

        {/* Period Filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs self-start sm:self-center">
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterPeriod === 'week' ? 'bg-[#8DB7D9] text-[#07111F] font-semibold' : 'text-[#B8C1CC]'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterPeriod === 'month' ? 'bg-[#8DB7D9] text-[#07111F] font-semibold' : 'text-[#B8C1CC]'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setFilterPeriod('prev_month')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterPeriod === 'prev_month' ? 'bg-[#8DB7D9] text-[#07111F] font-semibold' : 'text-[#B8C1CC]'
            }`}
          >
            Prev Month
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filterPeriod === 'all' ? 'bg-[#8DB7D9] text-[#07111F] font-semibold' : 'text-[#B8C1CC]'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 text-center space-y-0.5">
          <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Completed</span>
          <span className="text-xl font-bold text-[#8DB7D9] font-serif-elegant">
            {totalCompleted}
          </span>
          <span className="text-[10px] text-[#B8C1CC]/60 block">prayers</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 text-center space-y-0.5">
          <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Missed</span>
          <span className="text-xl font-bold text-rose-400 font-serif-elegant">
            {totalMissed}
          </span>
          <span className="text-[10px] text-[#B8C1CC]/60 block">prayers</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 text-center space-y-0.5">
          <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Prayer Points</span>
          <span className="text-xl font-bold text-[#D8B477] font-serif-elegant">
            ⭐ {totalPoints}
          </span>
          <span className="text-[10px] text-[#B8C1CC]/60 block">points</span>
        </div>
      </div>

      {/* List of Prayer History Entries */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-[#B8C1CC]/70 font-medium">
          Detailed Prayer Records
        </div>

        {filteredList.length === 0 ? (
          <div className="p-8 rounded-xl bg-white/3 border border-white/6 text-center text-xs text-[#B8C1CC]">
            No prayer records found for this period yet. Complete prayers on the Today screen to build your history!
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredList
              .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
              .map(record => (
                <div
                  key={record.id}
                  className="p-3 rounded-xl bg-white/4 border border-white/8 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {record.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#8DB7D9]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <div>
                      <div className="font-semibold text-[#F5F3EE] uppercase tracking-wide">
                        {record.prayerName}
                      </div>
                      <div className="text-[11px] text-[#B8C1CC]/70">
                        Date: {record.date} • Scheduled: {record.scheduledTime}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {record.status === 'completed' ? (
                      <div>
                        <span className="text-[#8DB7D9] font-medium block">
                          Prayed at {record.actualTime}
                        </span>
                        <span className="text-[#D8B477] font-semibold text-[11px]">
                          +{record.points} pts
                        </span>
                      </div>
                    ) : (
                      <span className="text-rose-400">Missed</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
