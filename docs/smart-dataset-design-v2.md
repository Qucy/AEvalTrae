# Smart Dataset Module Design V2

## 1. Overview
This design enhances the Dataset Module to support "Smart Metadata Generation" and "Scenario-based Recommendation". The core idea is to leverage LLM to automatically generate rich metadata (Name, Description, Tags) from the uploaded dataset content and the user's application background, minimizing manual entry and improving recommendation accuracy.

## 2. Core Workflows

### 2.1 Smart Dataset Creation
1.  **Input**: User provides:
    *   **File**: The dataset file (CSV, JSON, etc.).
    *   **Application Background (Optional)**: A brief description of the target scenario (e.g., "Customer Service Chatbot", "Code Generation").
2.  **Processing**:
    *   **Sampling**: System randomly samples a subset of records (e.g., 5-10 rows) from the uploaded file.
    *   **AI Generation**: System constructs a prompt using the *Application Background* and *Sampled Data*.
        *   Prompt: "Given the following dataset samples and the application context '{context}', generate a suitable Dataset Name, Description, and Semantic Tags."
    *   **Result**: LLM returns generated metadata with confidence scores.
3.  **Review & Refine**:
    *   User sees the generated Name, Description, and Tags.
    *   **Regenerate**: User can click "Regenerate" for specific fields or all fields. The system re-samples or uses a different temperature/prompt variation to offer new suggestions.
    *   **Edit**: User can manually edit any field.
4.  **Save**: System stores the dataset with the final metadata and the master-detail structure.

### 2.2 Recommendation Mapping
To enable the "user selected scenario -> recommend dataset" feature, we establish a mapping mechanism:
*   **Scenario -> Keywords**: Extract keywords/intent from the user's evaluation scenario.
*   **Dataset -> Tags/Metadata**: The generated tags and description serve as the matching target.
*   **Matching**: A vector search or keyword-based scoring system ranks datasets based on the overlap between Scenario Keywords and Dataset Tags/Description.

## 3. Data Model

### 3.1 Database Schema (Supabase/PostgreSQL)

**`dataset_master`**
Stores the high-level metadata and configuration.
*   `id` (UUID): Primary Key
*   `name` (String): Display name
*   `description` (Text): Detailed description
*   `tags` (Array<String>): Semantic tags for retrieval
*   `file_path` (String): Storage path
*   `file_format` (String): csv, json, etc.
*   `size` (String): Human-readable size
*   `total_records` (Integer): Count of rows
*   `metadata_quality_score` (Float): 0-1 score indicating metadata richness
*   `created_at` (Timestamp)
*   `updated_at` (Timestamp)
*   `application_context` (Text): The user-provided background context (used for regeneration)

**`dataset_detail`**
Stores the actual data records (or a sample/pointer to them).
*   `id` (UUID): Primary Key
*   `dataset_id` (UUID): Foreign Key
*   `content` (JSONB): The actual row data (input/output/trajectory, etc.)
*   `row_index` (Integer): Order in the file

## 4. Component Architecture

### 4.1 `DatasetMetadataEditor`
A reusable UI component for viewing and editing the AI-generated metadata.
*   **Props**:
    *   `initialData`: { name, description, tags }
    *   `onSave`: (data) => void
    *   `onRegenerate`: (field?) => Promise<NewData>
    *   `isGenerating`: boolean
*   **Features**:
    *   Confidence score visualization (Color-coded badges).
    *   "Regenerate" buttons (Global and per-field).
    *   Tag management (Add/Remove).

### 4.2 `DatasetCreationWizard` (in DatasetsPage)
Orchestrates the creation flow.
*   **Step 1: Upload & Context**: File dropzone + "Application Background" input.
*   **Step 2: Processing**: Show loading state (Scanning/Generating).
*   **Step 3: Review**: Render `DatasetMetadataEditor` with the generated results.
*   **Step 4: Save**: Commit to store/state.

## 5. Mock Implementation Plan
Since the backend is not fully connected in this prototype phase:
*   **Mock Service**: `generateMetadata(file, context)` will return simulated responses based on keywords in the filename or context.
*   **Regeneration**: Will return slightly modified variations of the current data (e.g., appending adjectives or changing tag order) to demonstrate the UI flow.
