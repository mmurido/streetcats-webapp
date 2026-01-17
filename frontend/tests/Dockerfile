FROM mcr.microsoft.com/playwright:v1.56.0-jammy

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY playwright.config.ts ./

RUN apt-get update && apt-get install -y wait-for-it

CMD ["sh", "-c", "wait-for-it frontend:5173 --timeout=60 -- npx playwright test --project=chromium --reporter=list"]