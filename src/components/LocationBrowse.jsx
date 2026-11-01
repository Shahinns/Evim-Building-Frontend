import React, { useState } from "react";
import { BAKU_RAYONS, BAKU_METROS, BAKU_QESEBELER, NAXCIVAN_AREAS } from "./FilterDrawer";
import "../styles/LocationBrowse.css";

export default function LocationBrowse({ onSelect }) {
  const [city, setCity] = useState("Bakı");
  const [tab, setTab] = useState("rayon");

  const groups = city === "Bakı"
    ? [
        { id: "rayon", title: "Rayonlar", items: BAKU_RAYONS },
        { id: "metro", title: "Metrolar", items: BAKU_METROS },
        { id: "nishangah", title: "Nişangahlar", items: BAKU_QESEBELER },
      ]
    : [
        { id: "rayon", title: "Ərazilər", items: NAXCIVAN_AREAS },
        { id: "metro", title: "Mərkəzi yerlər", items: ["Saat meydanı ətrafı", "4 yol ətrafı", "Avtovağzal ətrafı"] },
        { id: "nishangah", title: "Nişangahlar", items: ["Cahan gənclər şəhərciyi", "Ümid Gənclər şəhərciyi", "Şəhər ətrafı"] },
      ];

  const active = groups.find((g) => g.id === tab) || groups[0];

  return (
    <section className="loc-browse desktop-only">
      <div className="loc-browse-inner">
        <div className="loc-browse-head">
          <h2>Rayon, metro və nişangah</h2>
          <div className="loc-city-tabs">
            {["Bakı", "Naxçıvan"].map((c) => (
              <button key={c} type="button" className={city === c ? "active" : ""} onClick={() => { setCity(c); setTab("rayon"); }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="loc-type-tabs">
          {groups.map((g) => (
            <button key={g.id} type="button" className={tab === g.id ? "active" : ""} onClick={() => setTab(g.id)}>
              {g.title}
            </button>
          ))}
        </div>
        <div className="loc-columns">
          {active.items.map((item) => (
            <button key={item} type="button" className="loc-link" onClick={() => onSelect?.(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
