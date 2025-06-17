import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
    
  User: a
    .model({
      email: a.string().required(),
      name: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      lastLoginAt: a.datetime().required(),
      projectCount: a.integer().required(),
      projects: a.hasMany("Project", "userId"),
    })
    .authorization((allow) => [allow.owner()]),

  Project: a
    .model({
      name: a.string().required(),
      description: a.string(),
      status: a.enum(["ACTIVE", "ARCHIVED"]),
      progress: a.integer().required(),
      deadline: a.datetime(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      taskCount: a.integer().required(),
      userId: a.string().required(),
      user: a.belongsTo("User", "userId"),
      tasks: a.hasMany("Task", "projectId"),
    })
    .authorization((allow) => [allow.owner()])
    .secondaryIndexes((index) => [
      index("userId").sortKeys(["createdAt"]).name("byUser"),
    ]),

  Task: a
    .model({
      name: a.string().required(),
      description: a.string(),
      status: a.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
      progress: a.integer().required(),
      deadline: a.datetime(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      attachmentCount: a.integer().required(),
      projectId: a.string().required(),
      userId: a.string().required(),
      project: a.belongsTo("Project", "projectId"),
      attachments: a.hasMany("Attachment", "taskId"),
    })
    .authorization((allow) => [allow.owner()])
    .secondaryIndexes((index) => [
      index("projectId").sortKeys(["createdAt"]).name("byProject"),
    ]),

  Attachment: a
    .model({
      fileName: a.string().required(),
      fileType: a.string().required(),
      fileSize: a.integer().required(),
      s3Key: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      taskId: a.string().required(),
      userId: a.string().required(),
      projectId: a.string().required(),
      task: a.belongsTo("Task", "taskId"),
    })
    .authorization((allow) => [allow.owner()])
    .secondaryIndexes((index) => [
      index("taskId").sortKeys(["createdAt"]).name("byTask"),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool", // Default authorization mode for authenticated users
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
