#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DsqlLambdaStack } from '../lib/dsql-lambda-stack';

const app = new cdk.App();
new DsqlLambdaStack(app, 'DsqlLambdaStack', {});
