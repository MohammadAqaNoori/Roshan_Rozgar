/**
 * Kabul administrative districts (22) with neighborhoods.
 * Each district: { id, name: {en, prs}, neighborhoods: [{id, name: {en, prs}}] }
 * neighborhood.id is a stable slug used for saving — never changes.
 */
export const KABUL_DISTRICTS = [
  {
    id: 1,
    name: { en: 'District 1', prs: 'ناحیه اول' },
    neighborhoods: [
      { id: 'chindawol',      name: { en: 'Chindawol',      prs: 'چنداول'      } },
      { id: 'kharabat',       name: { en: 'Kharabat',       prs: 'خرابات'      } },
      { id: 'jadeh-maiwand',  name: { en: 'Jadeh Maiwand',  prs: 'جاده میوند'  } },
      { id: 'shor-bazaar',    name: { en: 'Shor Bazaar',    prs: 'شوربازار'    } },
    ],
  },
  {
    id: 2,
    name: { en: 'District 2', prs: 'ناحیه دوم' },
    neighborhoods: [
      { id: 'andarabi',      name: { en: 'Andarabi',      prs: 'اندرابی'    } },
      { id: 'bagh-e-bala',   name: { en: 'Bagh-e-Bala',   prs: 'باغ بالا'   } },
      { id: 'deh-afghanan',  name: { en: 'Deh Afghanan',  prs: 'ده افغانان' } },
      { id: 'murad-khani',   name: { en: 'Murad Khani',   prs: 'مرادخانی'   } },
    ],
  },
  {
    id: 3,
    name: { en: 'District 3', prs: 'ناحیه سوم' },
    neighborhoods: [
      { id: 'deh-bori',   name: { en: 'Deh Bori',   prs: 'ده‌بوری'    } },
      { id: 'deh-mazang', name: { en: 'Deh Mazang', prs: 'ده‌مزنگ'    } },
      { id: 'karte-char', name: { en: 'Karte Char', prs: 'کارته چهار' } },
      { id: 'jamal-mina', name: { en: 'Jamal Mina', prs: 'جمال مینه'  } },
    ],
  },
  {
    id: 4,
    name: { en: 'District 4', prs: 'ناحیه چهارم' },
    neighborhoods: [
      { id: 'shahr-e-naw',   name: { en: 'Shahr-e-Naw',   prs: 'شهر نو'     } },
      { id: 'taimani',       name: { en: 'Taimani',        prs: 'تایمنی'     } },
      { id: 'shahrara',      name: { en: 'Shahrara',       prs: 'شهرآرا'     } },
      { id: 'qala-e-pasht',  name: { en: 'Qala-e-Pasht',  prs: 'قلعه پشته'  } },
    ],
  },
  {
    id: 5,
    name: { en: 'District 5', prs: 'ناحیه پنجم' },
    neighborhoods: [
      { id: 'afshar',            name: { en: 'Afshar',            prs: 'افشار'            } },
      { id: 'khushal-khan-mina', name: { en: 'Khushal Khan Mina', prs: 'خوشحال خان مینه'  } },
      { id: 'kote-sangi',        name: { en: 'Kote Sangi',        prs: 'کوته سنگی'        } },
    ],
  },
  {
    id: 6,
    name: { en: 'District 6', prs: 'ناحیه ششم' },
    neighborhoods: [
      { id: 'darul-aman',   name: { en: 'Darul Aman',   prs: 'دارالامان'  } },
      { id: 'karte-seh',    name: { en: 'Karte Seh',    prs: 'کارته سه'   } },
      { id: 'qala-e-shada', name: { en: 'Qala-e-Shada', prs: 'قلعه شاده' } },
    ],
  },
  {
    id: 7,
    name: { en: 'District 7', prs: 'ناحیه هفتم' },
    neighborhoods: [
      { id: 'chihil-sutoon', name: { en: 'Chihil Sutoon', prs: 'چهلستون' } },
      { id: 'deh-dana',      name: { en: 'Deh Dana',      prs: 'ده‌دانا'  } },
      { id: 'guzargah',      name: { en: 'Guzargah',      prs: 'گذرگاه'  } },
    ],
  },
  {
    id: 8,
    name: { en: 'District 8', prs: 'ناحیه هشتم' },
    neighborhoods: [
      { id: 'karte-naw',   name: { en: 'Karte Naw',   prs: 'کارته نو'  } },
      { id: 'rahman-mina', name: { en: 'Rahman Mina', prs: 'رحمان مینه' } },
      { id: 'qala-che',    name: { en: 'Qala Che',    prs: 'قلعه‌چه'    } },
    ],
  },
  {
    id: 9,
    name: { en: 'District 9', prs: 'ناحیه نهم' },
    neighborhoods: [
      { id: 'macroyan',  name: { en: 'Macroyan',  prs: 'مکروریان'  } },
      { id: 'yaka-toot', name: { en: 'Yaka Toot', prs: 'یاکه توت'  } },
    ],
  },
  {
    id: 10,
    name: { en: 'District 10', prs: 'ناحیه دهم' },
    neighborhoods: [
      { id: 'wazir-akbar-khan',  name: { en: 'Wazir Akbar Khan',  prs: 'وزیر اکبر خان'  } },
      { id: 'sherpur',           name: { en: 'Sherpur',           prs: 'شیرپور'          } },
      { id: 'qala-e-fathullah',  name: { en: 'Qala-e-Fathullah', prs: 'قلعه فتح‌الله'   } },
      { id: 'bibi-mahro',        name: { en: 'Bibi Mahro',        prs: 'بی‌بی مهرو'      } },
    ],
  },
  {
    id: 11,
    name: { en: 'District 11', prs: 'ناحیه یازدهم' },
    neighborhoods: [
      { id: 'khair-khana',       name: { en: 'Khair Khana',       prs: 'خیرخانه'       } },
      { id: 'qala-e-najjarha',   name: { en: 'Qala-e-Najjarha',  prs: 'قلعه نجارها'   } },
    ],
  },
  {
    id: 12,
    name: { en: 'District 12', prs: 'ناحیه دوازدهم' },
    neighborhoods: [
      { id: 'ahmad-shah-baba-mina', name: { en: 'Ahmad Shah Baba Mina', prs: 'احمدشاه بابا مینه' } },
      { id: 'arzan-qemat',          name: { en: 'Arzan Qemat',          prs: 'ارزان قیمت'        } },
      { id: 'bagrami',              name: { en: 'Bagrami',              prs: 'بگرامی'            } },
    ],
  },
  {
    id: 13,
    name: { en: 'District 13', prs: 'ناحیه سیزدهم' },
    neighborhoods: [
      { id: 'dasht-e-barchi',  name: { en: 'Dasht-e-Barchi',  prs: 'دشت برچی'    } },
      { id: 'bist-hazaragi',   name: { en: 'Bist Hazaragi',   prs: 'بیست‌هزارگی' } },
      { id: 'omid-sabz',       name: { en: 'Omid Sabz',       prs: 'امید سبز'    } },
    ],
  },
  {
    id: 14,
    name: { en: 'District 14', prs: 'ناحیه چهاردهم' },
    neighborhoods: [
      { id: 'paghman', name: { en: 'Paghman', prs: 'پغمان' } },
    ],
  },
  {
    id: 15,
    name: { en: 'District 15', prs: 'ناحیه پانزدهم' },
    neighborhoods: [
      { id: 'khwaja-bughra',  name: { en: 'Khwaja Bughra',  prs: 'خواجه بغرا'  } },
      { id: 'khwaja-rawash',  name: { en: 'Khwaja Rawash',  prs: 'خواجه رواش'  } },
      { id: 'qasaba',         name: { en: 'Qasaba',         prs: 'قصبه'        } },
    ],
  },
  {
    id: 16,
    name: { en: 'District 16', prs: 'ناحیه شانزدهم' },
    neighborhoods: [
      { id: 'qala-e-zaman-khan', name: { en: 'Qala-e-Zaman Khan', prs: 'قلعه زمان خان' } },
      { id: 'samant-khana',      name: { en: 'Samant Khana',      prs: 'سمنت خانه'    } },
    ],
  },
  {
    id: 17,
    name: { en: 'District 17', prs: 'ناحیه هفدهم' },
    neighborhoods: [
      { id: 'shakardara', name: { en: 'Shakardara', prs: 'شکردره' } },
    ],
  },
  {
    id: 18,
    name: { en: 'District 18', prs: 'ناحیه هجدهم' },
    neighborhoods: [
      { id: 'deh-sabz',  name: { en: 'Deh Sabz',  prs: 'ده‌سبز'   } },
      { id: 'tarakhil',  name: { en: 'Tarakhil',   prs: 'تره‌خیل'  } },
    ],
  },
  {
    id: 19,
    name: { en: 'District 19', prs: 'ناحیه نزدهم' },
    neighborhoods: [
      { id: 'pul-e-charkhi', name: { en: 'Pul-e-Charkhi', prs: 'پلچرخی' } },
    ],
  },
  {
    id: 20,
    name: { en: 'District 20', prs: 'ناحیه بیستم' },
    neighborhoods: [
      { id: 'chahar-asiab', name: { en: 'Chahar Asiab', prs: 'چهارآسیاب' } },
    ],
  },
  {
    id: 21,
    name: { en: 'District 21', prs: 'ناحیه بیست‌ویکم' },
    neighborhoods: [
      { id: 'hoot-khail', name: { en: 'Hoot Khail', prs: 'هودخیل' } },
    ],
  },
  {
    id: 22,
    name: { en: 'District 22', prs: 'ناحیه بیست‌ودوم' },
    neighborhoods: [
      { id: 'shiwaki', name: { en: 'Shiwaki', prs: 'شیوکی' } },
    ],
  },
];

