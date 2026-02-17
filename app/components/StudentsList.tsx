"use client";

import React, { useEffect, useState } from "react";

type Student = {
  id: string;
  role: string;
  createdAt: string;
  user: { id: string; email: string | null; name?: string | null };
};

type Assignment = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  studentId: string;
  createdAt: string;
};

export default function StudentsList({ studioId }: { studioId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<{ [studentId: string]: { title: string; description: string; dueDate: string } }>(
    {}
  );

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/studio-data?studioId=${studioId}`);
    const data = await res.json();
    if (!res.ok) {
      console.error(data);
      setLoading(false);
      return;
    }
    setStudents(data.students || []);
    setAssignments(data.assignments || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [studioId]);

  async function handleSubmit(e: React.FormEvent, studentId: string) {
    e.preventDefault();
    const s = formState[studentId] || { title: "", description: "", dueDate: "" };
    if (!s.title) return alert("Title required");
    const res = await fetch(`/api/studio-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studioId, studentId, title: s.title, description: s.description, dueDate: s.dueDate || null }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed');
      return;
    }
    // clear form for that student
    setFormState((prev) => ({ ...prev, [studentId]: { title: "", description: "", dueDate: "" } }));
    fetchData();
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Students</h3>
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="space-y-4">
          {students.map((s) => (
            <div key={s.id} className="rounded-lg border p-4 bg-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.user.name ?? s.user.email ?? 'Student'}</div>
                  <div className="text-sm muted">{s.user.email}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-medium">Assignments</div>
                <ul className="mt-2 space-y-2">
                  {assignments.filter(a => a.studentId === s.user.id).map(a => (
                    <li key={a.id} className="text-sm">• <span className="font-medium">{a.title}</span> {a.dueDate ? ` — due ${new Date(a.dueDate).toLocaleDateString()}` : ''}</li>
                  ))}
                </ul>
              </div>

              <form className="mt-3 grid gap-2" onSubmit={(e) => handleSubmit(e, s.user.id)}>
                <input
                  className="w-full px-3 py-2 rounded border"
                  placeholder="Assignment title"
                  value={(formState[s.user.id]?.title) || ''}
                  onChange={(e) => setFormState(prev => ({ ...prev, [s.user.id]: { ...(prev[s.user.id] || { title: '', description: '', dueDate: '' }), title: e.target.value } }))}
                />
                <input
                  className="w-full px-3 py-2 rounded border"
                  placeholder="Short description"
                  value={(formState[s.user.id]?.description) || ''}
                  onChange={(e) => setFormState(prev => ({ ...prev, [s.user.id]: { ...(prev[s.user.id] || { title: '', description: '', dueDate: '' }), description: e.target.value } }))}
                />
                <input
                  className="w-full px-3 py-2 rounded border"
                  type="date"
                  value={(formState[s.user.id]?.dueDate) || ''}
                  onChange={(e) => setFormState(prev => ({ ...prev, [s.user.id]: { ...(prev[s.user.id] || { title: '', description: '', dueDate: '' }), dueDate: e.target.value } }))}
                />
                <div className="flex gap-2">
                  <button className="btn-primary" type="submit">Add assignment</button>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
