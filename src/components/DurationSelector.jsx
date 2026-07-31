import "./DurationSelector.css";

export const RANGE_PRESETS = [
  { key: "1d", label: "24H", days: 1 },
  { key: "7d", label: "7D", days: 7 },
  { key: "14d", label: "14D", days: 14 },
  { key: "21d", label: "21D", days: 21 },
  { key: "1m", label: "1M", days: 30 },
  { key: "3m", label: "3M", days: 90 },
  { key: "6m", label: "6M", days: 180 },
  { key: "1y", label: "1Y", days: 365 },
  { key: "2y", label: "2Y", days: 730 },
  { key: "3y", label: "3Y", days: 1095 },
  { key: "5y", label: "5Y", days: 1825 },
  { key: "10y", label: "10Y", days: 3650 },
];

export const PRESET_MAP = Object.fromEntries(
  RANGE_PRESETS.map((p) => [p.key, p]),
);

const today = () => new Date().toISOString().slice(0, 10);

export const DurationSelector = ({
  value,
  onChange,
  customFrom,
  customTo,
  onCustomChange,
  minDate,
  maxDays,
}) => {
  const isCustom = value === "custom";

  return (
    <div className="duration-selector">
      <div className="duration-presets">
        {RANGE_PRESETS.map((p) => {
          const disabled = maxDays != null && p.days > maxDays;

          return (
            <button
              key={p.key}
              className={`duration-btn ${value === p.key ? "active" : ""} ${disabled ? "disabled" : ""}`}
              disabled={disabled}
              title={disabled ? "Not enough price history for this range" : undefined}
              onClick={() => onChange(p.key)}
            >
              {p.label}
            </button>
          );
        })}
        <button
          className={`duration-btn ${isCustom ? "active" : ""}`}
          onClick={() => onChange("custom")}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div className="duration-custom">
          <label>
            From
            <input
              type="date"
              value={customFrom}
              min={minDate || undefined}
              max={customTo || today()}
              onChange={(e) => onCustomChange("from", e.target.value)}
            />
          </label>

          <label>
            To
            <input
              type="date"
              value={customTo}
              min={customFrom || minDate || undefined}
              max={today()}
              onChange={(e) => onCustomChange("to", e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
};