/**
 * OTHER_CITIES — non-Kabul cities with their existing areas.
 * Each area: { id (stable slug), name: {en, prs}, city: {en, prs} }
 */
export const OTHER_CITIES = [
  {
    cityId:  'herat',
    city:    { en: 'Herat', prs: 'هرات' },
    areas: [
      { id: 'herat-city', name: { en: 'Herat City', prs: 'شهر هرات'  } },
      { id: 'injil',      name: { en: 'Injil',      prs: 'انجیل'     } },
    ],
  },
  {
    cityId:  'mazar',
    city:    { en: 'Mazar-i-Sharif', prs: 'مزار شریف' },
    areas: [
      { id: 'mazar-city', name: { en: 'Mazar City', prs: 'شهر مزار'  } },
      { id: 'balkh',      name: { en: 'Balkh',      prs: 'بلخ'       } },
    ],
  },
  {
    cityId:  'kandahar',
    city:    { en: 'Kandahar', prs: 'کندهار' },
    areas: [
      { id: 'kandahar-city', name: { en: 'Kandahar City', prs: 'شهر کندهار' } },
      { id: 'dand',          name: { en: 'Dand',          prs: 'دند'         } },
    ],
  },
];

/**
 * lookupNeighborhood(neighborhoodId)
 * Returns { district, neighborhood } or null.
 */
