# Apartamenty Gala - System Rezerwacji i Zarządzania

Nowoczesny, w pełni funkcjonalny system do rezerwacji apartamentów i zarządzania nimi od strony recepcji. Aplikacja składa się z backendu opartego na Fastify i Prisma oraz dynamicznego frontendu napisanego w React (Vite). Całość została zaprojektowana z myślą o wysokiej wydajności, bezpieczeństwie i niezawodności.

## Architektura i Stack Technologiczny

### Backend (Katalog `/server`)
- **Framework:** [Fastify](https://www.fastify.io/) - wybrany ze względu na niskie opóźnienia i wysoką przepustowość.
- **Baza danych:** PostgreSQL (wersja deweloperska korzysta z SQLite) obsługiwana przez **Prisma ORM**.
- **Walidacja danych:** `zod` zintegrowany bezpośrednio z Fastify (poprzez `fastify-type-provider-zod`).
- **Autoryzacja i Sesje:** JWT zapisywane w ciasteczkach (`HttpOnly`, `secure`, `sameSite: strict`).
- **Bezpieczeństwo:** `fastify-helmet`, `fastify-rate-limit`, ochrona przed atakami Timing (dummy hashe), CORS z restrykcyjnymi ustawieniami.
- **Transakcje:** Ścisła izolacja transakcji (Serializable) z wbudowanym mechanizmem ponawiania (retry loop) zabezpieczającym przed zjawiskiem Race Condition podczas rezerwacji tego samego pokoju.

### Frontend
- **Framework:** React + Vite
- **Narzędzia UI:** Tailwind CSS, Framer Motion (do płynnych animacji).
- **Zarządzanie stanem:** Context API / React Hooks.
- **Routing:** React Router DOM.
- **Moduły:**
  - Panel Klienta: Przeglądanie dostępności pokoi, formularz rezerwacyjny, galeria.
  - Panel Recepcji (Admin): Moduł zarządzania rezerwacjami, statusami (Check-in/Check-out), pokojami, zabezpieczony uwierzytelnianiem i kontrolą dostępu (RBAC).

## Najważniejsze Funkcjonalności
1. **Rezerwacje w czasie rzeczywistym:** Bezpieczne sprawdzanie pojemności, unikanie podwójnych rezerwacji (Double Booking) za sprawą transakcji.
2. **Globalny Error Handling:** Scentralizowany system obsługi błędów bazujący na klasach (np. `BadRequestError`, `ConflictError`). Eliminacja wycieków informacji o strukturze bazy poprzez maskowanie kodów błędów Prisma.
3. **Singleton Pattern dla Bazy:** Optymalizacja zużycia połączeń do bazy (Connection Pool) poprzez pojedynczą instancję `PrismaClient`.
4. **Zarządzanie Typami Pokoi:** Pełny CRUD obsługiwany z panelu administracyjnego z walidacją wejścia za pomocą Zod.

## Uruchomienie projektu lokalnie

### Wymagania
- Node.js (v18+)
- Zmienne środowiskowe: Skopiuj `.env.example` do `.env` w folderze `/server` i wypełnij (np. `JWT_SECRET`, `DATABASE_URL`).

### Instalacja
1. Sklonuj repozytorium:
   ```bash
   git clone <url_repozytorium>
   cd apartamenty-gala
   ```

2. Zainstaluj zależności:
   ```bash
   # W głównym katalogu (Frontend)
   npm install

   # W katalogu /server (Backend)
   cd server
   npm install
   ```

3. Skonfiguruj bazę danych:
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   # Opcjonalnie wgraj dane testowe:
   # npm run seed
   ```

### Uruchomienie deweloperskie
Dla Frontendu:
```bash
# W katalogu głównym
npm run dev
```

Dla Backendu:
```bash
# W katalogu /server
npm run dev
```

## Wytyczne dotyczące czystości kodu i Pull Requestów
- Trzymaj się struktury modułowej tras Fastify.
- Każdy endpoint powinien definiować schemat walidacji Zod - nie pozwól na `any` payload.
- Błędy biznesowe rzucaj poprzez instancje z `utils/errors.ts` (`throw new BadRequestError(...)`), a `fastify.setErrorHandler` sam ułoży z tego właściwy kod HTTP (400, 404, 409).
- Zwróć uwagę na bezpieczeństwo: rate limiting, walidacja wejścia, brak wycieków wrażliwych informacji.

---

*Zbudowane z myślą o najlepszych praktykach. W razie problemów sprawdź logi Prisma lub Fastify, które w trybie dev sformatowane są za pomocą `pino-pretty`.*
