# Mağaza Görev ve Onarım Takip API

Doğa sporları mağazası (Av, Tırmanış, Kamp, Yedek Parça reyonları) için geliştirilmiş bir **Görev Yönetim REST API**'si. Görevler oluşturulabilir, listelenebilir, görüntülenebilir, güncellenebilir ve silinebilir. Gelen her istek bir logger middleware'i tarafından kayıt altına alınır.

## Kullanılan Teknolojiler

- **Node.js** — JavaScript çalışma ortamı
- **Express.js** — Sunucu ve routing
- **JSON dosyası** — Veri saklama (`data/db.json`)
- **Postman** — API testleri

## Gereksinimler

- Node.js 18 veya üzeri ([nodejs.org](https://nodejs.org) adresinden LTS sürümü)
- Postman ([postman.com/downloads](https://www.postman.com/downloads/))

Kurulumu kontrol etmek için terminalde:

```bash
node -v
npm -v
```

## Kurulum ve Çalıştırma

1. Proje klasörünü VS Code ile açın ve terminali başlatın (**Terminal → New Terminal**).
2. Gerekli paketleri yükleyin:

```bash
   npm install
```

3. Sunucuyu başlatın:

```bash
   npm start
```

4. Terminalde şu yazı görünmelidir:

```
   Sunucu çalışıyor: http://localhost:3000
```

5. Tarayıcıda `http://localhost:3000/api/tasks` adresini açarak görev listesini görebilirsiniz.

Sunucuyu durdurmak için terminalde **Ctrl + C**.

| Komut | Açıklama |
|---|---|
| `npm install` | Express'i yükler (ilk seferde bir kez) |
| `npm start` | Sunucuyu başlatır |
| `npm run dev` | Kod her kaydedildiğinde sunucuyu otomatik yeniden başlatır |

## Proje Yapısı

```
magaza-gorev-api/
├── app.js                     → Uygulamanın giriş noktası: Express, middleware ve route'lar
├── routes/
│   └── taskRoutes.js          → Görev adreslerini controller fonksiyonlarına bağlar
├── controllers/
│   └── taskController.js      → CRUD işlemlerini yapan fonksiyonlar
├── middlewares/
│   └── logger.js              → Her isteği konsola ve log dosyasına yazar
├── utils/
│   └── db.js                  → JSON dosyasını okuma / yazma yardımcıları
├── data/
│   └── db.json                → Veritabanı (görevler burada saklanır)
├── logs/
│   └── requests.log           → İstek kayıtları (otomatik oluşur)
└── package.json               → Proje bilgileri ve komutlar
```

Bir isteğin izlediği yol:

```
İstek → app.js → express.json() → logger → taskRoutes → taskController → db.json → Cevap
```

## API Uç Noktaları (CRUD)

Temel adres: `http://localhost:3000`

| İşlem | Metot | Adres | Başarılı Cevap |
|---|---|---|---|
| Görev Ekleme | POST | `/api/tasks` | 201 Created |
| Görev Listeleme | GET | `/api/tasks` | 200 OK |
| Görev Detayı | GET | `/api/tasks/:id` | 200 OK (yoksa 404) |
| Görev Güncelleme | PUT | `/api/tasks/:id` | 200 OK (yoksa 404) |
| Görev Silme | DELETE | `/api/tasks/:id` | 200 OK (yoksa 404) |

### Görev Ekleme Örneği

**POST** `http://localhost:3000/api/tasks`

Postman → Body → raw → JSON:

```json
{
  "title": "Yeni ürün yerleşimi",
  "description": "Kamp reyonuna yeni sezon çadırları yerleştirilecek",
  "priority": "YUKSEK"
}
```

Kurallar:

- `title` zorunludur ve en az 3 karakter olmalıdır.
- `priority` şu değerlerden biri olmalıdır: `DUSUK`, `ORTA`, `YUKSEK`, `ACIL`. Gönderilmezse `ORTA` olur.
- Yeni görevin durumu otomatik olarak `YAPILACAK` olur.

Cevap (`201 Created`):

```json
{
  "success": true,
  "message": "Görev oluşturuldu.",
  "data": {
    "id": 4,
    "title": "Yeni ürün yerleşimi",
    "description": "Kamp reyonuna yeni sezon çadırları yerleştirilecek",
    "status": "YAPILACAK",
    "priority": "YUKSEK",
    "assignedTo": null,
    "createdAt": "2026-10-10T20:01:35.864Z",
    "updatedAt": "2026-10-10T20:01:35.864Z"
  }
}
```

### Görev Güncelleme Örneği

**PUT** `http://localhost:3000/api/tasks/4`

```json
{
  "priority": "ACIL",
  "description": "Çadırlar bugün yerleştirilmeli"
}
```

Yalnızca gönderilen alanlar güncellenir; diğer alanlar olduğu gibi kalır.

### Hata Cevapları

| Durum | Kod | Örnek Mesaj |
|---|---|---|
| Başlık eksik veya kısa | 400 | Başlık (title) zorunludur ve en az 3 karakter olmalıdır. |
| Geçersiz öncelik | 400 | Öncelik şunlardan biri olmalı: DUSUK, ORTA, YUKSEK, ACIL |
| Görev bulunamadı | 404 | 99 numaralı görev bulunamadı. |
| Adres bulunamadı | 404 | GET /deneme adresi bulunamadı. |

## Logger Middleware

`middlewares/logger.js`, gelen her isteği **zaman damgası, metot ve adres** bilgisiyle kaydeder. Kayıtlar hem terminalde görünür hem de `logs/requests.log` dosyasına eklenir:

```
[2026-10-10T21:24:09.753Z] POST /api/tasks
[2026-10-10T21:24:15.056Z] GET /api/tasks
[2026-10-10T21:24:47.434Z] PUT /api/tasks/4
```

## Postman ile Test

1. Sunucuyu `npm start` ile başlatın.
2. Postman'de her işlem için yeni bir istek açın; metodu ve adresi yukarıdaki tablodaki gibi girin.
3. POST ve PUT isteklerinde **Body → raw → JSON** seçerek veriyi gönderin.
4. **Send** düğmesine basın; sağ üstte durum kodunu ve altta cevabı kontrol edin.

## Sık Karşılaşılan Hatalar

| Hata | Çözüm |
|---|---|
| `'node' is not recognized` | Node.js kurulu değil. Kurup VS Code'u yeniden açın. |
| `Cannot find module 'express'` | `npm install` komutunu çalıştırın. |
| `EADDRINUSE: address already in use :::3000` | Sunucu zaten açık. Diğer terminalde Ctrl + C ile kapatın. |
| Postman'de `Could not send request` | Sunucu çalışmıyor. `npm start` ile başlatın. |
| POST isteğinde "Başlık zorunludur" hatası | Postman'de Body → **raw** → **JSON** seçili olmalı. |