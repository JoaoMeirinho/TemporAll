from owslib.wms import WebMapService
from PIL import Image
import io
def decimal_to_bbox(lat, lon, delta=1.0):
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


def getImage(lat, lon, delta=1.0, date='2021-09-21'):
    wms = WebMapService(
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?',
    version='1.1.1'
    )
    bbox = decimal_to_bbox(lat, lon, delta)
    print(f"🛰️  Requisitando imagem para área: {bbox}")
# Fazer requisição para a camada MODIS Terra True Color
    img = wms.getmap(
    layers=['MODIS_Terra_CorrectedReflectance_TrueColor'],  # Camada
    srs='epsg:4326',               # Sistema de referência
    bbox=bbox,     # Extensão (mundo inteiro)
    size=(1200, 600),              # Tamanho da imagem
    time='2021-09-21',             # Data do dado
    format='image/png',            # Formato da imagem
    transparent=True               # Transparência
    )

# Salvar em arquivo
    filename = 'MODIS_Terra_CorrectedReflectance_TrueColor.png'
    with open(filename, 'wb') as out:
        out.write(img.read())

    print(f"Imagem salva em: {filename}")

# Abrir e mostrar a imagem no Windows
    im = Image.open(filename)
    im.show()


# Conectar ao serviço WMS do GIBS (NASA)
