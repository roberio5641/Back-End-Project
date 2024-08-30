import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        // Inicializa o serviço GoogleGenerativeAI com a chave de API
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        // Inicializa o modelo específico
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    // Método para usar o modelo para alguma tarefa (exemplo: extrair valor de uma imagem)
    async extractValueFromImage(imageBase64: string): Promise<number> {
        try {
            const response = await this.model.predict({
                image: imageBase64,
                prompt: "Extract the meter reading from this image"
            });
    
            // Supondo que o valor esteja em response.data.value
            const measureValue = response.data.value; 
            return measureValue;
    
        } catch (error) {
            console.error("Erro ao se comunicar com a API do Gemini", error);
            throw new Error("Erro ao se comunicar com a API do Gemini");
        }
    }
}

export { GeminiService };
