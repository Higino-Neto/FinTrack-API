import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class SignUpDTO {
    @IsString()
    @Length(3, 50)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword(
        {},
        {
            message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
        })
    password: string;
}

export class SignInDTO {
    email: string;
    password: string;
}