import { useState, useEffect } from 'react';
import { getShopFeedbacks, createFeedback, updateFeedback, deleteFeedback } from '../api/feedback';
import { useAuth } from '../context/AuthContext';

function StarPicker({ rating, onChange, disabled }) {
  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange && onChange(star)}
          style={{
            background: 'none',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            fontSize: '1.4rem',
            color: star <= rating ? '#F5A623' : 'rgba(255, 255, 255, 0.2)',
            padding: 0,
            transition: 'transform var(--dur-fast)',
          }}
          title={`${star} Star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ShopFeedbackSection({ shopId }) {
  const { user, isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const loadFeedbacks = () => {
    setLoading(true);
    getShopFeedbacks(shopId)
      .then(d => setFeedbacks(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (shopId) loadFeedbacks();
  }, [shopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please enter your feedback comment.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await createFeedback(shopId, { rating, comment: comment.trim() });
      setComment('');
      setRating(5);
      setSuccess('Thank you! Your feedback has been posted.');
      setTimeout(() => setSuccess(''), 3500);
      loadFeedbacks();
    } catch (err) {
      setError(err?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (fb) => {
    setEditingId(fb._id);
    setEditRating(fb.rating);
    setEditComment(fb.comment);
  };

  const handleSaveEdit = async (id) => {
    if (!editComment.trim()) return;
    setEditSubmitting(true);
    try {
      await updateFeedback(id, { rating: editRating, comment: editComment.trim() });
      setEditingId(null);
      loadFeedbacks();
    } catch (err) {
      window.alert(err?.message || 'Failed to update feedback.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await deleteFeedback(id);
      loadFeedbacks();
    } catch (err) {
      window.alert(err?.message || 'Failed to delete feedback.');
    }
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
    : null;

  return (
    <div className="feedback-section glass-card" style={{ padding: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-4)' }}>
        <div>
          <h2 className="form-step-title" style={{ margin: 0, fontSize: '1.35rem' }}>
            Customer Reviews & Feedback
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Real ratings and feedback from verified gas customers.
          </p>
        </div>

        {avgRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--brand-tint)', padding: '8px 16px', borderRadius: 'var(--r-pill)', border: '1px solid var(--brand-border-soft)' }}>
            <span style={{ fontSize: '1.25rem', color: '#F5A623' }}>★</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{avgRating} / 5.0</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        )}
      </div>

      {/* Add Feedback Form (for logged-in customers/admins) */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-lg)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 var(--space-4) 0', color: 'var(--text-primary)' }}>
            Leave Your Feedback
          </h3>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" style={{ display: 'block', marginBottom: '6px' }}>Your Rating</label>
            <StarPicker rating={rating} onChange={setRating} />
          </div>

          <div className="field-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="field-label" htmlFor="feedback-comment">Your Review / Comment</label>
            <textarea
              id="feedback-comment"
              className="field-input"
              rows={3}
              placeholder="Share your experience with this gas dealer..."
              value={comment}
              onChange={e => { setError(''); setComment(e.target.value); }}
              required
            />
          </div>

          {error && (
            <div style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
              ✓ {success}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={submitting} style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
            {submitting ? 'Posting…' : 'Submit Feedback'}
          </button>
        </form>
      ) : (
        <div style={{ padding: 'var(--space-4)', background: 'var(--glass-bg)', borderRadius: 'var(--r-md)', marginBottom: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Please sign in to leave feedback for this shop.
        </div>
      )}

      {/* Feedbacks List */}
      {loading && <div className="dash-state"><div className="dash-spinner" /><span>Loading feedbacks…</span></div>}

      {!loading && feedbacks.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>💬</span>
          No feedback yet. Be the first to leave a review!
        </div>
      )}

      {!loading && feedbacks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {feedbacks.map(fb => {
            const isOwner = user && (fb.customerId?._id === user._id || fb.customerId === user._id);
            const isAdmin = user?.role === 'ADMIN';
            const canManage = isOwner || isAdmin;
            const isEditing = editingId === fb._id;

            return (
              <div
                key={fb._id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--space-5)',
                  transition: 'border-color var(--dur-fast)'
                }}
              >
                {/* Header row: Author + Date + Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--brand-tint)', color: 'var(--brand-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', border: '1px solid var(--brand-border-soft)' }}>
                      {fb.customerId?.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                        {fb.customerId?.name || 'Customer'}
                        {isAdmin && isOwner && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#f5a623' }}>(You)</span>}
                        {!isOwner && isAdmin && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#ef4444' }}>(Admin view)</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(fb.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Actions for Author or Admin */}
                  {canManage && !isEditing && (
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(fb)}
                        style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--r-pill)', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(fb._id)}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '4px 10px', borderRadius: 'var(--r-pill)', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Content or Edit Form */}
                {isEditing ? (
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <div style={{ marginBottom: 'var(--space-2)' }}>
                      <StarPicker rating={editRating} onChange={setEditRating} />
                    </div>
                    <textarea
                      className="field-input"
                      rows={3}
                      value={editComment}
                      onChange={e => setEditComment(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', marginBottom: 'var(--space-3)' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        disabled={editSubmitting}
                        onClick={() => handleSaveEdit(fb._id)}
                      >
                        {editSubmitting ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '6px' }}>
                      <StarPicker rating={fb.rating} disabled />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {fb.comment}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
