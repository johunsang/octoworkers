import { useState } from 'react'
import { Panel } from '../../../com/ui/Panel'
import { useUsers } from '../hooks/useUsers'

export function UserPanel() {
  const { users, loading, createUser, updateUser, toggleUser, deleteUser } = useUsers()
  const [showForm, setShowForm] = useState(false)
  const [formEmail, setFormEmail] = useState('')
  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState('viewer')
  const [editId, setEditId] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editId) {
      await updateUser(editId, formName, formRole)
      setEditId(null)
    } else {
      await createUser(formEmail, formName, formRole)
    }
    setFormEmail(''); setFormName(''); setFormRole('viewer'); setShowForm(false)
  }

  function startEdit(user: { id: number; email: string; name: string; role: string }) {
    setEditId(user.id); setFormEmail(user.email); setFormName(user.name); setFormRole(user.role); setShowForm(true)
  }

  const roleLabels: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', editor: 'Editor', viewer: 'Viewer' }

  return (
    <Panel title="User Management" eyebrow="Users">
      <div className="button-row">
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setFormEmail(''); setFormName(''); setFormRole('viewer') }}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>
      {showForm && (
        <form className="form-grid" onSubmit={handleSubmit}>
          {!editId && <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="Email" type="email" required />}
          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Name" required />
          <select value={formRole} onChange={(e) => setFormRole(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button type="submit">{editId ? 'Update' : 'Create'}</button>
        </form>
      )}
      {loading && <p style={{ opacity: 0.5 }}>Loading users...</p>}
      <div className="table-shell">
        {users.map((user) => (
          <article key={user.id} className="list-row">
            <div>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`role-badge role-${user.role}`}>{roleLabels[user.role] ?? user.role}</span>
              <br />
              <small style={{ opacity: 0.6 }}>
                {user.isActive ? 'Active' : 'Disabled'}
                {user.lastLoginAt ? ` · Last: ${new Date(user.lastLoginAt).toLocaleDateString()}` : ''}
              </small>
              <div style={{ marginTop: 6, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button className="small-btn" onClick={() => startEdit(user)}>Edit</button>
                <button className="small-btn" onClick={() => toggleUser(user.id)}>{user.isActive ? 'Disable' : 'Enable'}</button>
                <button className="small-btn danger" onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
