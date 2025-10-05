# ======================================
# 🌤️ MODELO DE PREVISÃO CLIMÁTICA COMPLETA
# ======================================

import os
import requests
import pandas as pd
import numpy as np
import glob
from sklearn.ensemble import RandomForestRegressor
from joblib import dump, load

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

    # Pega os parâmetros disponíveis
    temperatura = data.get("T2M", {})
    temperatura_max = data.get("T2M_MAX", {})
    temperatura_min = data.get("T2M_MIN", {})
    precipitacao = data.get("PRECTOTCORR", data.get("PRECTOT", {}))
    precipitacao_neve = data.get("PRECSNOLAND", {})
    umidade = data.get("RH2M", {})
    uv = data.get("ALLSKY_SFC_UV_INDEX", {})
    vento = data.get("WS50M", {})

    # Monta DataFrame
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
# 2️⃣ TREINAMENTO DOS MODELOS
# ======================================
def treinar_modelos(df):
    # Create models directory if it doesn't exist
    modelo_dir = os.path.join(os.path.dirname(__file__), "modelos")
    os.makedirs(modelo_dir, exist_ok=True)

    df["mes"] = df["data"].dt.month
    df["dia"] = df["data"].dt.day
    df["ano"] = df["data"].dt.year

    X = df[["mes", "dia", "ano"]]

    modelos = {
        "temp": ("temperatura", os.path.join(modelo_dir, "modelo_temp.joblib")),
        "temp_max": ("temperatura_max", os.path.join(modelo_dir, "modelo_temp_max.joblib")),
        "temp_min": ("temperatura_min", os.path.join(modelo_dir, "modelo_temp_min.joblib")),
        "prec": ("precipitacao", os.path.join(modelo_dir, "modelo_prec.joblib")),
        "prec_neve": ("precipitacao_neve", os.path.join(modelo_dir, "modelo_prec_neve.joblib")),
        "umi": ("umidade", os.path.join(modelo_dir, "modelo_umi.joblib")),
        "uv": ("uv", os.path.join(modelo_dir, "modelo_uv.joblib")),
        "vento": ("vento", os.path.join(modelo_dir, "modelo_vento.joblib")),
    }

    for nome, (coluna, caminho) in modelos.items():
        y = df[coluna]
        modelo = RandomForestRegressor(n_estimators=100, random_state=42)
        modelo.fit(X, y)
        dump(modelo, caminho)
        print(f"✅ Modelo treinado e salvo: {nome} → {caminho}")

    print("\n🚀 Todos os modelos foram treinados e salvos com sucesso!")


# ======================================
# 3️⃣ FUNÇÃO PARA LIMPAR MODELOS
# ======================================
def limpar_modelos():
    """Remove todos os arquivos de modelo da pasta 'modelos'."""
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
    treinar_modelos(coletar_dados(latitude, longitude))

    modelo_dir = os.path.join(os.path.dirname(__file__), "modelos")
    
    modelos = {
        "temperatura_media_prevista": load(os.path.join(modelo_dir, "modelo_temp.joblib")),
        "temperatura_max_prevista": load(os.path.join(modelo_dir, "modelo_temp_max.joblib")),
        "temperatura_min_prevista": load(os.path.join(modelo_dir, "modelo_temp_min.joblib")),
        "precipitacao_prevista": load(os.path.join(modelo_dir, "modelo_prec.joblib")),
        "precipitacao_neve_prevista": load(os.path.join(modelo_dir, "modelo_prec_neve.joblib")),
        "umidade_prevista": load(os.path.join(modelo_dir, "modelo_umi.joblib")),
        "indice_uv_previsto": load(os.path.join(modelo_dir, "modelo_uv.joblib")),
        "vento_previsto": load(os.path.join(modelo_dir, "modelo_vento.joblib")),
    }

    data = pd.to_datetime(data)
    entrada = pd.DataFrame({
        "mes": [data.month],
        "dia": [data.day],
        "ano": [data.year]
    })

    resultados = {k: float(np.round(v.predict(entrada)[0], 2)) for k, v in modelos.items()}

    previsao = {
        "data": str(data.date()),
        "latitude": latitude,
        "longitude": longitude,
        **resultados
    }
    
    # Limpa os modelos após obter os resultados
    limpar_modelos()

    return previsao


# ======================================
# 4️⃣ EXECUÇÃO GERAL
# ======================================
if __name__ == "__main__":
    print("🌍 Bem-vindo ao sistema de previsão climática!")
    print("Primeiro, preciso saber para qual localização você quer treinar o modelo.\n")
    
    # Coleta inicial de latitude e longitude
    while True:
        try:
            lat_str = input("Digite a latitude (ex: -23.51): ").strip()
            lon_str = input("Digite a longitude (ex: -47.45): ").strip()
            
            latitude = float(lat_str)
            longitude = float(lon_str)
            
            print(f"\n🌍 Coletando dados para ({latitude}, {longitude})...")
            df = coletar_dados(latitude, longitude)
            treinar_modelos(df)
            break
        except ValueError:
            print("\n Erro: Por favor, digite números válidos para latitude e longitude.")
        except Exception as e:
            print(f"\n Erro ao coletar dados: {e}")
            print("Tente novamente.")

    print("\n💬 Sistema de previsão iniciado!")
    print(f"📍 Localização definida: ({latitude}, {longitude})")
    print("Digite uma data (YYYY-MM-DD) para ver a previsão, ou 'sair' para encerrar.\n")

    while True:
        entrada = input("→ ")
        if entrada.lower() in ["sair", "exit"]:
            print("👋 Encerrando o sistema de previsões...")
            break

        try:
            data = entrada.strip()
            previsao = prever(data, latitude, longitude)
            print("\n=== 🌦️ Previsão Climática ===")
            for k, v in previsao.items():
                print(f"{k.replace('_', ' ').capitalize()}: {v}")
            print("=============================\n")

        except Exception as e:
            print("⚠️ Erro na entrada. Use o formato: YYYY-MM-DD")
            print("Exemplo: 2024-12-31")
            print("Detalhes:", e)
