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
    // NOTE: According to the official doc, it requires arguments
    //       but it does not work unless executed without arguments
    const token = await signer.getDbConnectAuthToken();
    return token;
  } catch (error) {
    console.error('Failed to generate token: ', error);
    throw error;
  }
};

let dataSource: DataSource;
const getDataSource = async (): Promise<DataSource> => {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  const password = await generateToken(hostname, region);
  dataSource = new DataSource({
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
  return dataSource;
};

export const handler = async () => {
  const ds = await getDataSource();
  const result = await ds.query('SELECT * FROM testschema.users');
  console.log('SQL result:', result);
};
