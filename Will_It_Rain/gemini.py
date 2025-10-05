import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyD2fHtwwRzaDs9t1BmJKJNNqEHGgBIp_IY"

async def get_explicacao(dados):
    try:
        # Monta o prompt para o Gemini
        prompt = (
            "Explique de forma simples e acessível para leigos o que significam os seguintes dados de previsão do tempo, "
            "dizendo se as condições são boas ou ruins para atividades ao ar livre e o que cada métrica representa. Voce deve"
            "retornar em formato json de forma direta, pura, pronta para realizar a conversão em python ou js, para cada tópico qeu você receber você colocará uma breve descrição de no máximo"
            " 5 palavras (como agradável, etc) ou pequena sugestão (máximo 5 palavras) (bom para esquiar, ruim para caminhada)."
            " Use o seguinte formato:\n"
            "{'sensação térmica': 'breve descrição ou uma pequena sugestão (máximo 5 palavras) (bom para esquiar, ruim para caminhada)',\n"
            "e assim sendo para os outros dados."
            "não deve conter caracteres especiais, apenas letras, números, espaços e vírgulas. use aspas simples. Não use o barra n \n"
            "\nDados: "
            f"{dados}"
        )
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-pro")
        resposta = model.generate_content(prompt)
        explicacao = resposta.text if hasattr(resposta, "text") else str(resposta)
        explicacao = explicacao.replace("'", '"')  # Substitui aspas simples por aspas duplas para JSON válido
        return explicacao
    except Exception as e:
        return {"erro": str(e)}