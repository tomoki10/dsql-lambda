import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export class DsqlLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dsqlLambda = new nodejs.NodejsFunction(this, 'DsqlLambda', {
      entry: 'src/index.ts',
      runtime: lambda.Runtime.NODEJS_LATEST,
      environment: {
        DB_USER: 'member',
        DATABASE: 'postgres',
        HOST_NAME: process.env.CLUSTER_ENDPOINT!, // HAK
        REGION: 'us-east-1',
        SCHEMA: 'testschema',
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dsql:DbConnect'],
          resources: [
            // See: https://docs.aws.amazon.com/aurora-dsql/latest/userguide/using-iam-condition-keys.html
            this.formatArn({
              service: 'dsql',
              region: 'us-east-1',
              resource: 'cluster',
              resourceName: process.env.CLUSTER_ID!,
            }),
          ],
        }),
      ],
    });

    // Create the role first and then register it with the DSQL role
    new cdk.CfnOutput(this, 'LambdaRoleArn', {
      value: dsqlLambda.role!.roleArn,
    });
  }
}
