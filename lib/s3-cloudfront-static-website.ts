import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export interface S3CloudFrontStaticWebsiteProps extends cdk.StackProps {
  frontendDistDir?: string;
}  

export class S3CloudFrontStaticWebsite  extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: S3CloudFrontStaticWebsiteProps = {}) {
    super(scope, id, props);

    const frontendDistDir = props.frontendDistDir ?? path.join(__dirname, '../frontend/dist');
    // const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');


    this.bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    //   enforceSSL: true,
    //   websiteIndexDocument: 'index.html',
    //   websiteErrorDocument: 'index.html',
     versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // this.bucket.grantRead(originAccessIdentity.grantPrincipal);

    if (fs.existsSync(frontendDistDir)) {
      new s3deploy.BucketDeployment(this, 'DeployFrontendDist', {
        sources: [s3deploy.Source.asset(frontendDistDir)],
        destinationBucket: this.bucket,
        distribution: this.distribution,
        distributionPaths: ['/*'],
      });
    }

        new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 Bucket Name',
      exportName: `${this.stackName}-BucketName`,
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: this.bucket.bucketArn,
      description: 'S3 Bucket ARN',
      exportName: `${this.stackName}-BucketArn`,
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: this.bucket.bucketWebsiteUrl,
      description: 'S3 Static Website URL',
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${this.distribution.distributionDomainName}`,
      description: 'Public HTTPS URL for the website',
      exportName: `${this.stackName}-CloudFrontUrl`,
    });

    // CloudFront Distribution ID (useful for manual/CI invalidation commands)
    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront Distribution ID',
      exportName: `${this.stackName}-DistributionId`,
    });

    // CloudFront Domain Name
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront Domain Name',
      exportName: `${this.stackName}-DistributionDomainName`,
    });

  }

  


}
