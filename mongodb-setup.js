/**
 * MongoDB Shell Script: Users & Registration Database Setup
 * Run with: mongosh mongodb-setup.js
 * Or from mongosh: load("mongodb-setup.js")
 */

// Use database (creates it on first write)
db = db.getSiblingDB("loginform_users");

// Create users collection with validator (optional but recommended)
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "createdAt"],
      properties: {
        email: {
          bsonType: "string",
          description: "User email - required and must be unique"
        },
        username: {
          bsonType: "string",
          description: "Display name or username"
        },
        passwordHash: {
          bsonType: "string",
          description: "Hashed password - never store plain text"
        },
        createdAt: {
          bsonType: "date",
          description: "Registration timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp"
        },
        verified: {
          bsonType: "bool",
          description: "Email verified flag",
          default: false
        },
        role: {
          enum: ["user", "admin"],
          description: "User role"
        }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "warn"
});

// Unique index on email (no duplicate signups)
db.users.createIndex({ email: 1 }, { unique: true });

// Unique index on username if you use it for login
db.users.createIndex({ username: 1 }, { unique: true, sparse: true });

// Index for lookups and sorting
db.users.createIndex({ createdAt: -1 });

print("Database 'loginform_users' and collection 'users' are ready.");
print("Indexes: email (unique), username (unique, sparse), createdAt.");
print("\nExample document structure:");
printjson({
  email: "user@example.com",
  username: "johndoe",
  passwordHash: "<bcrypt-or-argon2-hash>",
  createdAt: new Date(),
  updatedAt: new Date(),
  verified: false,
  role: "user"
});
