import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()  
export class Measure {
    @PrimaryGeneratedColumn('uuid')
    measure_uuid!: string;

    @Column()
    customer_code!: string;

    @Column('timestamp')
    measure_datetime!: Date;

    @Column()
    measure_type!: string;

    @Column('integer')
    measure_value!: number;

    @Column({ default: false })
    has_confirmed!: boolean;

    @Column()
    image_url!: string;

    @CreateDateColumn()
    created_at!: Date;
}
