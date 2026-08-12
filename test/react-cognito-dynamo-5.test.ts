// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import { ReactCognitoDynamo5Stack } from '../lib/react-cognito-dynamo-5-stack';

// test('frontend static website bucket and distribution are created', () => {
//   const app = new cdk.App();

//   const stack = new ReactCognitoDynamo5Stack(app, 'MyTestStack');
//   const template = Template.fromStack(stack);

//   template.hasResourceProperties('AWS::S3::Bucket', {
//     WebsiteConfiguration: {
//       IndexDocument: 'index.html',
//       ErrorDocument: 'index.html',
//     },
//   });

//   template.resourceCountIs('AWS::CloudFront::Distribution', 1);
// });
