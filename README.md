# 🔬 Laboratuvar Dedektifi (3D İnteraktif Bilim Laboratuvarı)

**Laboratuvar Dedektifi**, lise ve üniversite seviyesindeki öğrenciler için geliştirilmiş; **Kimya**, **Fizik** ve **Biyoloji** deneylerini 3 boyutlu ve interaktif olarak yapmalarını sağlayan yeni nesil bir sanal laboratuvar platformudur.

---

## 🌟 Öne Çıkan Özellikler

### 🧪 1. Kimya Laboratuvarı
- **Kimyasal Reaksiyonlar**: Nötralleşme, metallerin asitlerle tepkimesi, yanma, çökelme gibi 8 farklı reaksiyon simülasyonu. Sıcaklık artışı, gaz çıkışı kabarcıkları, dipte çökelti ve renk değişimleri gerçek zamanlı modellenir.
- **Bek Alevi ile Isıtma**: 3D Bunsen beki ile çözeltileri ısıtma ve endotermik/ekzotermik tepkimeleri gözlemleme.
- **pH & Asit-Baz Deneyi**: 0–14 skalasında hassas pH ayarı, çözelti renginin anlık değişimi, 3D dijital pH metre elektrot probu ve renk değiştiren turnusol kağıdı.
- **Titrasyon Simülasyonu**: Büret musluğunu açarak erlenmayere damla damla NaOH ekleme, fenolftalein indikatörünün eşdeğerlik noktasında (dönüm noktası pH ~8.2) pembeye dönmesi ve anlık titrasyon eğrisi grafiği.
- **3D Periyodik Tablo**: 118 elementin tamamı! Seçilen elementin 3D Bohr atom modeli (çekirdekteki proton/nötron kümesi ve yörüngelerde dönen elektronlar), katman dizilimi ve kimyasal özellikleri.

---

### ⚡ 2. Fizik Laboratuvarı
- **Elektrik Devreleri**: Pil (1.5V - 24V), dirençler (seri ve paralel bağlama), anahtar, voltmetre, ampermetre ve akıma göre parlaklığı değişen 3D ampul. Kablolarda akan elektron parçacık animasyonu.
- **Sarkaç ve Mekanik**: İp uzunluğu, kütle, açı ayarı ve gezegen yerçekimi seçenekleri (Dünya, Ay, Mars, Jüpiter). Gerçek zamanlı $T = 2\pi\sqrt{L/g}$ periyot hesabı ve Kinetik/Potansiyel enerji çubuk grafiği.
- **Dalga Mekaniği**: Genlik ve frekans ayarı. Tek dalga yayılımı, iki dalganın girişimi (yapıcı/yıkıcı girişim) ve kararlı (duran) dalga modları.
- **Manyetizma**: Kırmızı (N) ve Mavi (S) kutuplu 3D çubuk mıknatıs, uzayda kıvrılan 3D manyetik alan çizgileri ve teğet yönelen pusula iğneleri.
- **Atış Hareketleri**: 3D top bataryası, fırlatma açısı ve ilk hız ayarı, parabolik yörünge izi, uçuş süresi ve maksimum menzil/yükseklik hesaplayıcı.

---

### 🧬 3. Biyoloji Laboratuvarı
- **Hayvan Hücresi (3D)**: Yarı saydam hücre zarı, çekirdek ve nükleolus, çift zarlı mitokondriler, granüllü ve düz endoplazmik retikulum, golgi cisimciği, lizozomlar, sentriyoller ve sitoplazmada serbest ribozomlar. Her organele tıklayarak Türkçe ansiklopedik bilgi paneline ulaşma.
- **Bitki Hücresi (3D)**: Sert hücre duvarı, tilakoid granumlu yeşil kloroplastlar, hücrenin merkezini kaplayan dev merkezi koful ve hayvan hücresiyle karşılaştırma tablosu.
- **Çekirdek İç Yapısı**: Kesit görünümde çift katlı çekirdek zarı, nükleer porlar, nükleolus ve histon proteinlerine sarılı kromatin iplikleri.
- **DNA Çift Sarmalı**: Watson-Crick modeli, Adenin (Kırmızı), Timin (Mavi), Guanin (Yeşil), Sitozin (Sarı) baz eşleşmeleri, hidrojen bağları ve replikasyon simülasyonu için "Sarmalı Aç (Unzip)" kontrolü.
- **Hücre Bölünmesi (Mitoz)**: İnterfaz, Profaz, Metafaz, Anafaz, Telofaz ve Sitokinez aşamalarını 3D adım adım izleme veya otomatik oynatma.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi çalıştırmak için bilgisayarınızda **Node.js (v18+)** kurulu olması yeterlidir:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda otomatik olarak açılacaktır:
👉 `http://localhost:3000`

Üretim derlemesi (Production build) için:
```bash
npm run build
npm run preview
```

---

## 🛠️ GitHub'a Yükleme Adımları

Kendi GitHub hesabınıza yüklemek için terminalde sırasıyla şu komutları çalıştırabilirsiniz:

```bash
# Git deposu oluşturun ve dosyaları ekleyin
git init
git add .
git commit -m "feat: Laboratuvar Dedektifi 3D Sanal Laboratuvarı ilk sürüm"

# GitHub'da 'laboratuvar-dedektifi' adında yeni bir repo oluşturduktan sonra:
git branch -M main
git remote add origin https://github.com/<KULLANICI_ADINIZ>/laboratuvar-dedektifi.git
git push -u origin main
```

---

## 📦 Kullanılan Teknolojiler

- **React 18**
- **Three.js** & **@react-three/fiber** (R3F)
- **@react-three/drei** (3D yardımcılar & kontroller)
- **Tailwind CSS** (Modern koyu tema & cam morfolojisi)
- **Framer Motion** (Akıcı arayüz geçişleri)
- **Vite** (Yüksek hızlı geliştirme ve derleme)
- **React Icons**
