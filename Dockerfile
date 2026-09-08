FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node avaliador-mods/ ./
COPY --chown=node:node analises-modpacks/ ./analises-modpacks/

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8787

EXPOSE 8787

USER node

CMD ["node", "server.js"]
