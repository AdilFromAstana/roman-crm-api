// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Agency } from '../../agencies/entities/agency.entity';
import { Role } from './role.entity';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'Иванович',
    description: 'Отчество пользователя',
    required: false,
  })
  @Column({ nullable: true })
  middleName: string;

  @ApiProperty({
    example: '+7 (701) 123-45-67',
    description: 'Телефон пользователя',
  })
  @Column()
  phone: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL аватара',
    required: false,
  })
  @Column({ nullable: true })
  avatar: string;

  // Социальные сети риэлтора
  @ApiProperty({
    example: 'https://instagram.com/realtor_ivanov',
    description: 'Instagram риэлтора',
    required: false,
  })
  @Column({ nullable: true })
  instagram: string;

  @ApiProperty({
    example: 'https://tiktok.com/@realtor_ivanov',
    description: 'TikTok риэлтора',
    required: false,
  })
  @Column({ nullable: true })
  tiktok: string;

  @ManyToOne(() => Agency, (agency) => agency.users)
  agency: Agency;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ApiProperty({
    example: 'RL-123456',
    description: 'Номер лицензии',
    required: false,
  })
  @Column({ nullable: true })
  licenseNumber: string;

  @ApiProperty({
    example: '2025-12-31T00:00:00.000Z',
    description: 'Срок действия лицензии',
    required: false,
  })
  @Column({ nullable: true })
  licenseExpiry: Date;

  @ApiProperty({ example: false, description: 'Наличие действующей лицензии' })
  @Column({ default: false })
  isLicensed: boolean;

  @ApiProperty({ example: true, description: 'Статус активности' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Подтвержден ли email' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Дата создания',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Дата обновления',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Методы для блокировки пользователя
  isLocked(): boolean {
    return this.lockUntil && this.lockUntil > new Date();
  }

  incrementLoginAttempts(): void {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Блокировка на 30 минут
    }
  }

  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockUntil = null as any; // Исправляем тип
  }
}
