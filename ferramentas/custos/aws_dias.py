"""Custo AWS por dia (Cost Explorer), dos últimos N dias fechados.

Uso: python3 aws_dias.py [N=3] [cambio=5.3478]
Imprime JSON {"usd": {dia: valor}, "brl": {dia: valor}}. Uma chamada = US$ 0,01.
A credencial "AWS custos" do ambiente assina a chamada; não há chave aqui.
"""
import datetime as dt
import json
import sys

import boto3

n = int(sys.argv[1]) if len(sys.argv) > 1 else 3
cambio = float(sys.argv[2]) if len(sys.argv) > 2 else 5.3478
hoje = (dt.datetime.utcnow() - dt.timedelta(hours=3)).date()  # Brasília
inicio = hoje - dt.timedelta(days=n)
ce = boto3.client("ce", region_name="us-east-1")
r = ce.get_cost_and_usage(
    TimePeriod={"Start": inicio.isoformat(), "End": hoje.isoformat()},  # End exclusivo: hoje fica de fora
    Granularity="DAILY",
    Metrics=["UnblendedCost"],
)
usd = {d["TimePeriod"]["Start"]: round(float(d["Total"]["UnblendedCost"]["Amount"]), 4) for d in r["ResultsByTime"]}
print(json.dumps({"usd": usd, "brl": {k: round(v * cambio, 2) for k, v in usd.items()}}))
