# Task Manager Database Schema Documentation

## Introduction
This documentation provides a detailed explanation of the Task Manager application's database schema, implemented using AWS DynamoDB. The schema is designed to support individual users managing projects and tasks with file attachments.

## Database Overview

### Technology Stack
- **Database**: AWS DynamoDB (NoSQL)
- **File Storage**: AWS S3
- **Authentication**: AWS Cognito

### Design Principles
1. **Scalability**: Designed for efficient scaling with DynamoDB
2. **Performance**: Optimized for common access patterns
3. **Security**: Strong data isolation and access control
4. **Reliability**: Consistent data access and integrity

## Detailed Table Specifications

### 1. Users Table
**Purpose**: Stores user information and tracks project limits

**Primary Key Structure**:
- Partition Key: `id` (Cognito User ID)
- No Sort Key

**Attributes**:
| Attribute    | Type   | Description                                    | Constraints |
|-------------|--------|------------------------------------------------|-------------|
| id          | String | Unique identifier from Cognito                 | Required    |
| email       | String | User's email address                           | Required    |
| name        | String | User's display name                            | Required    |
| createdAt   | String | ISO timestamp of account creation              | Required    |
| updatedAt   | String | ISO timestamp of last update                   | Required    |
| lastLoginAt | String | ISO timestamp of last login                    | Required    |
| projectCount| Number | Number of active projects (max 10)             | 0-10        |

**Access Patterns**:
- Get user profile by ID
- Update user information
- Track project count

### 2. Projects Table
**Purpose**: Manages project information and tracks task limits

**Primary Key Structure**:
- Partition Key: `id` (UUID)
- Sort Key: `userId` (User ID)

**Attributes**:
| Attribute    | Type   | Description                                    | Constraints |
|-------------|--------|------------------------------------------------|-------------|
| id          | String | Unique project identifier                      | Required    |
| userId      | String | Owner's user ID                                | Required    |
| name        | String | Project name                                   | Required    |
| description | String | Project description                            | Optional    |
| status      | String | 'ACTIVE' or 'ARCHIVED'                         | Required    |
| progress    | Number | Overall progress (0-100)                       | 0-100       |
| deadline    | String | ISO timestamp of deadline                      | Optional    |
| createdAt   | String | ISO timestamp of creation                      | Required    |
| updatedAt   | String | ISO timestamp of last update                   | Required    |
| taskCount   | Number | Number of tasks (max 1000)                     | 0-1000      |

**Access Patterns**:
- Create/Update/Delete project
- List user's projects
- Get project details
- Track task count

### 3. Tasks Table
**Purpose**: Manages task information within projects

**Primary Key Structure**:
- Partition Key: `id` (UUID)
- Sort Key: `projectId` (Project ID)

**Attributes**:
| Attribute      | Type   | Description                                    | Constraints |
|---------------|--------|------------------------------------------------|-------------|
| id            | String | Unique task identifier                         | Required    |
| projectId     | String | Parent project ID                              | Required    |
| userId        | String | Owner's user ID                                | Required    |
| name          | String | Task name                                      | Required    |
| description   | String | Task description                               | Optional    |
| status        | String | 'TODO', 'IN_PROGRESS', or 'COMPLETED'          | Required    |
| progress      | Number | Task progress (0-100)                          | 0-100       |
| deadline      | String | ISO timestamp of deadline                      | Optional    |
| createdAt     | String | ISO timestamp of creation                      | Required    |
| updatedAt     | String | ISO timestamp of last update                   | Required    |
| attachmentCount| Number | Number of attachments                          | Required    |

**Access Patterns**:
- Create/Update/Delete task
- List tasks in project
- Get task details
- Track attachment count

### 4. Attachments Table
**Purpose**: Manages file attachments for tasks

**Primary Key Structure**:
- Partition Key: `id` (UUID)
- Sort Key: `taskId` (Task ID)

