import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Prisma } from '@prisma/client';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) { }

    @Post()
    create(@Body() createRequestDto: Prisma.RescueRequestCreateInput) {
        return this.requestsService.create(createRequestDto);
    }

    @Get()
    findAll() {
        return this.requestsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRequestDto: Prisma.RescueRequestUpdateInput) {
        return this.requestsService.update(id, updateRequestDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.requestsService.remove(id);
    }
}
