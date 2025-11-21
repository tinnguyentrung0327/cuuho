import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Prisma } from '@prisma/client';
import { CreateRescueRequestDto } from './dto/create-request.dto';
import { UpdateRescueRequestDto } from './dto/update-request.dto';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) { }

    @Post()
    create(@Body() createRequestDto: CreateRescueRequestDto) {
        return this.requestsService.create(createRequestDto);
    }

    @Get()
    findAll(
        @Query('address') address?: string,
        @Query('phone') phone?: string,
    ) {
        return this.requestsService.findAll(address, phone);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRequestDto: UpdateRescueRequestDto) {
        return this.requestsService.update(id, updateRequestDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.requestsService.remove(id);
    }
}
