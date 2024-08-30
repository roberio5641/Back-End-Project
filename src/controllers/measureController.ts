import { Request, Response } from 'express';
import { MeasureService } from '../services/measureService';

class MeasureController {
    
    static async uploadMeasure(req: Request, res: Response) {
        try {
            const { image, customer_code, measure_datetime, measure_type } = req.body;

            
            if (!image || !customer_code || !measure_datetime || !['WATER', 'GAS'].includes(measure_type)) {
                return res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Dados fornecidos no corpo da requisição são inválidos"
                });
            }

            const measureService = new MeasureService();
            const existingMeasure = await measureService.checkExistingMeasure(customer_code, measure_datetime, measure_type);

            if (existingMeasure) {
                return res.status(409).json({
                    error_code: "DOUBLE_REPORT",
                    error_description: "Leitura do mês já realizada"
                });
            }

            
            const measureValue = await measureService.extractValueFromImage(image);
            const measureUuid = await measureService.saveMeasure(customer_code, measure_datetime, measure_type, measureValue);

            return res.status(200).json({
                image_url: "URL temporária da imagem",   
                measure_value: measureValue,
                measure_uuid: measureUuid
            });

        } catch (error) {
            return res.status(500).json({
                error_code: "SERVER_ERROR",
                error_description: "Erro interno do servidor"
            });
        }
    }

   
    static async confirmMeasure(req: Request, res: Response) {
        try {
            const { measure_uuid, confirmed_value } = req.body;

           
            if (!measure_uuid || typeof confirmed_value !== 'number') {
                return res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Dados fornecidos no corpo da requisição são inválidos"
                });
            }

            const measureService = new MeasureService();
            const measure = await measureService.findMeasureByUUID(measure_uuid);

            if (!measure) {
                return res.status(404).json({
                    error_code: "MEASURE_NOT_FOUND",
                    error_description: "Leitura não encontrada"
                });
            }

            if (measure.has_confirmed) {
                return res.status(409).json({
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura já confirmada"
                });
            }

            
            measure.measure_value = confirmed_value;
            measure.has_confirmed = true;
            await measureService.updateMeasure(measure);

            return res.status(200).json({ success: true });

        } catch (error) {
            return res.status(500).json({
                error_code: "SERVER_ERROR",
                error_description: "Erro interno do servidor"
            });
        }
    }

    
    static async listMeasures(req: Request, res: Response) {
        try {
            const { customer_code } = req.params;
            const { measure_type } = req.query;

            
            if (typeof customer_code !== 'string') {
                return res.status(400).json({
                    error_code: "INVALID_DATA",
                    error_description: "Código do cliente é obrigatório"
                });
            }

            let measureTypeString: string | undefined;

            if (Array.isArray(measure_type)) {
                measureTypeString = measure_type.join(',');
            } else if (typeof measure_type === 'string') {
                measureTypeString = measure_type;
            }

            const measureService = new MeasureService();
            const measures = await measureService.listMeasures(customer_code, measureTypeString);

            if (measures.length === 0) {
                return res.status(404).json({
                    error_code: "MEASURES_NOT_FOUND",
                    error_description: "Nenhuma leitura encontrada"
                });
            }

            return res.status(200).json({
                customer_code,
                measures
            });

        } catch (error) {
            return res.status(500).json({
                error_code: "SERVER_ERROR",
                error_description: "Erro interno do servidor"
            });
        }
    }
}

export { MeasureController };
