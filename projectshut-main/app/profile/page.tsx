"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

type Project = {
  title: string;
  description: string;
  videoUrl?: string;
  githubUrl?: string;
  tech: string[];
};

type Profile = {
  username: string;
  bio?: string;
  avatar?: string; // image url
  projects: Project[];
};

function ProfilePage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [message, setMessage] = useState("");

  // project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [tech, setTech] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("projectx_profiles");
    if (raw) setProfiles(JSON.parse(raw));
  }, []);

  const saveProfiles = (next: Profile[]) => {
    setProfiles(next);
    localStorage.setItem("projectx_profiles", JSON.stringify(next));
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return setMessage("Please enter a username");
    if (profiles.find((p) => p.username.toLowerCase() === username.toLowerCase())) {
      return setMessage("Username already exists. Choose another.");
    }
    const newProfile: Profile = { username, bio, avatar, projects: [] };
    const next = [newProfile, ...profiles];
    saveProfiles(next);
    setMessage(`Profile created. View at /projects/${username}`);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return setMessage("Enter username to add project to");
    const idx = profiles.findIndex((p) => p.username.toLowerCase() === username.toLowerCase());
    if (idx === -1) return setMessage("Profile not found. Create it first.");
    const newProject: Project = {
      title,
      description,
      videoUrl,
      githubUrl,
      tech: tech.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const next = [...profiles];
    next[idx] = { ...next[idx], projects: [newProject, ...next[idx].projects] };
    saveProfiles(next);
    setMessage("Project added successfully");
    // clear project form
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setGithubUrl("");
    setTech("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Profile & Upload Projects</h1>

      <section className="grid md:grid-cols-2 gap-6">
        <form className="space-y-3 p-4 border rounded" onSubmit={handleCreateProfile}>
          <h2 className="font-semibold">Create Account</h2>
          <label className="block">
            <span className="text-sm">Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="your-username" />
          </label>
          <label className="block">
            <span className="text-sm">Bio</span>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={3} />
          </label>
          <label className="block">
            <span className="text-sm">Avatar Image URL (optional)</span>
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="https://..." />
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded" type="submit">Create Profile</button>
            <Link href="/projects" className="px-4 py-2 border rounded">Browse Projects</Link>
          </div>
        </form>

        <form className="space-y-3 p-4 border rounded" onSubmit={handleAddProject}>
          <h2 className="font-semibold">Add Project</h2>
          <label className="block">
            <span className="text-sm">Username (owner)</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </label>
          <label className="block">
            <span className="text-sm">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </label>
          <label className="block">
            <span className="text-sm">Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={3} />
          </label>
          <label className="block">
            <span className="text-sm">Video URL (YouTube/Vimeo)</span>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="https://youtube.com/..." />
          </label>
          <label className="block">
            <span className="text-sm">GitHub Link (optional)</span>
            <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </label>
          <label className="block">
            <span className="text-sm">Tech tags (comma separated)</span>
            <input value={tech} onChange={(e) => setTech(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="react, nextjs, tailwind" />
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Add Project</button>
            <button type="button" onClick={() => { setMessage(""); }} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">Existing Profiles</h3>
        <div className="mt-3 grid gap-3">
          {profiles.length === 0 && <p>No profiles yet — create one above.</p>}
          {profiles.map((p) => (
            <div key={p.username} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-bold">{p.username}</div>
                <div className="text-sm text-gray-600">{p.bio}</div>
                <div className="text-xs text-gray-500">{p.projects.length} projects</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/projects/${p.username}`} className="px-3 py-1 border rounded">View</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && <div className="mt-4 p-3 bg-yellow-100 rounded">{message}</div>}
    </div>
  );
}

export default ProfilePage;
