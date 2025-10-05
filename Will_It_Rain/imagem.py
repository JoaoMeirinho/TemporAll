from owslib.wms import WebMapService
from PIL import Image
import io
import os

def decimal_to_bbox(lat, lon, delta=5.0):
    """
    Converte coordenadas decimais (latitude e longitude)
    em um bounding box (bbox) no formato WMS.
    
    delta = "zoom" em graus (meia distância do bloco)
    """
    min_lat = lat - delta
    max_lat = lat + delta
    min_lon = lon - delta
    max_lon = lon + delta
    return (min_lon, min_lat, max_lon, max_lat)

# Dicionário com as camadas disponíveis
AVAILABLE_LAYERS = {
    "true_color": "MODIS_Terra_CorrectedReflectance_TrueColor",
    "temperatura_superficie": "MODIS_Terra_Land_Surface_Temp_Day",
    "temperatura_ar": "AIRS_L3_Surface_Air_Temperature_Monthly_Day",
    "anomalia_temperatura": "MODIS_Terra_Land_Surface_Temp_Anomaly_Day",
    "precipitacao": "IMERG_Precipitation_Rate",
    "umidade_relativa": "AIRS_L3_RelativeHumidity_500hPa_Day"
}

def getImage(lat, lon, layer_type="true_color", delta=5.0, date=None):
    """
    Obtém uma imagem do serviço WMS da NASA com base nas coordenadas e tipo de camada.
    
    Args:
        lat (float): Latitude
        lon (float): Longitude
        layer_type (str): Tipo de camada (true_color, temperatura_superficie, temperatura_ar, anomalia_temperatura, precipitacao)
        delta (float): Zoom em graus
        date (str): Data no formato YYYY-MM-DD. Se None, usa a data padrão '2021-09-21'
    
    Returns:
        str: Caminho do arquivo de imagem salvo
    """
    if date is None:
        date = '2024-09-21'
        
    # Seleciona a camada com base no tipo
    if layer_type not in AVAILABLE_LAYERS:
        print(f"Tipo de camada '{layer_type}' não disponível. Usando 'true_color'.")
        layer_type = "true_color"
    
    layer = AVAILABLE_LAYERS[layer_type]
    
    wms = WebMapService(
        'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?',
        version='1.1.1'
    )
    
    bbox = decimal_to_bbox(lat, lon, delta)
    print(f"🛰️  Requisitando imagem para área: {bbox}")
    print(f"📊 Camada: {layer_type} ({layer})")
    print(f"📅 Data: {date}")
    
    # Fazer requisição para a camada selecionada
    img = wms.getmap(
        layers=[layer],  # Camada selecionada
        srs='epsg:4326',               # Sistema de referência
        bbox=bbox,                      # Extensão
        size=(1200, 600),              # Tamanho da imagem
        time=date,                      # Data do dado
        format='image/png',            # Formato da imagem
        transparent=True               # Transparência
    )

    # Gerar nome de arquivo baseado na camada
    filename = f"{layer.replace('/', '_')}.png"
    with open(filename, 'wb') as out:
        out.write(img.read())

    print(f"Imagem salva em: {filename}")

    # Abrir e mostrar a imagem no Windows
    im = Image.open(filename)
    im.show()
    
    return filename

def getTemperatureImage(lat, lon, delta=5.0, date=None):
    """
    Função específica para obter imagem de temperatura da superfície.
    
    Args:
        lat (float): Latitude
        lon (float): Longitude
        delta (float): Zoom em graus
        date (str): Data no formato YYYY-MM-DD
        
    Returns:
        str: Caminho do arquivo de imagem salvo
    """
    return getImage(lat, lon, layer_type="temperatura_superficie", delta=delta, date=date)
