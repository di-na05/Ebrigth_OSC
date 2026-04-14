import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateDropdownProps {
  onDateRangeChange: (from: Date | null, to: Date | null) => void;
  label?: string;
}

export function DateDropdown({ onDateRangeChange, label = 'Date Range' }: DateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('all');
  const [customRange, setCustomRange] = useState<DateRange>({ from: null, to: null });
  const [showCustom, setShowCustom] = useState(false);

  const getDateRange = (option: string): { from: Date | null; to: Date | null } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (option) {
      case 'today': {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { from: today, to: tomorrow };
      }
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        return { from: yesterday, to: tomorrow };
      }
      case 'thisWeek': {
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1);
        const nextMonday = new Date(monday);
        nextMonday.setDate(nextMonday.getDate() + 7);
        return { from: monday, to: nextMonday };
      }
      case 'thisMonth': {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return { from: firstDay, to: lastDay };
      }
      case 'last30': {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { from: thirtyDaysAgo, to: tomorrow };
      }
      case 'custom':
        return customRange;
      default:
        return { from: null, to: null };
    }
  };

  const handleOptionSelect = (option: string) => {
    if (option === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      setSelectedOption(option);
      const range = getDateRange(option);
      onDateRangeChange(range.from, range.to);
      setIsOpen(false);
    }
  };

  const handleCustomApply = () => {
    setSelectedOption('custom');
    onDateRangeChange(customRange.from, customRange.to);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDisplayText = () => {
    const labels: Record<string, string> = {
      all: 'All Time',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      last30: 'Last 30 Days',
      custom: `${formatDate(customRange.from)} - ${formatDate(customRange.to)}`,
    };
    return labels[selectedOption] || label;
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] hover:bg-[var(--c-border)] transition-colors flex items-center gap-2"
      >
        {getDisplayText()}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[var(--c-input)] border border-[var(--c-border)] rounded shadow-lg z-50 w-56">
          {!showCustom ? (
            <div className="p-2 space-y-1">
              {[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'thisWeek', label: 'This Week' },
                { value: 'thisMonth', label: 'This Month' },
                { value: 'last30', label: 'Last 30 Days' },
                { value: 'all', label: 'All Time' },
                { value: 'custom', label: 'Custom Range' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedOption === option.value
                      ? 'bg-red-600/20 text-red-400'
                      : 'text-[var(--c-text)] hover:bg-[var(--c-hover)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1">From Date</label>
                <input
                  type="date"
                  value={customRange.from?.toISOString().split('T')[0] || ''}
                  onChange={(e) =>
                    setCustomRange({
                      ...customRange,
                      from: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                  className="w-full px-2 py-1 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--c-text2)] mb-1">To Date</label>
                <input
                  type="date"
                  value={customRange.to?.toISOString().split('T')[0] || ''}
                  onChange={(e) =>
                    setCustomRange({
                      ...customRange,
                      to: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                  className="w-full px-2 py-1 bg-[var(--c-hover)] border border-[var(--c-border)] rounded text-[var(--c-text)] text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCustomApply}
                  className="flex-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowCustom(false);
                    setCustomRange({ from: null, to: null });
                  }}
                  className="flex-1 px-3 py-1 bg-[var(--c-hover)] text-[var(--c-text)] rounded text-sm hover:bg-[var(--c-border)] transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
