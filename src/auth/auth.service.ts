import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const HASH_LENGTH = 32;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async signUp(name: string, email: string, password: string) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            throw new BadRequestException({ message: "Credentials in use" });
        }

        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(password, salt, HASH_LENGTH) as Buffer;
        const saltAndHash = `${salt}.${hash.toString('hex')}`;

        const user = {
            name,
            email,
            password: saltAndHash,
        };

        const createdUser = await this.prisma.user.create({
            data: user
        });
        
        const { password: _, ...result } = createdUser;
        return result;
    }

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!existingUser) {
            throw new UnauthorizedException({ message: "Invalid Credentials" });
        }

        const payload = { sub: existingUser.id, email: existingUser.email };
        const token = await this.jwtService.signAsync(payload);

        const [salt, storedHash] = existingUser.password.split('.');
        const signInHash = (await scrypt(password, salt, HASH_LENGTH)) as Buffer;
        
        if (storedHash !== signInHash.toString('hex')) {
            throw new UnauthorizedException({ message: 'Invalid Credentials'});
        }

        return {
            access_token: token,
        }
    }


}
