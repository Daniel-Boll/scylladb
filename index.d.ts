/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export const enum Compression {
  None = 0,
  Lz4 = 1,
  Snappy = 2
}
export interface ClusterConfig {
  nodes: Array<string>
  compression?: Compression
  defaultExecutionProfile?: ExecutionProfile
  keyspace?: string
  auth?: Auth
  ssl?: Ssl
  /** The driver automatically awaits schema agreement after a schema-altering query is executed. Waiting for schema agreement more than necessary is never a bug, but might slow down applications which do a lot of schema changes (e.g. a migration). For instance, in case where somebody wishes to create a keyspace and then a lot of tables in it, it makes sense only to wait after creating a keyspace and after creating all the tables rather than after every query. */
  autoAwaitSchemaAgreement?: boolean
  /** If the schema is not agreed upon, the driver sleeps for a duration in seconds before checking it again. The default value is 0.2 (200 milliseconds) */
  schemaAgreementInterval?: number
}
export const enum Consistency {
  Any = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Quorum = 4,
  All = 5,
  LocalQuorum = 6,
  EachQuorum = 7,
  LocalOne = 10,
  Serial = 8,
  LocalSerial = 9
}
export const enum SerialConsistency {
  Serial = 8,
  LocalSerial = 9
}
export interface ExecutionProfile {
  consistency?: Consistency
  serialConsistency?: SerialConsistency
  requestTimeout?: number
}
export interface ConnectionOptions {
  keyspace?: string
  auth?: Auth
  ssl?: Ssl
}
export interface Auth {
  username: string
  password: string
}
export interface Ssl {
  caFilepath: string
  verifyMode?: VerifyMode
}
export const enum VerifyMode {
  None = 0,
  Peer = 1
}
export type ScyllaCluster = Cluster
export class Cluster {
  /**
   * Object config is in the format:
   * {
   *     nodes: Array<string>,
   * }
   */
  constructor(clusterConfig: ClusterConfig)
  /** Connect to the cluster */
  connect(keyspaceOrOptions?: string | ConnectionOptions | undefined | null, options?: ConnectionOptions | undefined | null): Promise<ScyllaSession>
}
export type ScyllaQuery = Query
export class Query {
  constructor(query: string)
  setConsistency(consistency: Consistency): void
  setSerialConsistency(serialConsistency: SerialConsistency): void
  setPageSize(pageSize: number): void
}
export class ScyllaPreparedStatement {
  setConsistency(consistency: Consistency): void
  setSerialConsistency(serialConsistency: SerialConsistency): void
}
export class Metrics {
  /** Returns counter for nonpaged queries */
  getQueriesNum(): bigint
  /** Returns counter for pages requested in paged queries */
  getQueriesIterNum(): bigint
  /** Returns counter for errors occurred in nonpaged queries */
  getErrorsNum(): bigint
  /** Returns counter for errors occurred in paged queries */
  getErrorsIterNum(): bigint
  /** Returns average latency in milliseconds */
  getLatencyAvgMs(): bigint
  /**
   * Returns latency from histogram for a given percentile
   *
   * # Arguments
   *
   * * `percentile` - float value (0.0 - 100.0), value will be clamped to this range
   */
  getLatencyPercentileMs(percentile: number): bigint
}
export class ScyllaSession {
  metrics(): Metrics
  execute(query: string | Query | ScyllaPreparedStatement, parameters?: Array<number | string | Uuid> | undefined | null): Promise<any>
  query(scyllaQuery: Query, parameters?: Array<number | string | Uuid> | undefined | null): Promise<any>
  prepare(query: string): Promise<ScyllaPreparedStatement>
  /**
   * Sends `USE <keyspace_name>` request on all connections\
   * This allows to write `SELECT * FROM table` instead of `SELECT * FROM keyspace.table`\
   *
   * Note that even failed `useKeyspace` can change currently used keyspace - the request is sent on all connections and
   * can overwrite previously used keyspace.
   *
   * Call only one `useKeyspace` at a time.\
   * Trying to do two `useKeyspace` requests simultaneously with different names
   * can end with some connections using one keyspace and the rest using the other.
   *
   * # Arguments
   *
   * * `keyspaceName` - keyspace name to use,
   * keyspace names can have up to 48 alphanumeric characters and contain underscores
   * * `caseSensitive` - if set to true the generated query will put keyspace name in quotes
   *
   * # Errors
   *
   * * `InvalidArg` - if the keyspace name is invalid
   *
   * # Example
   *
   * ```javascript
   * import { Cluster } from ".";
   *
   * const cluster = new Cluster({
   *   nodes: ["127.0.0.1:9042"],
   * });
   *
   * const session = await cluster.connect();
   *
   * await session.useKeyspace("system_schema");
   *
   * const result = await session
   *   .execute("SELECT * FROM scylla_tables limit ?", [1])
   *   .catch((err) => console.error(err));
   * ```
   */
  useKeyspace(keyspaceName: string, caseSensitive?: boolean | undefined | null): Promise<void>
  /**
   * session.awaitSchemaAgreement returns a Promise that can be awaited as long as schema is not in an agreement.
   * However, it won’t wait forever; ClusterConfig defines a timeout that limits the time of waiting. If the timeout elapses,
   * the return value is an error, otherwise it is the schema_version.
   *
   * # Returns
   *
   * * `Promise<Uuid>` - schema_version
   *
   * # Errors
   * * `GenericFailure` - if the timeout elapses
   *
   * # Example
   * ```javascript
   * import { Cluster } from ".";
   *
   * const cluster = new Cluster({ nodes: ["127.0.0.1:9042"] });
   * const session = await cluster.connect();
   *
   * const schemaVersion = await session.awaitSchemaAgreement().catch(console.error);
   * console.log(schemaVersion);
   *
   * const isAgreed = await session.checkSchemaAgreement().catch(console.error);
   * console.log(isAgreed);
   * ```
   */
  awaitSchemaAgreement(): Promise<Uuid>
  checkSchemaAgreement(): Promise<boolean>
}
export class Uuid {
  /** Generates a random UUID v4. */
  static randomV4(): Uuid
  /** Parses a UUID from a string. It may fail if the string is not a valid UUID. */
  static fromString(str: string): Uuid
  /** Returns the string representation of the UUID. */
  toString(): string
}
