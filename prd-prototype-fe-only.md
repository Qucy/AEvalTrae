# PRD: AI-Assisted Evaluation Configuration System (Frontend Prototype)

## Introduction

This PRD defines a **Frontend-Only Prototype** for the AI-Assisted Evaluation Configuration System. The goal is to demonstrate the user experience (UX) and conversational interface without implementing the complex backend logic (database, embeddings, LLM integration) at this stage.

**Primary Goal:** Validate the UI/UX and conversation flow with a functional prototype using mock data and local state.

## Goals

- **Demonstrate the "Happy Path"**: Show a complete user journey from intent description to evaluation creation.
- **Interactive UI**: Implement the chat interface, recommendation cards, and lists.
- **Zero Backend Dependencies**: Run entirely in the browser using React/Next.js and mock data.
- **Fast Iteration**: Allow quick changes to UI/UX based on feedback without backend refactoring.
- **Modern Aesthetic**: Deliver a polished, 2024+ standard UI with fluid animations, glassmorphism, and high-quality typography.

## Tech Stack (Prototype)

- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (for accessible, customizable primitives)
- **Icons**: Lucide React
- **Animation**: Framer Motion (for fluid transitions and micro-interactions)
- **State Management**: React Context / Hooks (simulating backend state)
- **Data**: Static JSON files (Mock datasets, metrics, scenarios)

## Modern UI/UX Guidelines

To ensure the application feels contemporary and high-quality, we will adhere to the following design principles:

### 1. Visual Language & Aesthetics
- **Clean & Minimalist**: Generous whitespace (negative space) to reduce cognitive load. Avoid clutter.
- **Glassmorphism**: Subtle usage of backdrop blur (`backdrop-filter: blur()`) for modals, sticky headers, and floating panels to create depth and context.
- **Modern Color Palette**: 
  - Neutral background hierarchy (slate/zinc) for content focus.
  - Vibrant but refined accent colors (e.g., Indigo/Violet) for primary actions.
  - Semantic colors (Emerald for success, Amber for warnings) used sparingly.
- **Typography**: Inter or Geist Sans for crisp, highly readable text. Variable font weights to establish clear hierarchy without relying solely on size.
- **Borders & Shadows**: 
  - Soft, diffuse shadows (`box-shadow`) for elevation instead of harsh outlines.
  - Subtle 1px borders with low opacity for definition.
  - Rounded corners (`rounded-xl` or `rounded-2xl`) for a friendly, approachable feel.

### 2. Micro-interactions & Motion
- **Fluid Transitions**: All state changes (hover, active, open/close) should have smooth transitions (e.g., `transition-all duration-200 ease-in-out`).
- **Enter/Exit Animations**: Elements like chat messages, modals, and cards should fade and slide in using Framer Motion (`AnimatePresence`).
- **Feedback**: Immediate visual feedback for every user interaction (button clicks, toggle switches, input focus).
- **Loading States**: Shimmer/Skeleton loaders instead of generic spinners to maintain layout stability and perceived performance.

### 3. Component Specifics
- **Chat Interface**: 
  - Distinctive message bubbles with varying border radii to indicate "conversation clusters".
  - "Thinking" animations that feel organic (e.g., pulsing dots) rather than mechanical.
- **Cards**: 
  - Hover effects that slightly lift the card (`translate-y`) and deepen the shadow.
  - Content disclosure: Use accordions or expandable sections for "Why this recommendation?" to keep the initial view clean.
- **Inputs**: 
  - Floating labels or minimal outlines that highlight on focus.
  - Search inputs with integrated icons and clear buttons.

### 4. Dark Mode First (Optional but Recommended)
- Design with a "Dark Mode" mindset for developer tools, which often implies a sleek, professional, and eye-strain-reducing interface.

## User Stories (Frontend Prototype)

### Phase 1: Prototype Foundation (Mock Data)

#### US-P001: Create Mock Data Layer
**Description:** As a developer, I need a set of static data to simulate the backend database.
**Acceptance Criteria:**
- [ ] Create `src/mocks/datasets.json`: 10-15 sample datasets with semantic tags.
- [ ] Create `src/mocks/metrics.json`: 20-30 sample metrics with categories.
- [ ] Create `src/mocks/scenarios.json`: 5 standard testing scenarios.
- [ ] Create `src/mocks/agents.json`: 3 sample agents (RAG, Coding, Chatbot).
- [ ] Create `MockService` to query this data with artificial delay (500ms).

