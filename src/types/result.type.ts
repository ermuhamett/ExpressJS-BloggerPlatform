//import {OutputErrorsType} from "../input-output-types/output-errors-type";

export enum ResultStatus {
    Success = "Success",
    NotFound="NotFound",
    Forbidden="Forbidden",
    Unauthorized="Unauthorized",
    BadRequest="BadRequest"
}

export type OutputErrorsType = {
    errorsMessages: { message: string; field: string }[];
};

export type Result<T> ={
    status:ResultStatus;
    errorsMessage:OutputErrorsType;
}