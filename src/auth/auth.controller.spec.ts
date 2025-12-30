import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";

describe('AuthController', () => {
    let authController: AuthController;
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

            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);

        jest.clearAllMocks();
    });

    describe('signUp', () => {
        it('should call the AuthService and return an user', async () => {
            const sendedUser = {
                id: 7,
                name: 'Higino',
                email: 'higino.dev@gmail.com',
                password: 'higino123',
            }
            const expectedUser = {
                id: 7,
                name: 'Higino',
                email: 'higino.dev@gmail.com',
            }

            const resultMockAuthService = mockAuthService.signUp.mockResolvedValue(expectedUser);

            const result = await authController.signUp(sendedUser);

            expect(result).toEqual(expectedUser);
            expect(resultMockAuthService).toHaveBeenCalledTimes(1);
            expect(resultMockAuthService).toHaveBeenCalledWith(
                sendedUser.name,
                sendedUser.email,
                sendedUser.password,
            );
        });

        // This one is useless, because I am essentialy testing the NestJS and not my function, knowing that it bubble up errors, but it's useful to learn
        it('should return a badRequestException error (Email already in use)', async () => {
            const sendedUser = {
                name: 'higino',
                email: 'already_in_use_email@gmail.com',
                password: 'p@ssword',
            };

            const resultMockAuthService = mockAuthService.signUp.mockRejectedValue(
                new BadRequestException(),
            );
            
            await expect(authController.signUp(sendedUser)).rejects.toThrow(BadRequestException);
            expect(resultMockAuthService).toHaveBeenCalledTimes(1);
            expect(resultMockAuthService).toHaveBeenCalledWith(
                sendedUser.name,
                sendedUser.email,
                sendedUser.password,
            );

        });
    });

    describe('signIn', () => {
        it('should call the AuthService and return a token', async () => {
            const sendedUser = {
                email: 'higino.dav@gmail.com',
                password: 'higinoPassword',
            };

            const expectedToken = {
                access_token: 'JkwrjsKdfg.jsadfsjkZJDFjwretJSDklwqertjCLKJsfglwqre',
            };

            const resultMockAuthService = mockAuthService.signIn.mockResolvedValue(expectedToken);
            const result = await authController.signIn(sendedUser);

            expect(result).toEqual(expectedToken);
            expect(resultMockAuthService).toHaveBeenCalledTimes(1);
            expect(resultMockAuthService).toHaveBeenCalledWith(
                sendedUser.email,
                sendedUser.password,
            );
        });
    });
});

