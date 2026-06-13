import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: any){
        const candidate = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if( candidate) throw new BadRequestException("User already exists")
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone
            }
        });

        return this.generateTokens(user.id, user.email)
    }

    async validateuser (email: string, pass: string): Promise<any>{
        const user = await this.prisma.user.findUnique({
            where: {email}
        })
        if (user && (await bcrypt.compare(pass, user.password))){
            const {password, ...result} = user
            return result
        }
        return null
    }

    async login(user: any){
        return this.generateTokens(user.id, user.email)
    }

    async forgotPassword(email:string){
        const user = await this.prisma.user.findUnique({
            where: {email}
        })
        if (!user) throw new BadRequestException("user not found")
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        await this.prisma.user.update({
            where: {email},
            data: {
                verificationCode: code,
                verificationCodeExp: expiry,
            }
        })

        return {message: "Verification code sent to email", code: code}
    }

    async verifyPasswordResetCode(email: string, code: string) {
        const user = await this.prisma.user.findUnique({
            where: {email}
        })

        if (!user) throw new BadRequestException("User not found")
        if (user.verificationCode !== code) throw new BadRequestException("Invalid verification code")
        if (!user.verificationCodeExp || user.verificationCodeExp < new Date()) {
            throw new BadRequestException("Verification code expired")
        }

        return {message: "Verification code is valid"}
    }

    async resetPassword(email: string, code: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({
            where: {email}
        })

        if (!user) throw new BadRequestException("User not found")
        if (user.verificationCode !== code) throw new BadRequestException("Invalid verification code")
        if (!user.verificationCodeExp || user.verificationCodeExp < new Date()) {
            throw new BadRequestException("Verification code expired")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await this.prisma.user.update({
            where: {email},
            data: {
                password: hashedPassword,
                verificationCode: null,
                verificationCodeExp: null,
            }
        })

        return {message: "Password reset successfully"}
    }

    async verifyEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {email}
        })

        if (!user) throw new BadRequestException("User not found")

        await this.prisma.user.update({
            where: {email},
            data: {
                emailVerified: true,
            }
        })

        return {message: "Email verification sent"}
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })

        if (!user) throw new BadRequestException("User not found")

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            throw new BadRequestException("Current password is incorrect")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await this.prisma.user.update({
            where: {id: userId},
            data: {
                password: hashedPassword,
            }
        })

        return {message: "Password changed successfully"}
    }

    
    private generateTokens(userId: number, email: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId, email }),
    };
  }
  

}
