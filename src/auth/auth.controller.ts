import { Controller, Post, Body } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dto/auth.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signin')
    async signIn(@Body() body: SignInDTO) {
        const { email, password } = body;
        return this.authService.signIn(email, password);
    }

    @Post('signup')
    async signUp(@Body() body: SignUpDTO) {
        const { name, email, password } = body;
        return this.authService.signUp(name, email, password);
    }
}