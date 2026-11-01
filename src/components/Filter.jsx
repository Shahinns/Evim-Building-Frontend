import React, { useState } from "react";

export default function Filter({ onFilter }) {
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    deal: "",
    buildingType: "",
    priceMin: "",
    priceMax: "",
    hasExtract: false,
    hasMortgage: false,
    rooms: "",
    renovation: "",
    areaMin: "",
    areaMax: "",
    floorMin: "",
    floorMax: "",
    notFirst: false,
    notTop: false,
    onlyTop: false,
    sellerType: "",
    adNumber: "",
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <h2>Ətraflı Axtarış</h2>

      <input
        type="text"
        name="location"
        placeholder="Rayon/Metro/Ünvan"
        value={filters.location}
        onChange={handleChange}
      />

      <select name="deal" value={filters.deal} onChange={handleChange}>
        <option value="">Alqı‑satqı növü</option>
        <option value="ALIS">Alış</option>
        <option value="KIRAYE">Kirayə</option>
      </select>

      <select name="type" value={filters.type} onChange={handleChange}>
        <option value="">Əmlakın növü</option>
        <option value="MENZIL">Mənzil</option>
        <option value="HEYET">Həyət evi/Bağ evi</option>
        <option value="OFIS">Ofis</option>
        <option value="QARAJ">Qaraj</option>
        <option value="TORPAQ">Torpaq</option>
        <option value="OBYEKT">Obyekt</option>
      </select>

      <select
        name="buildingType"
        value={filters.buildingType}
        onChange={handleChange}
      >
        <option value="">Tikilinin növü</option>
        <option value="YENI">Yeni tikili</option>
        <option value="KOHNE">Köhnə tikili</option>
      </select>

      <div className="range-group">
        <input
          type="number"
          name="priceMin"
          placeholder="Qiymət min"
          value={filters.priceMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Qiymət max"
          value={filters.priceMax}
          onChange={handleChange}
        />
      </div>

      <div className="checkboxes">
        <label>
          <input
            type="checkbox"
            name="hasExtract"
            checked={filters.hasExtract}
            onChange={handleChange}
          /> Çıxarış var
        </label>

        <label>
          <input
            type="checkbox"
            name="hasMortgage"
            checked={filters.hasMortgage}
            onChange={handleChange}
          /> İpoteka var
        </label>
      </div>

      <select name="rooms" value={filters.rooms} onChange={handleChange}>
        <option value="">Otaq sayı</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5+</option>
      </select>

      <select name="renovation" value={filters.renovation} onChange={handleChange}>
        <option value="">Təmir</option>
        <option value="ANY">Fərqi yoxdur</option>
        <option value="FIXED">Təmirli</option>
        <option value="NOT_FIXED">Təmirsiz</option>
      </select>

      <div className="range-group">
        <input
          type="number"
          name="areaMin"
          placeholder="Sahə min (m²)"
          value={filters.areaMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="areaMax"
          placeholder="Sahə max (m²)"
          value={filters.areaMax}
          onChange={handleChange}
        />
      </div>

      <div className="range-group">
        <input
          type="number"
          name="floorMin"
          placeholder="Mərtəbə min"
          value={filters.floorMin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="floorMax"
          placeholder="Mərtəbə max"
          value={filters.floorMax}
          onChange={handleChange}
        />
      </div>

      <label>
        <input
          type="checkbox"
          name="notFirst"
          checked={filters.notFirst}
          onChange={handleChange}
        /> 1‑ci olmasın
      </label>

      <label>
        <input
          type="checkbox"
          name="notTop"
          checked={filters.notTop}
          onChange={handleChange}
        /> Ən üst olmasın
      </label>

      <label>
        <input
          type="checkbox"
          name="onlyTop"
          checked={filters.onlyTop}
          onChange={handleChange}
        /> Yalnız ən üst
      </label>

      <select
        name="sellerType"
        value={filters.sellerType}
        onChange={handleChange}
      >
        <option value="">Satıcı</option>
        <option value="INDIVIDUAL">Fərdi</option>
        <option value="COMPANY">Tikinti şirkətləri</option>
      </select>

      <input
        type="text"
        name="adNumber"
        placeholder="Elanın nömrəsi"
        value={filters.adNumber}
        onChange={handleChange}
      />

      <button type="submit">Axtar</button>
    </form>
  );
}