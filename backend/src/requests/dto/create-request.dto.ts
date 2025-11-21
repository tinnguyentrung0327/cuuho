export class CreateRescueRequestDto {
    description: string;
    latitude: number;
    longitude: number;
    priority: string;
    trackingId: string;
    requesterId: string;
    attachments?: Array<{
        url: string;
        type: string;
    }>;
    contactName?: string;
    contactPhone?: string;
    address?: string;
}
