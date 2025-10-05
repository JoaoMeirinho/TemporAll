from datetime import datetime
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

from gemini import get_explicacao
import imagem
from modelo_preditivo import prever

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
async def get_data(longitude: str = "-47.45", latitude: str = "-23.51", data: str = "2025-10-01"):
    # Mantendo o mesmo formato de resposta do servidor original
    # dados = {
    #     "sensação térmica": "30°C",
    #     "umidade do ar": "80%",
    #     "velocidade do vento": "15 km/h",
    #     "condição": "Ensolarado",
    #     "temperatura": "28°C",
    #     "condicao_detalhada": "Céu limpo",
    #     "precipitacao": "0 mm"
    # }
    dados = prever(data, float(latitude), float(longitude))
    explicacao = await get_explicacao(dados)
    
    resposta = {"dados": dados,
                "explicacao": explicacao}
    return resposta

@app.get("/image")
async def get_image(longitude: str = "-47.45", latitude: str = "-23.51", layer: str = "umidade_relativa", data: str = None, delta: float = 0.5):
    # Convertendo para float conforme o código original
    try:
        lat_float = float(latitude)
        lon_float = float(longitude)
        
        # Se a data não for fornecida, usar a data atual
        if data is None or data == "Desconhecido":
            data = datetime.now().strftime("%Y-%m-%d")
            
        # Usar a função getImage com o parâmetro de camada e zoom aumentado
        imagem.getImage(lat_float, lon_float, layer_type=layer, delta=delta, date=data)
        return {"status": "success", "message": f"Imagem gerada com sucesso usando camada: {layer}, zoom: {delta}"}
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
