import { Cluster, Uuid, Duration, Decimal, Float, Varint } from "../index.js";

const nodes = process.env.CLUSTER_NODES?.split(",") ?? ["127.0.0.1:9042"];

console.log(`Connecting to ${nodes}`);

const cluster = new Cluster({ nodes });
const session = await cluster.connect();

await session.execute(
  "CREATE KEYSPACE IF NOT EXISTS refactor WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }",
);
await session.useKeyspace("refactor");

await session.execute(
  `CREATE TABLE IF NOT EXISTS refactor (
      a int,
      b boolean,
      c duration,
      d decimal,
      e blob,
      f float,
      g varint,
      primary key (a)
    )`,
);
// TODO: varint, map

const a = await session
  .execute(
    "INSERT INTO refactor (a, b, c, d, e, f, g) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      1,
      true,
      new Duration(1, 1, 1),
      new Decimal([0x01, 0xe2, 0x40], 3),
      Buffer.from("hello").toJSON().data,
      new Float(8.3212),
    ],
  )
  .catch(console.error);
console.log(a);

const results = await session.execute("SELECT * FROM refactor");
console.log(results);