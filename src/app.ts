import 'reflect-metadata';  // Import necessário para o TypeORM funcionar corretamente
import express from 'express';
import { createConnection } from 'typeorm';
import { MeasureController } from './controllers/measureController';

const app = express();
app.use(express.json());

createConnection().then(() => {
    console.log('Connected to the database');

    app.post('/upload', MeasureController.uploadMeasure);
    app.patch('/confirm', MeasureController.confirmMeasure);
    app.get('/:customer_code/list', MeasureController.listMeasures);

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch(error => console.log('Database connection error:', error));
