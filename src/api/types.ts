// src/api/types.ts

export type Difficulty = 'easy' | 'moderate' | 'hard'
export type Pace = 'relaxed' | 'moderate' | 'fast'
export type Phase = 'upcoming' | 'past' | 'in_progress'
export type OutingStatus = 'open' | 'cancelled'
export type Experience = 'beginner' | 'intermediate' | 'experienced'
export type HikerRole = 'rider' | 'driver'
export interface ApiEnvelope<T> {
    data: T
    correlation_id: string
    timestamp: string
}
export interface ApiErrorBody{
    error: ApiErrorDetails
}
export interface ApiErrorDetails{
    status:number
    code:string
    message:string
    correlation_id:string
    timestamp:string
}

export interface RegisterInput{
    email:string
    password:string
    name:string
    experience:Experience
    home_area?: string
    bio?: string
    gender?: string
}

export interface Hiker{
    id: string
    email: string
    name: string
    experience: Experience
    home_area?: string
    bio?: string
    gender?: string
    created_at: string
    updated_at: string
    verified_at: string | null
}

export interface ResponseMessage{
    message: string
}

export interface LoginInput{
    email: string
    password: string
}

export interface Page<T>{
    items: T[]
    next_cursor: string | null
}

export interface Outing{
    id: string
    host_id: string
    title: string
    destination: string
    meet_label: string
    meet_lat?: number
    meet_lng?: number
    starts_at: string
    max_size: number
    host_seats: number
    cost_per_seat_cents: number
    difficulty: Difficulty
    pace: Pace
    notes?: string
    status: OutingStatus
    created_at: string
    updated_at: string
    conversation_id: string | null
    ends_at: string | null
    phase: Phase
    is_discussion_open: boolean
    capacity?: Capacity
}

export interface Capacity{
    people_count: number
    seat_capacity: number
    seats_short: number
    spots_left: number
    waiting_count: number
}

export interface CreateOutingInput{
    title: string
    destination: string
    meet_label: string
    host_seats: number
    cost_per_seat_cents: number
    meet_lat?: number | null
    meet_lng?: number | null
    starts_at: string
    max_size: number
    difficulty: Difficulty
    pace: Pace
    notes?: string
    ends_at?: string | null
}

export type RequestStatus = 'requested' | 'accepted' | 'declined' | 'withdrawn'
export type JoinRequestInput = {
    role: HikerRole;
    seats_offered?: number; // Driver only
    guests?: number;
    note?: string;
};
export interface JoinRequest {
    id: string
    outing_id: string
    hiker_id: string
    status: RequestStatus
    role: HikerRole
    seats_offered: number
    guests: number
    note?: string
    created_at: string
    updated_at: string
}

