import React from 'react';
import { BarChart3 } from 'lucide-react';
import ComparisonCard from './ComparisonCard';
import { CONVERSION_STATUS } from '../../types/conversion';

/**
 * Layout wrapper untuk alat konversi dengan area Before vs After terpusat.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.highlight] - Kata yang di-highlight di judul
 * @param {string} props.description
 * @param {import('../../types/conversion').ComparisonItem[]} [props.comparisonItems]
 * @param {import('../../types/conversion').ComparisonItem} [props.aggregateItem]
 * @param {boolean} [props.showComparison]
 * @param {React.ReactNode} props.children - Area upload / workspace utama
 * @param {React.ReactNode} props.sidebar - Panel pengaturan & aksi
 * @param {React.ReactNode} [props.infoBox] - Tips / FAQ di bawah workspace
 * @param {React.ReactNode} [props.adTop]
 * @param {React.ReactNode} [props.adSidebar]
 */
const ConversionDashboard = ({
  title,
  highlight = '',
  description,
  comparisonItems = [],
  aggregateItem = null,
  showComparison = false,
  children,
  sidebar,
  infoBox = null,
  adTop = null,
  adSidebar = null,
}) => {
  const hasComparisons = showComparison && comparisonItems.length > 0;
  const completedCount = comparisonItems.filter(
    (i) => i.status === CONVERSION_STATUS.COMPLETE
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
          {title}{' '}
          {highlight && (
            <span className="text-brand-500 uppercase">{highlight}</span>
          )}
        </h1>
        <p className="text-slate-600 mt-2 max-w-xl mx-auto">{description}</p>
      </div>

      {adTop}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Main workspace */}
        <div className="lg:col-span-3 space-y-6">
          {children}

          {/* Conversion Dashboard — Before vs After */}
          {hasComparisons && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <BarChart3 size={18} className="text-brand-500" />
                  Perbandingan Hasil
                  {completedCount > 0 && (
                    <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-extrabold normal-case tracking-normal">
                      {completedCount} selesai
                    </span>
                  )}
                </h2>
              </div>

              {/* Aggregate summary untuk batch */}
              {aggregateItem && comparisonItems.length > 1 && (
                <ComparisonCard item={aggregateItem} />
              )}

              {/* Per-file comparison */}
              <div className="space-y-4">
                {comparisonItems.map((item) => (
                  <ComparisonCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {infoBox}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {sidebar}
          {adSidebar}
        </div>
      </div>
    </div>
  );
};

export default ConversionDashboard;