#### US-P002: Simulate AI Response Logic
**Description:** As a developer, I need a simple "Wizard of Oz" logic to simulate AI responses based on keywords.
**Acceptance Criteria:**
- [ ] Create `simulateIntentExtraction(input)`: Returns hardcoded intents based on keywords (e.g., "safety" -> Safety Scenario).
- [ ] Create `simulateRecommendation(intent)`: Returns filtered mock data.
- [ ] Support 3 specific "Demo Scripts" (e.g., RAG Safety, Code Eval, General Chat) that work perfectly.

### Phase 2: UI Components

#### US-P003: AI Assistant Modal
**Description:** As a user, I want to open the AI assistant from a "Create Evaluation" button.
**Acceptance Criteria:**
- [ ] "Let AI Help Me" button.
- [ ] Modal overlay with backdrop blur.
- [ ] Chat container with scrollable history.
- [ ] Input area with "Send" button.

#### US-P004: Chat Interface
**Description:** As a user, I want a polished chat interface to interact with the "AI".
**Acceptance Criteria:**
- [ ] Message bubbles (User: Blue/Right, System: Gray/Left).
- [ ] Typing indicator (3 dots animation).
- [ ] Markdown rendering for system messages.
- [ ] "Quick Reply" buttons for common user responses.

#### US-P005: Recommendation Card
**Description:** As a user, I want to see the "generated" recommendation in a card.
**Acceptance Criteria:**
- [ ] Display recommended Dataset, Metrics, and Agent.
- [ ] "Why this recommendation?" expandable section.
- [ ] "Accept" and "Modify" buttons.

### Phase 3: Interactive Flows

#### US-P006: Conversation Flow
**Description:** As a user, I want to have a multi-turn conversation.
**Acceptance Criteria:**
- [ ] Turn 1: User types intent -> System asks clarifying question (optional) or gives recommendation.
- [ ] Turn 2: User refines (e.g., "Add safety metrics") -> System updates recommendation.
- [ ] Turn 3: User accepts -> System shows "Success" screen.

#### US-P007: Manual Refinement (Mocked)
**Description:** As a user, I want to manually toggle metrics in the recommendation.
**Acceptance Criteria:**
- [ ] Clicking "Modify" opens a simple checklist of metrics.
- [ ] Toggling metrics updates the "Estimated Cost" and "Duration" (mock formulas).

### Phase 4: Use Case Onboarding (Simplified)

#### US-P008: Use Case Wizard
**Description:** As a user, I want to step through a simple form to set up context.
**Acceptance Criteria:**
- [ ] 3-step form (Basic Info, Goals, Agent Details).
- [ ] Store result in LocalStorage to customize the "AI" greeting.

## Prototype Scope Limitations

- **No Real AI**: Responses are keyword-matched or hardcoded scripts.
- **No Persistence**: Refreshing the page resets the state (unless using LocalStorage).
- **No Authentication**: Assume a default "Admin User".
- **Limited Domain**: Only supports the 3 demo scenarios defined in US-P002.

## Timeline (Prototype)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 | Day 1-2 | Mock data & logic |
| Phase 2 | Day 3-4 | Core UI components |
| Phase 3 | Day 5-6 | Interactive flows |
| Phase 4 | Day 7 | Polish & Onboarding |

## Smart Recommendation System

### Filter-Based Intelligent Matching

The prototype implements a sophisticated **tag-based filtering system** that transforms user intent into personalized evaluation configurations. This system addresses the key challenge of helping users navigate complex evaluation choices without requiring deep domain expertise.

#### How It Works

1. **Semantic Tagging**: All datasets include descriptive tags (e.g., `["support", "qa", "empathy"]`) that capture their domain and purpose
2. **Intent Extraction**: User input is analyzed for keywords that map to predefined evaluation scenarios
3. **Smart Filtering**: The system matches user intent to relevant datasets, metrics, and agents using tag-based filtering
4. **Contextual Recommendations**: Results are ranked based on relevance, cost, and historical effectiveness

#### Example Implementation

```typescript
// User input: "Test my RAG agent for safety"
// Intent extracted: "rag_safety"
// System filters datasets by safety/support tags
// Selects Hallucination Rate, Toxicity Score, Refusal Rate metrics
// Recommends Customer Support QA dataset + RAG agent
```

This approach provides **smooth and smart recommendations** by encoding evaluation expertise into the tag system, allowing users to get expert-level configurations through natural language interaction.

## Appendix: Demo Scripts

### Script 1: RAG Safety
- **User**: "Test my RAG agent for safety"
- **System**: Recommends "Customer Support QA" dataset + Safety Metrics.
- **Refinement**: "Make it cheaper" -> System switches to "Subset" mode.

### Script 2: Code Eval
- **User**: "Evaluate python coding ability"
- **System**: Recommends "HumanEval" + Accuracy Metrics.
