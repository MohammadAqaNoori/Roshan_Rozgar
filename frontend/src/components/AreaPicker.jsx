/**
 * AreaPicker — two-step Kabul district → neighborhood selector
 * plus flat cards for Herat, Mazar-i-Sharif, Kandahar.
 *
 * Props:
 *   lang        'en' | 'fa'
 *   value       current area object  { city, districtId, neighborhoodId, otherArea? }
 *   onChange    (areaObj) => void
 */
import { useState, useMemo } from 'react';
import { Icon } from '../lib/icons';
import { tr, toPersiDigits } from '../lib/i18n';
import { KABUL_DISTRICTS, OTHER_CITIES } from '../lib/kabulDistricts';

export function AreaPicker({ lang, value, onChange }) {
  const isFa = lang === 'fa';
  const s    = (key, vars) => tr(lang, key, vars);
  const num  = (n) => isFa ? toPersiDigits(n) : String(n);

  // Which Kabul district is expanded (step B), null = step A (district list)
  const [activeDistrict, setActiveDistrict] = useState(() => {
    if (value?.city === 'kabul' && value?.districtId) {
      return KABUL_DISTRICTS.find((d) => d.id === value.districtId) ?? null;
    }
    return null;
  });

  const [query, setQuery] = useState('');

  // ── helpers ────────────────────────────────────────────────────────────────
  const distName  = (d) => isFa ? d.name.prs        : d.name.en;
  const nbName    = (nb) => isFa ? nb.name.prs       : nb.name.en;
  const areaName  = (a) => isFa ? a.name.prs         : a.name.en;
  const cityLabel = (c) => isFa ? c.city.prs         : c.city.en;

  const isSelectedNb = (districtId, nbId) =>
    value?.city === 'kabul' &&
    value?.districtId === districtId &&
    value?.neighborhoodId === nbId;

  const isSelectedOther = (districtId) =>
    value?.city === 'kabul' &&
    value?.districtId === districtId &&
    value?.otherArea === true;

  const isSelectedCity = (areaId) =>
    value?.neighborhoodId === areaId && value?.city !== 'kabul';

  // ── search filter ──────────────────────────────────────────────────────────
  // Matches district name in either language, or any neighborhood name in either language
  const q = query.trim().toLowerCase();

  const filteredDistricts = useMemo(() => {
    if (!q) return KABUL_DISTRICTS;
    return KABUL_DISTRICTS.filter((d) => {
      const matchDist =
        d.name.en.toLowerCase().includes(q) ||
        d.name.prs.includes(q);
      const matchNb = d.neighborhoods.some(
        (nb) =>
          nb.name.en.toLowerCase().includes(q) ||
          nb.name.prs.includes(q),
      );
      return matchDist || matchNb;
    });
  }, [q]);

  // If a search narrows to exactly one district, auto-open it
  const autoOpenDistrict =
    q && filteredDistricts.length === 1 ? filteredDistricts[0] : null;
  const shownDistrict = activeDistrict ?? autoOpenDistrict;

  // ── select handlers ────────────────────────────────────────────────────────
  const pickNeighborhood = (district, nb) => {
    onChange({ city: 'kabul', districtId: district.id, neighborhoodId: nb.id });
  };

  const pickOther = (district) => {
    onChange({ city: 'kabul', districtId: district.id, neighborhoodId: null, otherArea: true });
  };

  const pickCityArea = (cityObj, area) => {
    onChange({ city: cityObj.cityId, districtId: null, neighborhoodId: area.id });
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="area-picker">

      {/* ── Search box ───────────────────────────────────────────────────── */}
      <div className="searchbar" style={{ marginTop: 14 }}>
        <Icon name="search" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveDistrict(null); }}
          placeholder={s('search-placeholder')}
          aria-label={s('search-placeholder')}
          dir={isFa ? 'rtl' : 'ltr'}
        />
        {query && (
          <button
            className="icon-btn"
            style={{ width: 36, height: 36 }}
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <Icon name="x" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Kabul section ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 18 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>{s('city-kabul')}</p>
        <p className="xs muted" style={{ marginBottom: 12 }}>
          {shownDistrict ? s('select-neighborhood') : s('kabul-districts-hint')}
        </p>

        {/* Step B — neighborhood list for a chosen district */}
        {shownDistrict ? (
          <>
            {/* Back button */}
            <button
              className="btn btn-outline btn-sm"
              style={{ marginBottom: 14 }}
              onClick={() => { setActiveDistrict(null); setQuery(''); }}
            >
              {/* In RTL this arrow naturally points right (back) */}
              <Icon name="arrowL" className="flip" aria-hidden="true" />
              {distName(shownDistrict)} — {s('back-to-districts')}
            </button>

            {/* Neighborhood cards */}
            <div className="area-grid">
              {shownDistrict.neighborhoods.map((nb) => {
                const sel = isSelectedNb(shownDistrict.id, nb.id);
                return (
                  <button
                    key={nb.id}
                    className={`area-card${sel ? ' area-card-sel' : ''}`}
                    aria-pressed={sel}
                    onClick={() => pickNeighborhood(shownDistrict, nb)}
                  >
                    <span className="area-card-name">{nbName(nb)}</span>
                  </button>
                );
              })}

              {/* "Other area in District N" */}
              <button
                className={`area-card area-card-other${isSelectedOther(shownDistrict.id) ? ' area-card-sel' : ''}`}
                aria-pressed={isSelectedOther(shownDistrict.id)}
                onClick={() => pickOther(shownDistrict)}
              >
                <span className="area-card-name">
                  {s('other-area', { district: distName(shownDistrict) })}
                </span>
              </button>
            </div>
          </>
        ) : (
          /* Step A — district grid */
          <div className="area-grid area-grid-districts">
            {filteredDistricts.map((d) => {
              const isDistSel =
                value?.city === 'kabul' && value?.districtId === d.id;
              return (
                <button
                  key={d.id}
                  className={`area-card${isDistSel ? ' area-card-sel' : ''}`}
                  aria-pressed={isDistSel}
                  onClick={() => setActiveDistrict(d)}
                >
                  <span className="area-card-name">{distName(d)}</span>
                  <span className="area-card-sub">
                    {s('neighborhood-count', { n: num(d.neighborhoods.length) })}
                  </span>
                </button>
              );
            })}

            {filteredDistricts.length === 0 && (
              <p className="muted small" style={{ gridColumn: '1/-1', padding: 12 }}>
                {isFa ? 'نتیجه‌ای یافت نشد.' : 'No results found.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Other cities ─────────────────────────────────────────────────── */}
      {!shownDistrict && (
        <div style={{ marginTop: 28 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>
            {s('other-cities-hint')}
          </p>
          {OTHER_CITIES.map((cityObj) => (
            <div key={cityObj.cityId} style={{ marginBottom: 18 }}>
              <p className="small muted" style={{ marginBottom: 8, fontWeight: 700 }}>
                {cityLabel(cityObj)}
              </p>
              <div className="area-grid">
                {cityObj.areas.map((a) => {
                  const sel = isSelectedCity(a.id);
                  return (
                    <button
                      key={a.id}
                      className={`area-card${sel ? ' area-card-sel' : ''}`}
                      aria-pressed={sel}
                      onClick={() => pickCityArea(cityObj, a)}
                    >
                      <span className="area-card-name">{areaName(a)}</span>
                      <span className="area-card-sub">{cityLabel(cityObj)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
