import { useState, useEffect } from 'react';
import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { WorkerCard, Disclaimer } from '../components/Shared';
import { CATS } from '../lib/data';

// Default Kabul coordinates for when geolocation is unavailable
const KABUL_LAT = 34.5260;
const KABUL_LNG = 69.1781;

export default function Discover({ onNavigate }) {
  const { t, workers, f, setFilter, selectWorker, liveMode, loadWorkers } = useApp();
  const [locationLabel, setLocationLabel] = useState(t('Shahr-e-Naw, Kabul', 'شهر نو، کابل'));
  const [locating, setLocating] = useState(false);

  // Load workers from backend when in live mode
  useEffect(() => {
    if (liveMode && loadWorkers) {
      loadWorkers(KABUL_LAT, KABUL_LNG, {
        trade: f.cat || undefined,
        radius_km: f.dist || 50,
        available_only: f.availOnly || false,
      });
    }
  }, [liveMode, f.cat, f.dist, f.availOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload when filter category changes in live mode
  useEffect(() => {
    if (liveMode && loadWorkers) {
      loadWorkers(KABUL_LAT, KABUL_LNG, {
        trade: f.cat || undefined,
        radius_km: f.dist || 50,
        available_only: f.availOnly || false,
      });
    }
  }, [f.cat]); // eslint-disable-line react-hooks/exhaustive-deps

  const nearby = workers.filter((w) => w.status === 'available').sort((a, b) => a.km - b.km).slice(0, 4);

  const handleLocate = () => {
    if (liveMode && loadWorkers) {
      // Live mode: get GPS and load real workers
      if (!navigator.geolocation) {
        loadWorkers(KABUL_LAT, KABUL_LNG, { trade: f.cat || undefined, radius_km: f.dist || 50 });
        return;
      }
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          const { latitude, longitude } = pos.coords;
          setLocationLabel(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          loadWorkers(latitude, longitude, { trade: f.cat || undefined, radius_km: f.dist || 50 });
        },
        () => {
          setLocating(false);
          loadWorkers(KABUL_LAT, KABUL_LNG, { trade: f.cat || undefined, radius_km: f.dist || 50 });
        },
        { timeout: 8000 }
      );
      return;
    }
    // Demo mode: just show coordinates
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        setLocationLabel(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      },
      () => {
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 22 }}>
        {/* Search bar */}
        <div className="searchbar">
          <Icon name="search" />
          <input
            placeholder={t('Search workers, trades…', 'جستجوی کاریگر، حرفه‌ها…')}
            value={f.q}
            onChange={(e) => setFilter({ q: e.target.value })}
          />
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('results')}>
            {t('Search', 'جستجو')}
          </button>
        </div>

        {/* Location bar */}
        <div className="locbar">
          <Icon name="pin" />
          <span className="grow">{locationLabel}</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLocate}
            disabled={locating}
            aria-label="Use my location"
          >
            {locating ? <Icon name="refresh" /> : <Icon name="nav" />}
          </button>
        </div>

        {/* Category scroller */}
        <div className="cat-row">
          {CATS.map((c) => (
            <button
              key={c.id}
              className={`cat${f.cat === c.id ? ' pressed' : ''}`}
              onClick={() => setFilter({ cat: c.id })}
            >
              <span className="tile"><Icon name={c.icon} /></span>
              {t(c.en, c.fa)}
            </button>
          ))}
        </div>

        {/* Nearby workers */}
        <section>
          <div className="sect-title">
            <h2>{t('Available near you', 'کاریگران در دسترس نزدیک شما')}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('results')}>
              {t('See all', 'همه را ببینید')}<Icon name="arrowR" className="flip" />
            </button>
          </div>
          <div className="results-grid">
            {nearby.map((w) => (
              <WorkerCard
                key={w.id}
                w={w}
                onProfile={() => { selectWorker(w.id); onNavigate('profile'); }}
                onRequest={() => { selectWorker(w.id); onNavigate('request'); }}
              />
            ))}
          </div>
        </section>

        <Disclaimer>
          {t('Distance and rating help you choose, but they don\u2019t guarantee safety or quality. Check reviews and agree the price before work starts.', 'فاصله و امتیاز کمک می‌کنند انتخاب کنید، اما ضمانت ایمنی یا کیفیت نیستند. نظرات را بررسی کنید و قبل از شروع کار قیمت را توافق کنید.')}
        </Disclaimer>
      </div>
    </main>
  );
}
