import { FileModel } from '../models/file.model';
export declare class UploadService {
    private _url;
    private _method;
    private _authTokenPrefix;
    private _authToken;
    private _fieldName;
    private _formFields;
    private _withCredentials;
    _queue: FileModel[];
    constructor();
    addToQueue(files: any[]): FileModel[];
    private _uploadFilesInTheQueue();
    uploadFile(uploadingFileModel: any): void;
    getQueue(): FileModel[];
    private _isFile(file);
}
