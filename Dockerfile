# Base image
FROM node:20.9.0

RUN apt-get update && apt-get install -y libnss3 libxss1 libasound2  libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxcomposite1 libxrandr2 libgbm1 libpango1.0-0 libxdamage1 libxext6 libxtst6 \
  fonts-liberation libappindicator3-1 xdg-utils libdbus-1-dev wget curl --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Puppeteer installations
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install -y gnupg wget && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Create the pdf directory
RUN mkdir pdf

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
