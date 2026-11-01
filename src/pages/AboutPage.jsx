import React from "react";
import Navbar from "../components/Navbar";
import "../styles/HomePage.css";
import "../styles/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="page">
      <Navbar />
      <main className="about-main">
        <header className="about-hero">
          <h1 className="about-title">Haqqımızda</h1>
          <p className="about-lead">
            NaxEv.az Naxçıvanda alqı-satqı və kirayə elanlarını bir yerdə toplayan, axtarışı sadələşdirən
            əmlak platformasıdır.
          </p>
        </header>

        <section className="about-section">
          <h2 className="about-h2">Biz kimik</h2>
          <p className="about-p">
            Məqsədimiz yerli bazar üçün aydın, rahat və sürətli təcrübə yaratmaqdır. İstifadəçilər
            məhəllə, qiymət, otaq sayı və təmir vəziyyətinə görə elanları süzə, bütün aktiv təkliflərə
            isə bir kliklə baxa bilərlər.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-h2">Nə təklif edirik</h2>
          <ul className="about-list">
            <li>Geniş filtr və axtarış imkanları</li>
            <li>Bütün elanların vahid siyahıda göstərilməsi</li>
            <li>Şəxsi hesab ilə giriş və gələcəkdə genişləndirilə bilən funksiyalar</li>
          </ul>
        </section>

        <section className="about-section">
          <h2 className="about-h2">Necə işləyir</h2>
          <ol className="about-steps">
            <li><span className="about-step-num">1</span> Ana səhifədə bütün elanlara baxın.</li>
            <li><span className="about-step-num">2</span> Filtrləri seçib uyğun evi tapın.</li>
             <li><span className="about-step-num">3</span>Axtar düyməsinin yanındakı 3 xətti seçərək daha geniş filtr imkanları ilə axtarış edin </li>
            <li><span className="about-step-num">4</span> Əlaqə üçün elandakı məlumatdan istifadə edin (əlavə funksiyalar tədricən əlavə oluna bilər).</li>
          </ol>
        </section>

        <section className="about-section">
          <h2 className="about-h2">Əlaqə</h2>
          <p className="about-p">
            Təklif, əməkdaşlıq və ya texniki suallar üçün bizə yazın:
          </p>
          <div className="about-contact">
            <a href="mailto:info@naxev.az" className="about-link">info@naxev.az</a>
            <span className="about-contact-sep">·</span>
            <a href="mailto:destek@naxev.az" className="about-link">destek@naxev.az</a>
          </div>
          <p className="about-note">
            Ünvan və telefon nömrənizi təsdiqlədikdən sonra burada dərc edə bilərsiniz.
          </p>
        </section>

        <section className="about-section about-section--muted">
          <h2 className="about-h2">Qeyd</h2>
          <p className="about-p about-p--small">
            Platformada yerləşdirilən elanların hüquqi və faktiki düzgünlüyünə görə məsuliyyət elan
            yerləşdirən tərəfə aiddir. Alqı-satqı və ya kirayə müqaviləsini imzalamazdan əvvəl
            obyekti yerində yoxlamağı tövsiyə edirik.
          </p>
        </section>
      </main>
    </div>
  );
}
