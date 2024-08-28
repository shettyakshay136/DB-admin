export interface IResponse<T> {
    success: boolean;
    message: string;
    data: T;
    metaData?: {
        total: number;
        page: number;
    };
}

export enum OrderEnum {
    ASC = "ASC",
    DESC = "DESC",
}

export type ErrorMessageState = React.Dispatch<React.SetStateAction<{ message: string; severity: "success" | "error" } | null>>;
