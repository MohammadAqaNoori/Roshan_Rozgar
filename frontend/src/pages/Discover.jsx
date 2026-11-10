import { Icon } from '../lib/icons';
import { useApp } from '../context/AppContext';
import { WorkerCard, Disclaimer } from '../components/Shared';
import { CATS } from '../lib/data';

export default function Discover({ onNavigate }) {
  const { t, workers, f, setFilter, selectWorker } = useApp();

  const nearby = workers.filter((w) => w.status === 'available').sort((a, b) => a.km - b.km).slice(0, 4);

  return (
    <main className="appmain">
      <div className="wrap stack" style={{ gap: 22 }}>
        {/* Search bar */}
        <div className="searchbar">
          <Icon name="search" />
          <input
            placeholder={t('Search workers, trades…', 'کاریگر تلاش کریں…')}
            value={f.q}
            onChange={(e) => setFilter({ q: e.target.value })}
          />
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('results')}>
            {t('Search', 'تلاش')}
          </button>
        </div>

        {/* Location bar */}
        <div className="locbar">
          <Icon name="pin" />
          <span className="grow">{t('G-11/2, Islamabad', 'جی الیون، اسلام آباد')}</span>
          <button className="btn btn-ghost btn-sm"><Icon name="nav" /></button>
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
              {t(c.en, c.ur)}
            </button>
          ))}
        </div>

        {/* Nearby workers */}
        <section>
          <div className="sect-title">
            <h2>{t('Available near you', 'آپ کے قریب دستیاب')}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('results')}>
              {t('See all', 'سب دیکھیں')}<Icon name="arrowR" className="flip" />
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
          {t('Distance and rating help you choose, but they don\u2019t guarantee safety or quality. Check reviews and agree the price before work starts.', 'فاصلہ اور ریٹنگ مددگار ہیں مگر حفاظت یا معیار کی ضمانت نہیں۔')}
        </Disclaimer>
      </div>
    </main>
  );
}
