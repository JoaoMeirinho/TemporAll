from datetime import datetime
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

import imagem

app = FastAPI()

# Configuração do CORS para permitir qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get")
async def get_data(longitude: str = "Desconhecido", latitude: str = "Desconhecido", data: str = "Desconhecido"):
    # Mantendo o mesmo formato de resposta do servidor original
    dados = {
        "sensação térmica": "30°C",
        "umidade do ar": "80%",
        "velocidade do vento": "15 km/h",
        "condição": "Ensolarado",
        "temperatura": "28°C",
        "condicao_detalhada": "Céu limpo",
        "precipitacao": "0 mm"
    }
    
    resposta = {"dados": dados}
    return resposta

@app.get("/image")
async def get_image(longitude: str = "Desconhecido", latitude: str = "Desconhecido"):
    # Convertendo para float conforme o código original
    try:
        lat_float = float(latitude)
        lon_float = float(longitude)
        data = datetime.now().strftime("%Y-%m-%d")
        imagem.getImage(lat_float, lon_float, delta=1.0, date=data)
        return {"status": "success", "message": "Imagem gerada com sucesso"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/")
async def post_handler():
    return {"mensagem": "POST recebido com sucesso!"}

@app.options("/{path:path}")
async def options_handler(path: str):
    # Manipulador para requisições OPTIONS (CORS)
    return Response(status_code=200)

if __name__ == "__main__":
    print("Servidor rodando em http://localhost:8080")
    uvicorn.run(app, host="localhost", port=8080)
