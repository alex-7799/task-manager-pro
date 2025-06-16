# Task Manager Database Schema

## Overview
This document outlines the database schema for the Task Manager application using AWS DynamoDB. The schema is designed to support individual users with up to 10 projects per user and 1,000 tasks per project, including file attachments.

## Table Definitions

### 1. Users Table
```typescript
interface User {
  id: string;                    // Partition Key: Cognito User ID
  email: string;                 // User's email address
  name: string;                  // User's display name
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
  lastLoginAt: string;          // ISO timestamp
  projectCount: number;         // Tracks number of active projects (max 10)
}
```

### 2. Projects Table
```typescript
interface Project {
  id: string;                    // Partition Key: UUID
  userId: string;                // Sort Key: User ID
  name: string;                  // Project name
  description: string;           // Project description
  status: 'ACTIVE' | 'ARCHIVED'; // Project status
  progress: number;              // Overall progress (0-100)
  deadline: string;              // ISO timestamp
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
  taskCount: number;            // Tracks number of tasks (max 1000)
}
```

### 3. Tasks Table
```typescript
interface Task {
  id: string;                    // Partition Key: UUID
  projectId: string;             // Sort Key: Project ID
  userId: string;                // User ID (for data isolation)
  name: string;                  // Task name
  description: string;           // Task description
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;              // Task progress (0-100)
  deadline: string;              // ISO timestamp (optional)
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
  attachmentCount: number;       // Tracks number of attachments
}
```

### 4. Attachments Table
```typescript
interface Attachment {
  id: string;                    // Partition Key: UUID
  taskId: string;                // Sort Key: Task ID
  userId: string;                // User ID (for data isolation)
  projectId: string;             // Project ID (for data isolation)
  fileName: string;              // Original file name
  fileType: string;              // MIME type
  fileSize: number;              // Size in bytes (max 25MB)
  s3Key: string;                 // S3 object key
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
}
```

## Indexes

### Global Secondary Indexes (GSI)

1. **ProjectsByUser**
   - Partition Key: userId
   - Sort Key: createdAt
   - Purpose: List all projects for a user

2. **TasksByProject**
   - Partition Key: projectId
   - Sort Key: createdAt
   - Purpose: List all tasks in a project

3. **AttachmentsByTask**
   - Partition Key: taskId
   - Sort Key: createdAt
   - Purpose: List all attachments for a task

## Data Access Patterns

1. **User Management**
   - Get user by ID
   - Update user profile
   - Track user's project count

2. **Project Management**
   - Create/Update/Delete project
   - List user's projects
   - Get project details
   - Track project's task count

3. **Task Management**
   - Create/Update/Delete task
   - List tasks in a project
   - Get task details
   - Track task's attachment count

4. **File Attachment Management**
   - Upload/Delete attachment
   - List attachments for a task
   - Get attachment details

## Constraints and Validations

1. **User Constraints**
   - Maximum 10 active projects per user
   - Project count tracked in User table

2. **Project Constraints**
   - Maximum 1,000 tasks per project
   - Task count tracked in Project table

3. **File Attachment Constraints**
   - Maximum file size: 25MB
   - Supported file types: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, BMP
   - File type validation on upload

## Security Considerations

1. **Data Isolation**
   - All tables include userId for data isolation
   - Access control through IAM policies

2. **File Security**
   - S3 bucket with proper access controls
   - Pre-signed URLs for file access
   - File scanning for malicious content

## Performance Considerations

1. **Partitioning Strategy**
   - Even distribution of data across partitions
   - Use of composite keys for efficient queries

2. **Indexing Strategy**
   - GSIs for common query patterns
   - Efficient sorting and filtering

3. **Data Modeling**
   - Denormalization where appropriate
   - Counter attributes for limits enforcement 