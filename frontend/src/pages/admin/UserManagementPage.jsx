import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaSearch, FaBan, FaCheck, FaTrash } from 'react-icons/fa';
import EmptyState from '../../components/common/EmptyState';
import { FaUsers } from 'react-icons/fa';
import { adminApi } from '../../services/resourceApi';
import { formatDate } from '../../utils/format';
import Pagination from '../../components/common/Pagination';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [meta, setMeta] = useState({ page: 1, pages: 1 });

  const fetchData = (page = 1) => {
    setLoading(true);
    adminApi.users({ search, role, page, limit: 15 }).then(({ data }) => {
      setUsers(data.data);
      setMeta(data.meta);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(1); }, []);

  const handleToggleBlock = async (id) => {
    try {
      await adminApi.toggleBlockUser(id, {});
      toast.success('User status updated');
      fetchData(meta.page);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name} and their associated profile and listings? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(user._id);
      toast.success('User and related data deleted');
      fetchData(meta.page);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-6">User Management</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 border border-border rounded-xl px-4 bg-white">
          <FaSearch className="text-muted" />
          <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData(1)} className="w-full py-2.5 outline-none text-sm" />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); setTimeout(() => fetchData(1), 0); }} className="input-field sm:w-48 text-sm">
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="contractor">Contractor</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-96 w-full" />
      ) : users.length === 0 ? (
        <EmptyState icon={FaUsers} title="No users found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-section text-left text-xs text-muted uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="p-4">
                    <p className="font-medium text-ink text-sm">{u.name}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="p-4 text-sm capitalize">{u.role}</td>
                  <td className="p-4 text-sm text-muted">{formatDate(u.createdAt)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold ${u.isBlocked ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {u.isBlocked ? <><FaCheck /> Unblock</> : <><FaBan /> Block</>}
                      </button>
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDelete(u)} className="flex items-center gap-1.5 text-xs font-semibold text-red-700" aria-label={`Delete ${u.name}`}>
                          <FaTrash /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={meta.page} pages={meta.pages} onChange={fetchData} />
    </div>
  );
};

export default UserManagementPage;
