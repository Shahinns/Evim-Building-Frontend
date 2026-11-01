import { useNavigate } from "react-router-dom";

function ListingCard({ item, featured }) {
  const navigate = useNavigate();
  const tag = getTag(item);
  const { imageUrl, imageCount } = resolveImages(item);

  return (
    <div
      className={`listing-card ${featured ? "listing-card--featured" : ""}`}
      onClick={() => navigate(`/listings/${item.id}`)}
      style={{ cursor: "pointer" }}
    >
      {featured && <span className="badge-featured">Seçilmiş</span>}

      <div className="card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={item.unvan} />
        ) : (
          <div className="card-image-placeholder" />
        )}
        {imageCount > 0 && (
          <span className="image-count">{imageCount} şəkil</span>
        )}
      </div>

      <div className="card-body">
        <div className="card-price-row">
          <span className="card-price">
            {item.qiymet?.toLocaleString()} ₼
            {item.satIcare && item.satIcare.trim().toUpperCase() === "KİRAYƏ" ? " / ay" : ""}
          </span>

          {tag.label && (
            <span
              className="card-tag"
              style={{ background: tag.bg, color: tag.color }}
            >
              {tag.label}
            </span>
          )}
        </div>

        <p className="card-location">{item.unvan}</p>

        <div className="card-meta">
          <span>{item.otaqSayi} otaq</span>
          <span className="sep">|</span>
          <span>{item.kvMetr} m²</span>
          <span className="sep">|</span>
          <span>
            {item.type === "HEYET" ||
            (item.emlakTipi && item.emlakTipi.toLowerCase().includes("həyət"))
              ? "Həyət evi"
              : `${item.mertebe ?? "—"}/${item.binaninMertebeSayi ?? "—"} mərtəbə`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
