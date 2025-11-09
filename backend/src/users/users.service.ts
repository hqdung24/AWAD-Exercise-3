import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    //Inject PrismaService to interact with the database
    private prisma: PrismaService,
  ) {}

  async signup(data: CreateUserDto) {
    const hashed = await hash(data.password, 10);
    const isExist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (isExist) {
      throw new UnauthorizedException('Email already in use');
    }
    await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return { message: 'Sign up successfully, please sign in' };
  }

  async signin(data: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await compare(data.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return { message: 'Sign in successfully' };
  }
}
