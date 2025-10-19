// Complex document (nested arrays + cross references) — schema only, no validation.

const schema_with_demo_data = ({
    version: 1,
    rev: 1,
    updatedAt: new Date().toISOString(),
    users: [
      { id: "u-alice", name: "Alice" },
      { id: "u-bob",   name: "Bob" }
    ],
    projects: [
      { id: "p-1", name: "Course Site", ownerId: "u-alice", tagIds: ["t-web"] }
    ],
    todos: [
      {
        id: "t-1",
        projectId: "p-1",
        title: "Set up repo",
        done: false,
        assignedTo: "u-alice",
        due: "2025-10-10",
        subtasks: [{ id:"s-1", title:"README", done:true }, { id:"s-2", title:"CI", done:false }],
        commentIds: ["c-1"],
        tagIds: ["t-setup"]
      }
    ],
    comments: [
      { id: "c-1", todoId: "t-1", authorId: "u-bob", text: "Add badges", ts: "2025-10-01T15:00:00Z" }
    ],
    tags: [
      { id: "t-web",   name: "web" },
      { id: "t-setup", name: "setup" }
    ]
});


export function seedDoc() {
  return schema_with_demo_data;
}

