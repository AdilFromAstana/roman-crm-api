// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Добавить импорт
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { MailService } from '../common/services/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule, // Добавить ConfigModule в imports
  ],
  providers: [UsersService, MailService],
  controllers: [UsersController],
  exports: [UsersService, MailService],
})
export class UsersModule {}
