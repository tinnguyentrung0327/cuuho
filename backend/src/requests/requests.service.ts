import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RescueRequest } from '@prisma/client';
import { Gateway } from '../gateway/gateway.gateway';

@Injectable()
export class RequestsService {
    constructor(
        private prisma: PrismaService,
        private gateway: Gateway,
    ) { }

    async create(data: Prisma.RescueRequestCreateInput): Promise<RescueRequest> {
        const request = await this.prisma.rescueRequest.create({
            data,
        });

        // Broadcast to all connected clients
        this.gateway.broadcast('requestCreated', request);

        return request;
    }

    async findAll(): Promise<RescueRequest[]> {
        return this.prisma.rescueRequest.findMany({
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
        return this.prisma.rescueRequest.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<RescueRequest> {
        return this.prisma.rescueRequest.delete({
            where: { id },
        });
    }
}
