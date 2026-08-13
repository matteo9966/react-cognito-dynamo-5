// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import { S3CloudFrontStaticWebsite } from './s3-cloudfront-static-website';

// export class ReactCognitoDynamo5Stack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const frontendWebsite = new S3CloudFrontStaticWebsite(this, 'FrontendWebsite');

//     new cdk.CfnOutput(this, 'FrontendBucketName', {
//       value: frontendWebsite.bucket.bucketName,
//       description: 'S3 bucket for the frontend dist files',
//     });

//     new cdk.CfnOutput(this, 'FrontendUrl', {
//       value: `https://${frontendWebsite.distribution.distributionDomainName}`,
//       description: 'CloudFront URL for the frontend',
//     });
//   }
// }
