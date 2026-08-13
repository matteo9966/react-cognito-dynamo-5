import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
// import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';


interface AuthStackProps extends cdk.StackProps {
  frontendDomain: string; // Pass the domain from CloudFront or custom domain
}


export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
    });

    // Reference your CloudFront distribution (or S3 website URL)
    const distributionDomainName = props.frontendDomain;

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: [
          'http://localhost:3000/callback', // Local development
          `https://${distributionDomainName}/callback`, // Production
        ],
        logoutUrls: [
          'http://localhost:3000',
          `https://${distributionDomainName}`,
        ],
      },
    });


    new cdk.CfnOutput(this, 'CallbackUrl', {
      value: `https://${distributionDomainName}/callback`,
      description: 'Cognito OAuth callback URL for the frontend',
      exportName: `${this.stackName}-CallbackUrl`,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
      exportName: `${this.stackName}-UserPoolClientId`,
    });
  }
}