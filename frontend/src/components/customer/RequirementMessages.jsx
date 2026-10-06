import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa';
import { requirementApi } from '../../services/resourceApi';
import { formatDate } from '../../utils/format';

const RequirementMessages = ({ requirement, viewerRole }) => {
  const [messages, setMessages] = useState(requirement.messages || []);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setMessages(requirement.messages || []);
  }, [requirement.messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText) return;

    setSending(true);
    try {
      const { data } = await requirementApi.sendMessage(requirement._id, { text: messageText });
      setMessages((current) => [...current, data.data]);
      setText('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-4 border-t border-border pt-4" aria-label="Requirement messages">
      <h4 className="text-sm font-semibold text-ink mb-3">Messages</h4>
      <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
        {messages.length === 0 ? (
          <p className="text-xs text-muted">No messages yet. Send a message to discuss this requirement.</p>
        ) : messages.map((message) => {
          const mine = message.senderRole === viewerRole;
          return (
            <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-lg px-3 py-2 ${mine ? 'bg-primary/10 text-ink' : 'bg-section text-ink'}`}>
                <p className="text-[11px] font-semibold mb-1">
                  {mine ? 'You' : (message.sender?.name || 'Other participant')}
                </p>
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                <p className="text-[10px] text-muted mt-1">{formatDate(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          rows={2}
          maxLength={2000}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a message..."
          aria-label="Write a message"
          className="input-field resize-y min-h-11 py-2.5"
        />
        <button type="submit" disabled={sending || !text.trim()} className="btn-primary !px-4 !py-3 shrink-0" aria-label="Send message" title="Send message">
          <FaPaperPlane />
        </button>
      </form>
    </section>
  );
};

export default RequirementMessages;