export class Package {
    name: string;
    alocated: number;
    used: number;
    status: boolean;

    constructor(name: string, alocated: number, used: number, status: boolean ) {
        this.name = name;
        this.alocated = alocated;
        this.used = used;
        this.status = status;
    }
}