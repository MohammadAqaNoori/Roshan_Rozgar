import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { WorkerCard, Disclaimer } from '../components/Shared';
import { CATS } from '../lib/data';

export default function Results({ onNavigate }) {
  const { t, workers, f, setFilter, toggleFilters, selectWorker, _fopen } = useApp();

  const filtered = () => {
    let list = [...workers];
    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter((w) => w.name.toLowerCase().includes(q) || w.area.toLowerCase().includes(q));
    }
    if (f.cat) list = list.filter((w) => w.cat === f.cat);
    if (f.availOnly) list = list.filter((w) => w.status === 'available');
    if (f.minRating) list = list.filter((w) => w.rating >= f.minRating);
    list = list.filter((w) => w.km <= f.dist);
    return list.sort((a, b) => a.km - b.km);
  };

  const list = filtered();
  const loading = false;

  return (
    <main className="appmain">
      <div className="wrap">
        <div className="row between wrapit" style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{t('Workers near you', 'قریب کے کاریگر')}</h1>
        </div>

        <button className="btn btn-outline btn-block only-sm" onClick={toggleFilters} aria-expanded={!!_fopen}>
          <Icon name="sliders" />
          {_fopen ? t('Hide filters', 'فلٹر چھپائیں') : t('Filters', 'فلٹر')}
          {(f.availOnly ? 1 : 0) + (f.minRating ? 1 : 0) + (f.dist < 10 ? 1 : 0) > 0 && (
            <span className="pill pill-info">{(f.availOnly ? 1 : 0) + (f.minRating ? 1 : 0) + (f.dist < 10 ? 1 : 0)}</span>
          )}
        </button>

        <div className="disc-layout">
          {/* Filters */}
          <aside className={`filters-panel${_fopen ? '' : ' closed'}`}>
            <div className="card">
              <div>
                <h4>{t('Distance', 'فاصلہ')}</h4>
                <input
                  type="range"
                  className="range"
                  min="1"
                  max="15"
                  value={f.dist}
                  onChange={(e) => setFilter({ dist: Number(e.target.value) })}
                />
                <div className="row between">
                  <span className="xs muted">{t('0 km', '۰ کلومیٹر')}</span>
                  <span className="xs muted num">{f.dist} km</span>
                </div>
              </div>
              <div>
                <h4>{t('Service', 'سروس')}</h4>
                <div className="row wrapit" style={{ gap: 6 }}>
                  {CATS.map((c) => (
                    <button
                      key={c.id}
                      className="chip"
                      aria-pressed={f.cat === c.id}
                      onClick={() => setFilter({ cat: f.cat === c.id ? '' : c.id })}
                    >
                      <Icon name={c.icon} />{t(c.en, c.fa)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4>{t('Minimum rating', 'کم از کم ریٹنگ')}</h4>
                <div className="row wrapit" style={{ gap: 6 }}>
                  {[0, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      className="chip"
                      aria-pressed={f.minRating === r}
                      onClick={() => setFilter({ minRating: r })}
                    >
                      {r === 0 ? t('Any', 'کوئی بھی') : `★ ${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="toggle-row">
                <h4>{t('Available only', 'صرف دستیاب')}</h4>
                <button
                  className="switch"
                  aria-checked={f.availOnly}
                  onClick={() => setFilter({ availOnly: !f.availOnly })}
                />
              </div>
              <button className="btn btn-outline btn-block btn-sm" onClick={() => setFilter({ q: '', cat: '', dist: 10, availOnly: false, minRating: 0 })}>
                {t('Clear filters', 'فلٹر صاف کریں')}
              </button>
            </div>
          </aside>

          {/* Results */}
          <section>
            {/* View toggle */}
            <div className="seg" style={{ background: 'var(--soft)', marginBottom: 14 }}>
              <button aria-pressed={f.view === 'list'} onClick={() => setFilter({ view: 'list' })}><Icon name="list" />{t('List', 'فہرست')}</button>
              <button aria-pressed={f.view === 'map'} onClick={() => setFilter({ view: 'map' })}><Icon name="map" />{t('Map', 'نقشہ')}</button>
            </div>

            {loading ? (
              <div className="results-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="wcard">
                    <div className="top">
                      <div className="skel" style={{ width: 64, height: 64, borderRadius: 18 }} />
                      <div className="grow stack" style={{ gap: 8 }}>
                        <div className="skel" style={{ height: 18, width: '70%' }} />
                        <div className="skel" style={{ height: 14, width: '50%' }} />
                      </div>
                    </div>
                    <div className="skel" style={{ height: 28, width: '40%' }} />
                    <div className="skel" style={{ height: 28, width: '60%' }} />
                  </div>
                ))}
              </div>
            ) : !list.length ? (
              <div className="card empty">
                <span className="tile"><Icon name="search" /></span>
                <h3>{t('No workers match these filters', 'ان فلٹرز پر کوئی نہیں ملا')}</h3>
                <p className="muted">{t('Try a wider distance or include busy workers.', 'فاصلہ بڑھائیں یا مصروف کاریگر بھی دکھائیں۔')}</p>
                <div className="row wrapit" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setFilter({ dist: 10 })}>{t('Widen to 10 km', '10 کلومیٹر تک بڑھائیں')}</button>
                  <button className="btn btn-outline" onClick={() => setFilter({ q: '', cat: '', dist: 10, availOnly: false, minRating: 0 })}>{t('Clear filters', 'فلٹر صاف کریں')}</button>
                </div>
              </div>
            ) : f.view === 'map' ? (
              <>
                <div className="mapbox">
                  <svg viewBox="0 0 600 500" style={{ width: '100%', height: 'auto' }}>
                    <rect width="600" height="500" fill="#EAF1EC" />
                    {/* Simplified streets */}
                    <g stroke="#CFE8DE" strokeWidth="3" fill="none">
                      <path d="M0 100h600M0 200h600M0 300h600M0 400h600" />
                      <path d="M100 0v500M200 0v500M300 0v500M400 0v500M500 0v500" />
                    </g>
                    {/* Sector labels */}
                    {list.slice(0, 6).map((w, i) => (
                      <g key={w.id}>
                        <circle cx={100 + i * 80} cy={100 + (i % 3) * 100} r="14" fill="#087F5B" stroke="#fff" strokeWidth="3" />
                        <text x={100 + i * 80} y={104} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{w.rating}</text>
                      </g>
                    ))}
                  </svg>
                  <div className="mapnote">
                    <Icon name="lock" />
                    <span>{t('Approximate sector only. Exact addresses are shared after a booking is confirmed. Tap a pin to open a profile.', 'صرف اندازاً سیکٹر۔ صحیح پتا بکنگ کے بعد۔')}</span>
                  </div>
                </div>
                <div className="results-grid" style={{ marginTop: 14 }}>
                  {list.slice(0, 3).map((w) => (
                    <WorkerCard key={w.id} w={w} onProfile={() => { selectWorker(w.id); onNavigate('profile'); }} onRequest={() => { selectWorker(w.id); onNavigate('request'); }} />
                  ))}
                </div>
              </>
            ) : (
              <div className="results-grid">
                {list.map((w) => (
                  <WorkerCard key={w.id} w={w} onProfile={() => { selectWorker(w.id); onNavigate('profile'); }} onRequest={() => { selectWorker(w.id); onNavigate('request'); }} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