export function lookupNeighborhood(neighborhoodId) {
  for (const d of KABUL_DISTRICTS) {
    const n = d.neighborhoods.find((nb) => nb.id === neighborhoodId);
    if (n) return { district: d, neighborhood: n };
  }
  return null;
}

/**
 * formatAreaLabel(areaObj, lang)
 * areaObj: { city, districtId, neighborhoodId, otherArea }
 * Returns a human-readable label in the given language.
 */
export function formatAreaLabel(areaObj, lang) {
  if (!areaObj) return '';
  const isFa = lang === 'fa';

  // Kabul district/neighborhood
  if (areaObj.city === 'kabul' && areaObj.districtId) {
    const dist = KABUL_DISTRICTS.find((d) => d.id === areaObj.districtId);
    if (!dist) return isFa ? 'کابل' : 'Kabul';
    const distName = isFa ? dist.name.prs : dist.name.en;
    if (areaObj.otherArea) {
      return isFa
        ? `${distName}، کابل`
        : `${distName}, Kabul`;
    }
    const nb = dist.neighborhoods.find((n) => n.id === areaObj.neighborhoodId);
    const nbName = nb ? (isFa ? nb.name.prs : nb.name.en) : '';
    return isFa
      ? `${nbName}، ${distName}، کابل`
      : `${nbName}, ${distName}, Kabul`;
  }

  // Other cities
  for (const c of OTHER_CITIES) {
    for (const a of c.areas) {
      if (a.id === areaObj.neighborhoodId) {
        const cityName = isFa ? c.city.prs : c.city.en;
        const areaName = isFa ? a.name.prs : a.name.en;
        return isFa ? `${areaName}، ${cityName}` : `${areaName}, ${cityName}`;
      }
    }
  }

  // Legacy string fallback (old data before this feature)
  if (typeof areaObj === 'string') return areaObj;
  return '';
}

/**
 * migrateOldArea(oldAreaString)
 * Maps old string-based area values to the new {city,districtId,neighborhoodId} shape.
 * Returns null if no match found (keep the old string as-is).
 */
export function migrateOldArea(oldArea) {
  if (!oldArea || typeof oldArea === 'object') return oldArea;
  const MAP = {
    'Shahr-e-Naw':     { city: 'kabul', districtId: 4,  neighborhoodId: 'shahr-e-naw'      },
    'Karte Seh':       { city: 'kabul', districtId: 6,  neighborhoodId: 'karte-seh'         },
    'Macroyan':        { city: 'kabul', districtId: 9,  neighborhoodId: 'macroyan'          },
    'Wazir Akbar Khan':{ city: 'kabul', districtId: 10, neighborhoodId: 'wazir-akbar-khan'  },
    'Khair Khana':     { city: 'kabul', districtId: 11, neighborhoodId: 'khair-khana'       },
    'Pul-e-Charkhi':   { city: 'kabul', districtId: 19, neighborhoodId: 'pul-e-charkhi'     },
    'Herat City':      { city: 'herat',     districtId: null, neighborhoodId: 'herat-city'  },
    'Injil':           { city: 'herat',     districtId: null, neighborhoodId: 'injil'        },
    'Mazar City':      { city: 'mazar',     districtId: null, neighborhoodId: 'mazar-city'  },
    'Balkh':           { city: 'mazar',     districtId: null, neighborhoodId: 'balkh'        },
    'Kandahar City':   { city: 'kandahar',  districtId: null, neighborhoodId: 'kandahar-city'},
    'Dand':            { city: 'kandahar',  districtId: null, neighborhoodId: 'dand'         },
  };
  return MAP[oldArea] ?? null;
}
