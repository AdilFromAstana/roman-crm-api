// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../common/services/mail.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверка блокировки
    if (user.isLocked()) {
      throw new UnauthorizedException(
        'Аккаунт заблокирован. Попробуйте позже.',
      );
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      user.incrementLoginAttempts();
      await this.usersService.save(user);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Сброс попыток входа
    user.resetLoginAttempts();
    await this.usersService.save(user);

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Генерация refresh token
    const refreshToken = uuidv4();
    user.refreshToken = refreshToken;
    await this.usersService.save(user);

    // Убираем пароль из ответа
    const { password, ...result } = user;

    return {
      accessToken,
      refreshToken,
      user: result,
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: any }> {
    // Проверка существования пользователя
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    // Генерация временного пароля
    const tempPassword = Math.random().toString(36).slice(-8);

    // Создание пользователя через UsersService
    const user = await this.usersService.create({
      ...registerDto,
      password: tempPassword,
      roleIds: [], // Добавить пустой массив ролей
    });

    // Отправка временного пароля на почту
    await this.mailService.sendRegistrationEmail(
      registerDto.email,
      tempPassword,
    );

    return {
      message:
        'Пользователь успешно зарегистрирован. Временный пароль отправлен на email.',
      user,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Неверный refresh token');
    }

    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = uuidv4();

    user.refreshToken = newRefreshToken;
    await this.usersService.save(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Не раскрываем информацию о существовании пользователя
      return { message: 'Если email существует, код восстановления отправлен' };
    }

    // Генерация кода восстановления
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код

    user.passwordResetToken = resetCode;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
    await this.usersService.save(user);

    // Отправка кода на почту
    await this.mailService.sendPasswordResetEmail(email, resetCode);

    return { message: 'Код восстановления отправлен на email' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { email, code, newPassword } = resetPasswordDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    // Проверка кода и срока действия
    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== code ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException(
        'Неверный или просроченный код восстановления',
      );
    }

    // Обновление пароля
    user.password = newPassword;
    user.passwordResetToken = '' as any;
    user.passwordResetExpires = null as any;
    user.refreshToken = '' as any; // Инвалидация всех сессий
    await this.usersService.save(user);

    return { message: 'Пароль успешно изменен' };
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await user.validatePassword(
      changePasswordDto.currentPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    user.password = changePasswordDto.newPassword;
    user.refreshToken = '' as any; // Инвалидация всех сессий
    await this.usersService.save(user);

    return { message: 'Пароль успешно изменен' };
  }

  async logout(userId: number): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId);
    if (user) {
      user.refreshToken = '' as any;
      await this.usersService.save(user);
    }

    return { message: 'Выход выполнен успешно' };
  }
}
