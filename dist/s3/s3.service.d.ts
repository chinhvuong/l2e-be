import * as AWS from 'aws-sdk';
export declare class S3Service {
    private bucket;
    private s3;
    constructor();
    uploadFile(file: any): Promise<AWS.S3.ManagedUpload.SendData>;
    deletedFile(objFile: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError> | undefined>;
}
