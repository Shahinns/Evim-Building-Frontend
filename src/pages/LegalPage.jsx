import React from "react";
import Navbar from "../components/Navbar";
import "../styles/LegalPage.css";

const CONTENT = {
  terms: {
    title: "İstifadəçi Razılaşması",
    body: (
      <>
        <section>
          <h3>1. Ümumi müddəalar</h3>
          <p>NaxEv.az platformasından istifadə edərək siz bu razılaşmanın bütün şərtlərini qəbul etmiş olursunuz.</p>
        </section>
        <section>
          <h3>2. İstifadəçi öhdəlikləri</h3>
          <p>İstifadəçi yerləşdirdiyi elanın doğruluğuna və qanuniliyinə görə şəxsən məsuliyyət daşıyır. Yanlış məlumat verən istifadəçilərin hesabı bloklana bilər.</p>
        </section>
        <section>
          <h3>3. Xidmət haqqı</h3>
          <p>Platformada elan yerləşdirmək pulsuzdur, lakin premium xidmətlər (elanların irəli çəkilməsi və s.) ödənişli əsaslarla həyata keçirilir.</p>
        </section>
      </>
    )
  },
  rules: {
    title: "Qaydalar",
    body: (
      <>
        <section>
          <h3>1. Elan yerləşdirmə qaydaları</h3>
          <ul>
            <li>Eyni elanı təkrar yerləşdirmək qadağandır.</li>
            <li>Şəkillər keyfiyyətli və real olmalıdır.</li>
            <li>Qiymət real bazar qiymətinə uyğun göstərilməlidir.</li>
          </ul>
        </section>
        <section>
          <h3>2. Qadağan olunmuş məzmun</h3>
          <p>Təhqiredici, qeyri-etik və qanunvericiliyi pozan məzmunlu elanlar dərhal silinəcəkdir.</p>
        </section>
      </>
    )
  },
  privacy: {
    title: "Məxfilik Siyasəti",
    body: (
      <>
        <section>
          <h3>1. Məlumatların toplanması</h3>
          <p>Biz sizin email ünvanınızı və telefon nömrənizi yalnız platformada qeydiyyat və əlaqə məqsədilə toplayırıq.</p>
        </section>
        <section>
          <h3>2. Məlumatların qorunması</h3>
          <p>Sizin şəxsi məlumatlarınız üçüncü tərəflərə ötürülmür və təhlükəsiz serverlərdə saxlanılır.</p>
        </section>
        <section>
          <h3>3. Kukilər (Cookies)</h3>
          <p>İstifadəçi təcrübəsini yaxşılaşdırmaq üçün kuki fayllarından istifadə oluna bilər.</p>
        </section>
      </>
    )
  }
};

export default function LegalPage({ type }) {
  const content = CONTENT[type] || CONTENT.rules;

  return (
    <div className="legal-page">
      <Navbar />
      <div className="legal-container">
        <h1 className="legal-title">{content.title}</h1>
        <div className="legal-content">
          {content.body}
        </div>
      </div>
    </div>
  );
}
