// src/users/entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'admin', description: 'Название роли' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    example: 'Главный администратор системы',
    description: 'Описание роли',
    required: false,
  })
  @Column({ nullable: true })
  description: string;
}
