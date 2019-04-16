// dependencies
let AWS = require('aws-sdk');

// get reference to S3 client
AWS.config.update({region: 'ap-northeast-1'});
let s3 = new AWS.S3();
let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event) => {
    let bucket = event.Records[0].s3.bucket.name;
    // Compose the task json file key.
    let key    = 'q/' + event.Records[0].s3.object.key.replace(/\.\w+$/, '.json').substring(2);

    // Download the task from S3, and send message to sqs.
    const [{Body}, {QueueUrl}] = await Promise.all([
        s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise(),
        sqs.getQueueUrl({
            QueueName: bucket.substring(12) + '_high_priority_task',
        }).promise()
    ]);

    const {MessageId} = await sqs.sendMessage({
        MessageBody: Body.toString('utf-8'),
        QueueUrl: QueueUrl,
    }).promise();

    const response = {
        statusCode: 200,
        body: MessageId,
    };
    return response;
};