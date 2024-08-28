export interface UserInterface {
    userName: string;
    email: string;
    employId: number;
    uid: number;
    trips?: TripsResponse[];
}

export interface TripsResponse {
    activeTrip: boolean;
    destinationAddress: string;
    startAddress: string;
    startTime: {
        seconds: number;
    };
    endTime: {
        seconds: number;
    }
    distance: string;
}
