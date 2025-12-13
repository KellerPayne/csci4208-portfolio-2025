# Planning & Specification, Frontend Design, Backend Design, Data Design — <capstone-02><capstone-03><capstone-04><capstone-05>

**Team repo:** [Keller's Capstone Repo](https://github.com/KellerPayne/csci4208-capstone-project-repo) 
**Project (v2) board:** 
- [Sprint 2 Project Board](https://github.com/users/KellerPayne/projects/8)  
- [Sprint 3 Project Board](https://github.com/users/KellerPayne/projects/9)

## Deliverables for these phases
- Defined system requirements using user stories
- Designed frontend structure, interactions, and tooling
- Designed backend architecture, API endpoints, and services
- Designed data models and CRUD responsibilities
- Frontend UI Structure and Interactions
- Controller and View Responsibilities
- Tooling Selection
- Backend architecture and Service Design
- REST API endpoint definitions
- Tooling and authentication approach
- Data model definitions
- CRUD responsibility plan
- Persistence strategy

## Summary (what we produced)
- A complete planning and specification document describing system goals and user needs
- Frontend design documentation including UI structure, interactions, and controller logic
- Backend design documentation including service responsibilities and REST API design
- Data design documentation describing schemas and CRUD operations
- Designed a simple, intuitive quiz interface
- Defined how UI state changes in response to server events
- Implemented client-side controllers to manage gameplay flow
- A layered Express backend with clear separation of concerns
- RESTful API endpoints supporting quiz gameplay
- Stateless request handling with UUID-based player tracking
- Defined JSON schemas for players, sessions, and questions
- Mapped CRUD operations to system events
- Selected lightweight file-based persistence

## Evidence / Artifacts
- [api_endpoints.md](https://github.com/KellerPayne/csci4208-capstone-project-repo/blob/main/docs/api_endpoints.md)

- [architecture_sketch.md](https://github.com/KellerPayne/csci4208-capstone-project-repo/blob/main/docs/architecture_sketch.md)

- [roadmap.md](https://github.com/KellerPayne/csci4208-capstone-project-repo/blob/main/docs/roadmap.md)

```sql
Join Screen -> Question View -> Leaderboard
```
- Views
    - Join Card View
    - Question Display View
    - Status/Feedback View
    - Leaderboard View

- Controllers
    - joinGame() creates player and session
    - loadQuestion() retrieves current question
    - submitAnswer() sends answer to backend
    - updateLeaderboard() renders rankings

- Tooling
    - HTML
    - CSS
    - Vanilla JavaScript
    - Fetch API
    - Node.js
    - Express.js
    - UUID
    - fs mode

- Architecture
```javascript
Routes -> Services -> JSON Data
```
- Services
    - Player Service
    - Session Service
    - Quiz Service

- Player Model
    ```json
    {
        "id": "uuid",
        "name": "PlayerName",
        "score": 0,
        "createdAt": "Date.now()"
    }
    ```
- Session Model
    ```json
    {
        "id": "uuid",
        "subjectPrefix": "os",
        "currentQuestionId": "os_004",
        "players": ["playerId"]
    }
    ```
- Question Model
    ```json
    {
        "id": "os_004",
        "text": "What is a deadlock?",
        "choices": [...],
        "correctIndex": 2
    }
    ```

- CRUD Plan
    - Players: Create, Read, Update
    - Sessions: Create, Read, Update
    - Questions: Read-only

## Notes & Risks
- JSON based persistence is not scalable
- No authentication beyond UUID-based player identification
- Sesson management assumes low concurrency
- No frontend framework limits scalability but improves clarity
- UI depends on successful backend responses
- No persistent database
- No authentication beyond session validation
- Concurrency not fully addressed
- JSON persistence may cause race condition under load
- No migration or versioning support
