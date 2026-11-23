import { useState, useEffect } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { WorkerCard, Disclaimer } from '../components/Shared';
import { CATS } from '../lib/data';

// Leaflet map — loaded only when map view is active
let MapContainer, TileLayer, Marker, Popup;
let leafletReady = false;

async function loadLeaflet() {
  if (leafletReady) return true;
  try {
    const [leaflet, reactLeaflet] = await Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]);
    L = leaflet.default;
    // Fix default marker icon path broken by bundlers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    MapContainer  = reactLeaflet.MapContainer;
    TileLayer     = reactLeaflet.TileLayer;
    Marker        = reactLeaflet.Marker;
    Popup         = reactLeaflet.Popup;
    leafletReady  = true;
    return true;
  } catch {
    return false;
  }
}

export default function Results({ onNavigate }) {
  const { t, workers, f, setFilter, toggleFilters, selectWorker, _fopen, liveMode, loadWorkers } = useApp();
  const [mapReady, setMapReady] = useState(false);

  // Reload from API when in live mode and map view opened
  useEffect(() => {
    if (liveMode && f.view === 'map' && loadWorkers) {
      loadWorkers(34.5260, 69.1781, {
        trade: f.cat || undefined,
        radius_km: f.dist || 50,
        available_only: false,
      });
    }
    if (f.view === 'map' && !mapReady) {
      loadLeaflet().then((ok) => setMapReady(ok));
    }
  }, [f.view]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <h1 style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{t('Workers near you', 'کاریگران نزدیک شما')}</h1>
        </div>

        <button className="btn btn-outline btn-block only-sm" onClick={toggleFilters} aria-expanded={!!_fopen}>
          <Icon name="sliders" />
          {_fopen ? t('Hide filters', 'پنهان کردن فیلترها') : t('Filters', 'فیلترها')}
          {(f.availOnly ? 1 : 0) + (f.minRating ? 1 : 0) + (f.dist < 10 ? 1 : 0) > 0 && (
            <span className="pill pill-info">{(f.availOnly ? 1 : 0) + (f.minRating ? 1 : 0) + (f.dist < 10 ? 1 : 0)}</span>
          )}
        </button>

        <div className="disc-layout">
          {/* Filters */}
          <aside className={`filters-panel${_fopen ? '' : ' closed'}`}>
            <div className="card">
              <div>
                <h4>{t('Distance', 'فاصله')}</h4>
                <input
                  type="range"
                  className="range"
                  min="1"
                  max="15"
                  value={f.dist}
                  onChange={(e) => setFilter({ dist: Number(e.target.value) })}
                />
                <div className="row between">
                  <span className="xs muted">{t('0 km', '۰ کیلومتر')}</span>
                  <span className="xs muted num">{f.dist} km</span>
                </div>
              </div>
              <div>
                <h4>{t('Service', 'خدمت')}</h4>
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
                <h4>{t('Minimum rating', 'حداقل امتیاز')}</h4>
                <div className="row wrapit" style={{ gap: 6 }}>
                  {[0, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      className="chip"
                      aria-pressed={f.minRating === r}
                      onClick={() => setFilter({ minRating: r })}
                    >
                      {r === 0 ? t('Any', 'هر امتیازی') : `★ ${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="toggle-row">
                <h4>{t('Available only', 'فقط در دسترس')}</h4>
                <button
                  className="switch"
                  aria-checked={f.availOnly}
                  onClick={() => setFilter({ availOnly: !f.availOnly })}
                />
              </div>
              <button className="btn btn-outline btn-block btn-sm" onClick={() => setFilter({ q: '', cat: '', dist: 10, availOnly: false, minRating: 0 })}>
                {t('Clear filters', 'پاک کردن فیلترها')}
              </button>
            </div>
          </aside>

          {/* Results */}
          <section>
            {/* View toggle */}
            <div className="seg" style={{ background: 'var(--soft)', marginBottom: 14 }}>
              <button aria-pressed={f.view === 'list'} onClick={() => setFilter({ view: 'list' })}><Icon name="list" />{t('List', 'فهرست')}</button>
              <button aria-pressed={f.view === 'map'} onClick={() => setFilter({ view: 'map' })}><Icon name="map" />{t('Map', 'نقشه')}</button>
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
                <h3>{t('No workers match these filters', 'هیچ کاریگری با این فیلترها یافت نشد')}</h3>
                <p className="muted">{t('Try a wider distance or include busy workers.', 'فاصله را بیشتر کنید یا کاریگران مشغول را هم نشان دهید.')}</p>
                <div className="row wrapit" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setFilter({ dist: 10 })}>{t('Widen to 10 km', 'گسترش به ۱۰ کیلومتر')}</button>
                  <button className="btn btn-outline" onClick={() => setFilter({ q: '', cat: '', dist: 10, availOnly: false, minRating: 0 })}>{t('Clear filters', 'پاک کردن فیلترها')}</button>
                </div>
              </div>
            ) : f.view === 'map' ? (
              <>
                {mapReady && MapContainer ? (
                  <div className="mapbox" style={{ height: 420, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)' }}>
                    <MapContainer
                      center={[34.5260, 69.1781]}
                      zoom={12}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      {list.filter(w => w.lat && w.lng).map((w) => (
                        <Marker key={w.id} position={[w.lat, w.lng]}>
                          <Popup>
                            <div style={{ minWidth: 160 }}>
                              <b style={{ display: 'block', fontSize: 14 }}>{w.name}</b>
                              <span style={{ fontSize: 12, color: '#5E6A66' }}>{w.cat} · ★ {w.rating}</span>
                              <br />
                              <span style={{ fontSize: 12 }}>{w.area}</span>
                              <br />
                              <button
                                style={{ marginTop: 8, padding: '4px 10px', background: '#006400', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
                                onClick={() => { selectWorker(w.id); onNavigate('profile'); }}
                              >
                                View profile
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                    <div className="mapnote">
                      <Icon name="lock" />
                      <span>{t('Approximate location only. Exact address shared after booking confirmed.', 'فقط موقعیت تقریبی. آدرس دقیق پس از تأیید رزرو.')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mapbox" style={{ height: 300, display: 'grid', placeItems: 'center', borderRadius: 20, border: '1px solid var(--line)', background: '#EAF1EC' }}>
                    <div className="stack" style={{ alignItems: 'center', gap: 10 }}>
                      <div className="skel" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                      <span className="muted small">{t('Loading map…', 'در حال بارگذاری نقشه…')}</span>
                    </div>
                  </div>
                )}
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
