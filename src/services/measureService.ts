import { getRepository } from 'typeorm';
import { Measure } from '../models/measureModels';
import { GeminiService } from './geminiService';

class MeasureService {
    private measureRepository = getRepository(Measure);
    private geminiService = new GeminiService();

    async checkExistingMeasure(customer_code: string, measure_datetime: Date, measure_type: string) {
        return await this.measureRepository.findOne({ where: { customer_code, measure_datetime, measure_type } });
    }

    async extractValueFromImage(image: string): Promise<number> {
        return await this.geminiService.extractValueFromImage(image);
    }

    async saveMeasure(customer_code: string, measure_datetime: Date, measure_type: string, measure_value: number): Promise<string> {
        const measure = this.measureRepository.create({
            customer_code,
            measure_datetime,
            measure_type,
            measure_value,
            image_url: "URL temporária da imagem"
        });
        await this.measureRepository.save(measure);
        return measure.measure_uuid;
    }

    async findMeasureByUUID(measure_uuid: string) {
        return await this.measureRepository.findOne({ where: { measure_uuid } });
    }

    async updateMeasure(measure: Measure) {
        await this.measureRepository.save(measure);
    }

    async listMeasures(customer_code: string, measure_type?: string) {
        const whereCondition = { customer_code } as any;
        if (measure_type) {
            whereCondition.measure_type = measure_type.toUpperCase();
        }
        return await this.measureRepository.find({ where: whereCondition });
    }
}

export { MeasureService };
