import React, { useEffect, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { adminApi } from '../../services/resourceApi';
import { formatDate } from '../../utils/format';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ page: 1, pages: 1 });

  const fetchMessages = (page = 1) => {
    setLoading(true);
    setError('');
    adminApi.contactMessages({ page, limit: 15 })
      .then(({ data }) => {
        setMessages(data.data);
        setMeta(data.meta);
      })
      .catch((requestError) => {
        setError(requestError?.response?.data?.message || 'Unable to load contact messages.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-2">Contact Messages</h1>
      <p className="text-sm text-muted mb-6">Messages submitted through the public Contact Us form.</p>

      {loading ? (
        <div className="skeleton h-96 w-full" />
      ) : error ? (
        <div className="card p-6 text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button type="button" onClick={() => fetchMessages(meta.page)} className="btn-primary text-sm">Try Again</button>
        </div>
      ) : messages.length === 0 ? (
        <EmptyState icon={FaEnvelope} title="No contact messages yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-section text-left text-xs text-muted uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Message</th>
                <th className="p-4">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {messages.map((contactMessage) => (
                <tr key={contactMessage._id} className="align-top">
                  <td className="p-4 text-sm font-medium text-ink">{contactMessage.name}</td>
                  <td className="p-4 text-sm">
                    <a className="text-primary hover:underline" href={`mailto:${contactMessage.email}`}>
                      {contactMessage.email}
                    </a>
                  </td>
                  <td className="p-4 text-sm text-ink/80 whitespace-pre-wrap break-words max-w-xl">{contactMessage.message}</td>
                  <td className="p-4 text-sm text-muted whitespace-nowrap">{formatDate(contactMessage.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={meta.page} pages={meta.pages} onChange={fetchMessages} />
    </div>
  );
};

export default ContactMessagesPage;