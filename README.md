# Aurora DSQL with Lambda access sample 

## Setup

Ref: https://docs.aws.amazon.com/aurora-dsql/latest/userguide/using-database-and-iam-roles.html

### Lambda Deploy
```bash
% export CLUSTER_ID='xxxxxxxxxx.dsql.us-east-1.on.aws'
% npx cdk deploy

Outputs:
DsqlLambdaStack.LambdaRoleArn = arn:aws:iam::111122223333:role/DsqlLambdaStack-DsqlLambdaServiceRoleXXX
```

### Login Aurora DSQL Admin & DB setup

```bash
% aws dsql generate-db-connect-admin-auth-token \
  --region us-east-1 \
  --expires 3600 \
  --hostname xxxxxxxxxx.dsql.us-east-1.on.aws

% psql --host=xxxxxxxxxx.dsql.us-east-1.on.aws \
  --port=5432 \
  --dbname=postgres \
  --username=admin

postgres=> 
CREATE SCHEMA testschema
CREATE TABLE users(user_id int, name text);
INSERT INTO users (user_id, name) VALUES 
    (1, 'John Smith'),
    (2, 'Maria Garcia'),
    (3, 'Yuki Tanaka'),
    (4, 'David Wilson'),
    (5, 'Sarah Johnson');

CREATE ROLE member WITH LOGIN;
AWS IAM GRANT member TO 'arn:aws:iam::111122223333:role/DsqlLambdaStack-DsqlLambdaServiceRoleXXX'; 
GRANT USAGE ON SCHEMA testschema TO member;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA testschema TO member;
exit
```

