const { Client } = require('pg');

const connectionString = "postgres://postgres.xmapjrywkmygxwrctiyi:2580@HoldMyBeer@2580@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require";

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runSQL() {
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Add rfid_scans to supabase_realtime publication
    await client.query(`
      ALTER PUBLICATION supabase_realtime ADD TABLE rfid_scans;
    `);
    console.log("Realtime enabled for rfid_scans.");

  } catch (err) {
    if (err.message.includes("already exists") || err.message.includes("is already in publication")) {
      console.log("Table is already in publication. All good!");
    } else {
      console.error("Error executing SQL:", err.message);
    }
  } finally {
    await client.end();
  }
}

runSQL();
