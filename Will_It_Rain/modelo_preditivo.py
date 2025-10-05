# ======================================
# 🌤️ MODELO DE PREVISÃO CLIMÁTICA DE LONGO PRAZO
# ======================================

import os
import requests
import pandas as pd
import numpy as np
import glob
from joblib import dump, load
from prophet import Prophet

# ======================================
# 1️⃣ COLETA DE DADOS
# ======================================
def coletar_dados(latitude, longitude, start=20100101, end=20241231):
    url = (
        "https://power.larc.nasa.gov/api/temporal/daily/point?"
        f"parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_UV_INDEX,WS50M,PRECSNOLAND"
        f"&community=RE&longitude={longitude}"
        f"&latitude={latitude}&start={start}&end={end}&format=JSON"
    )

    r = requests.get(url)
    data = r.json()["properties"]["parameter"]

    temperatura = data.get("T2M", {})
    temperatura_max = data.get("T2M_MAX", {})
    temperatura_min = data.get("T2M_MIN", {})
    precipitacao = data.get("PRECTOTCORR", data.get("PRECTOT", {}))
    precipitacao_neve = data.get("PRECSNOLAND", {})
    umidade = data.get("RH2M", {})
    uv = data.get("ALLSKY_SFC_UV_INDEX", {})
    vento = data.get("WS50M", {})

    datas = list(temperatura.keys())
    df = pd.DataFrame({
        "data": pd.to_datetime(datas, format="%Y%m%d"),
        "temperatura": [temperatura.get(d, None) for d in datas],
        "temperatura_max": [temperatura_max.get(d, None) for d in datas],
        "temperatura_min": [temperatura_min.get(d, None) for d in datas],
        "precipitacao": [precipitacao.get(d, None) for d in datas],
        "precipitacao_neve": [precipitacao_neve.get(d, None) for d in datas],
        "umidade": [umidade.get(d, None) for d in datas],
        "uv": [uv.get(d, None) for d in datas],
        "vento": [vento.get(d, None) for d in datas]
    })

    print(f"✅ Dados coletados para ({latitude}, {longitude}) — {len(df)} registros encontrados.")
    return df

# ======================================
# 2️⃣ TREINAMENTO DOS MODELOS COM PROPHET
# ======================================
def treinar_modelos(df):
    modelo_dir = os.path.join(os.path.dirname(__file__), "modelos")
    os.makedirs(modelo_dir, exist_ok=True)

    colunas = ["temperatura", "temperatura_max", "temperatura_min",
               "precipitacao", "precipitacao_neve", "umidade", "uv", "vento"]

    for col in colunas:
        df_prophet = df[['data', col]].rename(columns={'data': 'ds', col: 'y'})
        modelo = Prophet(yearly_seasonality=True, daily_seasonality=False)
        modelo.fit(df_prophet)
        caminho = os.path.join(modelo_dir, f"modelo_{col}.joblib")
        dump(modelo, caminho)
        print(f"✅ Modelo Prophet treinado e salvo: {col} → {caminho}")

    print("\n🚀 Todos os modelos foram treinados e salvos com sucesso!")

# ======================================
# 3️⃣ LIMPAR MODELOS
# ======================================
def limpar_modelos():
    modelo_dir = os.path.join(os.path.dirname(__file__), "modelos")
    if os.path.exists(modelo_dir):
        arquivos_modelo = glob.glob(os.path.join(modelo_dir, "*.joblib"))
        for arquivo in arquivos_modelo:
            try:
                os.remove(arquivo)
                print(f"✅ Modelo removido: {os.path.basename(arquivo)}")
            except Exception as e:
                print(f"⚠️ Erro ao remover modelo {os.path.basename(arquivo)}: {e}")
        print("🧹 Limpeza de modelos concluída!")
    else:
        print("⚠️ Pasta de modelos não encontrada.")

# ======================================
# 4️⃣ FUNÇÃO DE PREVISÃO
# ======================================
def prever(data, latitude, longitude):
    df = coletar_dados(latitude, longitude)
    treinar_modelos(df)

    modelo_dir = os.path.join(os.path.dirname(__file__), "modelos")
    colunas = ["temperatura", "temperatura_max", "temperatura_min",
               "precipitacao", "precipitacao_neve", "umidade", "uv", "vento"]

    data = pd.to_datetime(data)
    entrada = pd.DataFrame({'ds': [data]})

    resultados = {}
    for col in colunas:
        modelo = load(os.path.join(modelo_dir, f"modelo_{col}.joblib"))
        forecast = modelo.predict(entrada)
        resultados[f"{col}_previsto"] = float(np.round(forecast['yhat'].iloc[0], 2))

    previsao = {
        "data": str(data.date()),
        "latitude": latitude,
        "longitude": longitude,
        **resultados
    }

    limpar_modelos()
    return previsao

# ======================================
# 5️⃣ EXECUÇÃO GERAL
# ======================================
if __name__ == "__main__":
    print("🌍 Bem-vindo ao sistema de previsão climática de longo prazo!\n")
    
    while True:
        try:
            latitude = float(input("Digite a latitude (ex: -23.51): ").strip())
            longitude = float(input("Digite a longitude (ex: -47.45): ").strip())
            print(f"\n🌍 Coletando dados para ({latitude}, {longitude})...")
            df = coletar_dados(latitude, longitude)
            treinar_modelos(df)
            break
        except ValueError:
            print("❌ Por favor, digite números válidos para latitude e longitude.")
        except Exception as e:
            print(f"❌ Erro ao coletar dados: {e}")

    print("\n💬 Sistema iniciado! Digite uma data (YYYY-MM-DD) para ver a previsão, ou 'sair' para encerrar.\n")

    while True:
        entrada = input("→ ")
        if entrada.lower() in ["sair", "exit"]:
            print("👋 Encerrando o sistema de previsões...")
            break
        try:
            previsao = prever(entrada, latitude, longitude)
            print("\n=== 🌦️ Previsão Climática de Longo Prazo ===")
            for k, v in previsao.items():
                print(f"{k.replace('_', ' ').capitalize()}: {v}")
            print("=========================================\n")
        except Exception as e:
            print("⚠️ Erro na entrada. Use o formato: YYYY-MM-DD")
            print("Detalhes:", e)