**Attributes**:
| Attribute  | Type   | Description                                    | Constraints |
|-----------|--------|------------------------------------------------|-------------|
| id        | String | Unique attachment identifier                   | Required    |
| taskId    | String | Parent task ID                                 | Required    |
| userId    | String | Owner's user ID                                | Required    |
| projectId | String | Parent project ID                              | Required    |
| fileName  | String | Original file name                             | Required    |
| fileType  | String | MIME type                                      | Required    |
| fileSize  | Number | Size in bytes (max 25MB)                       | ≤ 25MB      |
| s3Key     | String | S3 object key                                  | Required    |
| createdAt | String | ISO timestamp of creation                      | Required    |
| updatedAt | String | ISO timestamp of last update                   | Required    |

**Access Patterns**:
- Upload/Delete attachment
- List attachments for task
- Get attachment details

## Global Secondary Indexes (GSI)

### 1. ProjectsByUser
- **Partition Key**: userId
- **Sort Key**: createdAt
- **Purpose**: Efficiently list all projects for a user
- **Use Case**: Project dashboard, project listing

### 2. TasksByProject
- **Partition Key**: projectId
- **Sort Key**: createdAt
- **Purpose**: Efficiently list all tasks in a project
- **Use Case**: Task listing, project view

### 3. AttachmentsByTask
- **Partition Key**: taskId
- **Sort Key**: createdAt
- **Purpose**: Efficiently list all attachments for a task
- **Use Case**: File attachment management

## Data Access Patterns

### User Management
1. **Get User Profile**
   - Table: Users
   - Key: id (partition key)
   - Operation: GetItem

2. **Update User Profile**
   - Table: Users
   - Key: id (partition key)
   - Operation: UpdateItem

### Project Management
1. **Create Project**
   - Table: Projects
   - Operation: PutItem
   - Validation: Check projectCount in Users table

2. **List User's Projects**
   - Index: ProjectsByUser
   - Key: userId (partition key)
   - Operation: Query

3. **Get Project Details**
   - Table: Projects
   - Key: id (partition key), userId (sort key)
   - Operation: GetItem

### Task Management
1. **Create Task**
   - Table: Tasks
   - Operation: PutItem
   - Validation: Check taskCount in Projects table

2. **List Project Tasks**
   - Index: TasksByProject
   - Key: projectId (partition key)
   - Operation: Query

3. **Update Task Status**
   - Table: Tasks
   - Key: id (partition key), projectId (sort key)
   - Operation: UpdateItem

### File Attachment Management
1. **Upload Attachment**
   - Table: Attachments
   - Operation: PutItem
   - Storage: S3 upload with multipart support

2. **List Task Attachments**
   - Index: AttachmentsByTask
   - Key: taskId (partition key)
   - Operation: Query

## Security Considerations

### Data Isolation
- All tables include userId for data isolation
- Access control through IAM policies
- Row-level security through partition keys

### File Security
- S3 bucket with proper access controls
- Pre-signed URLs for file access
- File scanning for malicious content
- Size and type validation

## Performance Considerations

### Partitioning Strategy
- Even distribution of data across partitions
- Use of composite keys for efficient queries
- Proper use of GSIs for common access patterns

### Optimization Techniques
1. **Denormalization**
   - Include userId in all tables for data isolation
   - Include projectId in Tasks and Attachments for efficient querying

2. **Counter Attributes**
   - Track projectCount in Users table
   - Track taskCount in Projects table
   - Track attachmentCount in Tasks table

3. **Indexing Strategy**
   - GSIs for common query patterns
   - Efficient sorting and filtering
   - Proper key design for access patterns

## Maintenance and Monitoring

### Key Metrics to Monitor
1. **Performance Metrics**
   - Read/Write capacity units
   - Throttling events
   - Latency

2. **Storage Metrics**
   - Table size
   - Index size
   - Item count

3. **Cost Metrics**
   - Storage costs
   - Read/Write costs
   - Index costs

### Backup and Recovery
- Point-in-time recovery enabled
- Regular backup strategy
- Disaster recovery plan

## Best Practices Implementation

1. **Naming Conventions**
   - Consistent naming across tables
   - Clear and descriptive attribute names
   - Proper use of camelCase

2. **Data Types**
   - Appropriate use of string, number, and boolean types
   - ISO timestamp format for dates
   - Proper use of enums for status fields

3. **Error Handling**
   - Proper validation of input data
   - Handling of conditional check failures
   - Proper error messages and logging 