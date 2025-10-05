from datetime import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

import imagem

class MeuServidor(BaseHTTPRequestHandler):
    # 🔸 Permite CORS para qualquer origem
    def _set_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        # 🔸 Necessário para responder pré-requisições CORS
        self.send_response(200)
        self._set_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._set_headers()
        self.end_headers()

        # 🔸 Pega os parâmetros da URL
        query = urlparse(self.path).query
        params = parse_qs(query)

        if self.path  == "/get":

        # Exemplo: ?nome=Joao&idade=18
            longitude = params.get("longitude", ["Desconhecido"])[0]
            latitude = params.get("latitude", ["Desconhecido"])[0]
            data = params.get("data", ["Desconhecido"])[0]

            dados = {
                "sensação térmica": "30°C",
                "umidade do ar": "80%",
                "velocidade do vento": "15 km/h",
                "condição": "Ensolarado",
                "temperatura": "28°C",
                "condicao_detalhada": "Céu limpo",
                "precipitacao": "0 mm"
            }

            resposta = f'{{"dados": {dados}}}'
            self.wfile.write(resposta.encode())
        elif self.path == "/image":
            longitude = params.get("longitude", ["Desconhecido"])[0]
            latitude = params.get("latitude", ["Desconhecido"])[0]
            
            data = datetime.now().strftime("%Y-%m-%d")
            imagem.getImage(float(latitude), float(longitude), delta=1.0, date=data)

    def do_POST(self):
        self.send_response(200)
        self._set_headers()
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"mensagem": "POST recebido com sucesso!"}')

server = HTTPServer(("localhost", 8080), MeuServidor)
print("Servidor rodando em http://localhost:8080")
server.serve_forever()
