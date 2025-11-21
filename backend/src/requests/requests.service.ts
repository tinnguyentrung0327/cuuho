import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RescueRequest } from '@prisma/client';
import { Gateway } from '../gateway/gateway.gateway';
import { CreateRescueRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
    constructor(
        private prisma: PrismaService,
        private gateway: Gateway,
    ) { }

    async create(dto: CreateRescueRequestDto): Promise<RescueRequest> {
        let { requesterId, attachments, contactName, contactPhone, ...data } = dto;

        // Handle Guest/Anonymous Users
        if (!requesterId) {
            if (!contactPhone) {
                throw new Error('Số điện thoại là bắt buộc đối với yêu cầu ẩn danh');
            }

            // 1. Find existing user by phone
            const existingUser = await this.prisma.user.findFirst({
                where: { phone: contactPhone }
            });

            if (existingUser) {
                requesterId = existingUser.id;
            } else {
                // 2. Create new guest user if not found
                // Generate a unique email based on phone to satisfy schema constraints
                const guestEmail = `${contactPhone}@guest.cuuho.local`;

                // Check if email exists (edge case)
                const emailCheck = await this.prisma.user.findUnique({ where: { email: guestEmail } });

                if (emailCheck) {
                    requesterId = emailCheck.id;
                } else {
                    const newUser = await this.prisma.user.create({
                        data: {
                            fullName: contactName || 'Người dân cần hỗ trợ',
                            phone: contactPhone,
                            email: guestEmail,
                            password: 'guest_password_123', // Dummy password
                            role: 'CITIZEN'
                        }
                    });
                    requesterId = newUser.id;
                }
            }
        }

        const request = await this.prisma.rescueRequest.create({
            data: {
                ...data,
                contactName,
                contactPhone,
                requester: {
                    connect: { id: requesterId },
                },
                ...(attachments && attachments.length > 0 && {
                    attachments: {
                        create: attachments,
                    },
                }),
            },
            include: {
                attachments: true,
            },
        });

        // Broadcast to all connected clients
        this.gateway.broadcast('requestCreated', request);

        return request;
    }

    async findAll(address?: string, phone?: string): Promise<RescueRequest[]> {
        const where: Prisma.RescueRequestWhereInput = {};

        if (address) {
            where.address = {
                contains: address,
                mode: 'insensitive',
            };
        }

        if (phone) {
            where.OR = [
                {
                    contactPhone: {
                        contains: phone,
                        mode: 'insensitive',
                    },
                },
                {
                    requester: {
                        phone: {
                            contains: phone,
                            mode: 'insensitive',
                        },
                    },
                },
            ];
        }

        return this.prisma.rescueRequest.findMany({
            where,
            include: { requester: true, rescuer: true, team: true, attachments: true },
        });
    }

    async findOne(id: string): Promise<RescueRequest | null> {
        return this.prisma.rescueRequest.findUnique({
            where: { id },
            include: { requester: true, rescuer: true, team: true, attachments: true },
        });
    }

    async update(id: string, data: Prisma.RescueRequestUpdateInput): Promise<RescueRequest> {
        const request = await this.prisma.rescueRequest.update({
            where: { id },
            data,
            include: { requester: true, rescuer: true, team: true, attachments: true },
        });

        this.gateway.broadcast('requestUpdated', request);
        return request;
    }

    async remove(id: string): Promise<RescueRequest> {
        return this.prisma.rescueRequest.delete({
            where: { id },
        });
    }
}
