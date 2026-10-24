#!/bin/bash
# Sobe a API compilada com valores falsos, só para ver se o Nest monta os módulos.
set -a; . /home/user/api/.env.example 2>/dev/null; set +a
export DATABASE_URL="postgresql://x:y@127.0.0.1:5999/db" PORT=4999 NODE_ENV=production
export TWILIO_ACCOUNT_SID=ACfake00000000000000000000000000 TWILIO_AUTH_TOKEN=fake
export C6_USERNAME=x C6_PASSWORD=x C6_URL_AUTH=http://127.0.0.1:1 C6_CHAVE=x
export JWT_SECRET=fake-local STRIPE_SECRET_KEY=sk_test_fake
cd "$1" && timeout 60 node dist/src/main 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -vE "Mapped \{|RoutesResolver|RouterExplorer|dependencies initialized" | head -25
