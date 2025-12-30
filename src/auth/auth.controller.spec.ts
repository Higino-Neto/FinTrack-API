import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { jest } from "@jest/globals";

describe('AuthController', () => {
    let authController: AuthController;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockAuthService = {
        signIn: jest.fn<any>(),
        signUp: jest.fn<any>(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },

                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
    });

    it('should call the AuthService to return an user', async () => {
        const sendedUser = {
            id: 7,
            name: 'Higino',
            email: 'higino.dev@gmail.com',
            password: 'higino123',
        }
        const expectedUser = {
            id: 7,
            name: 'Higio',
            email: 'higino.dev@gmail.com',
        }

        jest.spyOn(mockAuthService, 'signUp').mockResolvedValue(expectedUser);

        const result = await authController.signUp(sendedUser);

        expect(result).toEqual(expectedUser);
    })
    
});

