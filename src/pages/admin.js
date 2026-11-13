// admin.js
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import styles from './admin.module.css';

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [section, setSection] = useState('fundamentals');
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create mode, else = editing this post's id

  const textareaRef = useRef(null);

  useEffect(() => {
    if (authToken) {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => setPosts(Array.isArray(data) ? data : []))
        .catch(() => setError('Failed to load posts'));
    }
  }, [authToken]);

  const insertAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + textToInsert);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const updated = before + textToInsert + after;
    setContent(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + textToInsert.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'X-Admin-Auth': authToken },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        insertAtCursor(`\n\n![${altText}](${data.url})\n\n`);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('');
    setSection('fundamentals');
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setSection(post.section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isEditing = editingId !== null;
    const url = '/api/posts';
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing
      ? { id: editingId, title, slug, content, section }
      : { title, slug, content, section };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Auth': authToken,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      if (isEditing) {
        setPosts(posts.map((p) => (p.id === editingId ? data : p)));
      } else {
        setPosts([data, ...posts]);
      }
      resetForm();
    } else {
      setError(data.error || (isEditing ? 'Update failed' : 'Create failed'));
    }
  };

  const handleDeletePost = async (id) => {
    const res = await fetch(`/api/posts?id=${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Auth': authToken },
    });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
      if (editingId === id) resetForm(); // agar jo post edit ho raha tha wahi delete ho gaya
    } else {
      const data = await res.json();
      setError(data.error || 'Delete failed');
    }
  };

  if (!authToken) {
    return (
      <Layout title="Admin Login">
        <main className={styles.adminPage}>
          <section className={styles.loginCard}>
            <p className={styles.eyebrow}>GolangForAll / Private</p>
            <h1>Admin Access</h1>
            <p>Enter your access token to manage community posts.</p>
            <label htmlFor="admin-token">Admin token</label>
          <input
            id="admin-token"
            type="password"
            placeholder="Enter admin token"
            className={styles.field}
            onKeyDown={(e) => e.key === 'Enter' && setAuthToken(e.target.value)}
          />
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Admin">
      <main className={styles.adminPage}>
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>GolangForAll / Private</p>
          <h1>Content Console</h1>
          <p>Write, publish, and manage community posts.</p>
        </header>
        {error && <p className={styles.error} role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {editingId && (
            <p className={styles.editingNotice}>
              Editing post — <button type="button" onClick={resetForm}>cancel</button>
            </p>
          )}
          <input className={styles.field} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className={styles.field} placeholder="Slug (unique, url-safe)" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <select className={styles.field} value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="fundamentals">Fundamentals</option>
              <option value="backend">Backend Engineering</option>
              <option value="systems">Systems &amp; Concurrency</option>
              <option value="projects">Build Logs</option>
              <option value="now">Now</option>
              <option value="meetups">Meetups</option>
              <option value="announcements">Announcements</option>
          </select>

          <div>
            <label className={styles.uploadLabel}>
              Insert image at cursor position in Content below
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <span className={styles.uploadStatus}>Uploading...</span>}
          </div>

          <textarea
            ref={textareaRef}
            placeholder="Content (markdown)"
            rows="16"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${styles.field} ${styles.contentField}`}
            required
          />

          <button className={styles.submitButton} type="submit">{editingId ? 'Update' : 'Publish'}</button>
        </form>

        <h2 className={styles.postsHeading}>Posts</h2>
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <span className={styles.postTitle}>
                <span className={styles.postSection}>{post.section}</span>
                {post.title}
              </span>
              <span className={styles.postActions}>
                <button className={styles.secondaryButton} onClick={() => startEdit(post)}>Edit</button>
                <button className={styles.secondaryButton} onClick={() => handleDeletePost(post.id)}>Delete</button>
              </span>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}