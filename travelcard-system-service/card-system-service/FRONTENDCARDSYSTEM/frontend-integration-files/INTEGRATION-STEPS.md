# Frontend Integration Steps

## Recommended project structure
Place this folder beside your Spring Boot `src` folder:

```text
card-system-service/
  pom.xml
  src/
  frontend/
    package.json
    src/
```

## Run during development
Open two terminals.

Terminal 1: run backend from the Spring Boot project root.

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Terminal 2: run frontend from this frontend folder.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend is configured to call:

```text
http://localhost:8080
```

## Build into Spring Boot for final demo/submission
From the frontend folder:

```bash
npm install
npm run build
```

Then copy everything inside `dist/` into:

```text
src/main/resources/static/
```

After that, run the Spring Boot app and open:

```text
http://localhost:8080
```

## Backend endpoint expected
The Stations page now calls:

```text
GET /api/card/stations
```
