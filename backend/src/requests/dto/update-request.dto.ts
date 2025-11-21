export class UpdateRescueRequestDto {
    status?: 'PENDING' | 'ASSIGNED' | 'ON_THE_WAY' | 'RESOLVED' | 'CANCELLED';
    rating?: number;
    feedback?: string;
    rescuerId?: string;
}
