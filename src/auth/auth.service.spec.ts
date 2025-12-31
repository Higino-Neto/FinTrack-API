import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service.js"
import { PrismaService } from "src/prisma/prisma.service.js";
import { jest } from "@jest/globals";
import { JwtService } from "@nestjs/jwt";

describe('AuthService', () => {
    // Arrange
    let authService: AuthService;
    const mockJwtService = {
        signAsync: jest.fn(),
    };
    const mockPrismaService = {
        user: {
            findUnique: jest.fn<any>(),
            create: jest.fn<any>(),
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        it('should call PrismaService and JwtService and return a created user', async () => {
            const sendedUser = {
                name: 'name_of_the_user',
                email: 'email_of_the_user',
                password: 'p@ssword',
            };

            const expectedUser = {
                id: 7,
                name: 'name_of_the_user',
                email: 'email_of_the_user',
            };

            const resultMockPrismaService = mockPrismaService.user.create.mockResolvedValue(
                {
                    data: expectedUser,
                }
            );

            jest.spyOn(authService, 'hashMaker').mockResolvedValue('fakeSalt.fakeHash');

            expect(await authService.signUp(
                sendedUser.name,
                sendedUser.email,
                sendedUser.password,
            )).toEqual({
                data: expectedUser,
            });

            expect(resultMockPrismaService).toHaveBeenCalledWith({
                data: {
                    email: sendedUser.email,
                    name: sendedUser.name,
                    password: 'fakeSalt.fakeHash',
                },
            });
            expect(resultMockPrismaService).toHaveBeenCalledTimes(1);
        });
    });
});