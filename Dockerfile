FROM node:12

USER root

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# RUN chmod +x remove-devfiles.sh && bash remove-devfiles.sh

RUN NODE_ENV=production

CMD ["npm", "run", "start"]
