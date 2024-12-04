import { DsqlSigner } from '@aws-sdk/dsql-signer';
import { DataSource } from 'typeorm';

const username = process.env.DB_USER;
const database = process.env.DATABASE;
const hostname = process.env.HOST_NAME!;
const region = process.env.REGION!;
const schema = process.env.SCHEMA!;

const generateToken = async (hostname: string, region: string) => {
  const signer = new DsqlSigner({
    hostname: hostname,
    region,
  });
  try {
    //MEMO: 公式では引数ありになっているが、引数なしで実行しないと動作しない
    const token = await signer.getDbConnectAuthToken();
    return token;
  } catch (error) {
    console.error('Failed to generate token: ', error);
    throw error;
  }
};

export const handler = async () => {
  const password = await generateToken(hostname, region);
  const dataSource = new DataSource({
    type: 'postgres',
    host: hostname,
    port: 5432,
    username,
    password,
    database,
    schema,
    ssl: true,
  });
  await dataSource.initialize();
  const result = await dataSource.query('SELECT * FROM testschema.users');
  console.log('SQL result:', result);
};
