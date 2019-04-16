# DocumentUploadedHandler
Triggered by S3 event and send task to SQS
* S3 event prefix: u/
* SQS messages store in S3 with prefix: q/

** Flow **
1. Client call API to request permission PUT file with parameters
2. API calculate S3 key with u/ prefix and signed that url
3. API save message related to file extension to S3 with prefix q/
4. API return that signed url
5. Client PUT file to signed url
6. S3 triggered *DocumentUploadedHandler*
7. Get message from S3 with prefix q/
8. Send message to SQS