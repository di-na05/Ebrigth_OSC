import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTicketsContext } from '../../context/TicketsContext';
import { Button } from '../../components/ui/Button';
import { MOCK_BRANCHES } from '../../data/mockData';
import type { IssueContext, TicketFields } from '../../data/mockData';

const PLATFORM_CARDS = [
  { name: 'Aone', icon: 'A1', color: 'from-blue-600 to-blue-700', textColor: 'text-blue-600' },
  { name: 'ClickUp', icon: 'C', color: 'from-purple-600 to-purple-700', textColor: 'text-purple-600' },
  { name: 'GHL', icon: 'GHL', color: 'from-green-600 to-green-700', textColor: 'text-green-600' },
  { name: 'Process Street', icon: 'PS', color: 'from-amber-600 to-amber-700', textColor: 'text-amber-600' },
];

export default function NewTicket() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createTicket } = useTicketsContext();

  const [selectedPlatform, setSelectedPlatform] = useState<IssueContext | null>(null);
  const [formData, setFormData] = useState({
    branch: '',
    issueContext: '' as IssueContext | '',
    subType: '',
    fields: {} as TicketFields,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.branch) newErrors.branch = 'Branch is required';

    if (selectedPlatform === 'Aone') {
      if (!formData.subType) newErrors.subType = 'Sub-type is required';
      
      const fields = formData.fields as any;
      if (formData.subType === 'Freeze Student') {
        if (!fields.studentName) newErrors['fields.studentName'] = 'Student name is required';
        if (!fields.startDate) newErrors['fields.startDate'] = 'Start date is required';
        if (!fields.endDate) newErrors['fields.endDate'] = 'End date is required';
        if (!fields.reason) newErrors['fields.reason'] = 'Reason is required';
      } else if (formData.subType === 'Archive Student') {
        if (!fields.studentName) newErrors['fields.studentName'] = 'Student name is required';
        if (!fields.reason) newErrors['fields.reason'] = 'Reason is required';
      } else if (formData.subType === 'Delete Invoice') {
        if (!fields.studentName) newErrors['fields.studentName'] = 'Student name is required';
        if (!fields.invoiceNumber) newErrors['fields.invoiceNumber'] = 'Invoice number is required';
        if (!fields.reason) newErrors['fields.reason'] = 'Reason is required';
      } else if (formData.subType === 'Login Issue' || formData.subType === 'Others') {
        if (!fields.remarks) newErrors['fields.remarks'] = 'Remarks are required';
      }
    } else if (selectedPlatform === 'ClickUp' || selectedPlatform === 'GHL' || selectedPlatform === 'Process Street') {
      if (!formData.subType) newErrors.subType = 'Issue type is required';
      if (formData.subType === 'Others' && !formData.fields.remarks) {
        newErrors['fields.remarks'] = 'Remarks are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const newTicket = createTicket({
        userId: currentUser?.id || 0,
        platform: selectedPlatform || 'Aone',
        branch: formData.branch,
        issueContext: formData.issueContext as IssueContext,
        subType: formData.subType,
        fields: formData.fields,
        status: 'Ticket Received',
      });

      if (newTicket) {
        navigate('/tickets');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformSelect = (platform: IssueContext) => {
    setSelectedPlatform(platform);
    setFormData({
      branch: '',
      issueContext: platform,
      subType: '',
      fields: {},
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    setSelectedPlatform(null);
    setFormData({
      branch: '',
      issueContext: '' as IssueContext | '',
      subType: '',
      fields: {},
    });
    setErrors({});
  };

  const renderAoneFields = () => {
    const fields = formData.fields as any;
    
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Sub-type</label>
          <select
            value={formData.subType}
            onChange={(e) => {
              setFormData({ ...formData, subType: e.target.value, fields: {} });
              setErrors({});
            }}
            className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.subType ? 'border-red-500' : 'border-[var(--c-border)]'
            }`}
          >
            <option value="">Select Sub-type</option>
            {['Freeze Student', 'Archive Student', 'Delete Invoice', 'Login Issue', 'Others'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.subType && <p className="text-red-500 text-sm mt-1">{errors.subType}</p>}
        </div>

        {(formData.subType === 'Freeze Student' || formData.subType === 'Archive Student' || formData.subType === 'Delete Invoice') && (
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Student Name</label>
            <input
              type="text"
              value={fields.studentName || ''}
              onChange={(e) => setFormData({ ...formData, fields: { ...fields, studentName: e.target.value } })}
              className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors['fields.studentName'] ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              placeholder="John Doe"
            />
            {errors['fields.studentName'] && <p className="text-red-500 text-sm mt-1">{errors['fields.studentName']}</p>}
          </div>
        )}

        {formData.subType === 'Freeze Student' && (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Start Date</label>
              <input
                type="date"
                value={fields.startDate || ''}
                onChange={(e) => setFormData({ ...formData, fields: { ...fields, startDate: e.target.value } })}
                className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors['fields.startDate'] ? 'border-red-500' : 'border-[var(--c-border)]'
                }`}
              />
              {errors['fields.startDate'] && <p className="text-red-500 text-sm mt-1">{errors['fields.startDate']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">End Date</label>
              <input
                type="date"
                value={fields.endDate || ''}
                onChange={(e) => setFormData({ ...formData, fields: { ...fields, endDate: e.target.value } })}
                className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors['fields.endDate'] ? 'border-red-500' : 'border-[var(--c-border)]'
                }`}
              />
              {errors['fields.endDate'] && <p className="text-red-500 text-sm mt-1">{errors['fields.endDate']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Upload Black & White Copy</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, fields: { ...fields, blackWhiteFile: e.target.files?.[0]?.name || '' } })}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg text-[var(--c-text)] file:bg-red-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2 file:cursor-pointer hover:file:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-[var(--c-text3)] mt-1">PDF, JPG, PNG, DOC, DOCX (Max 5MB)</p>
              {fields.blackWhiteFile && <p className="text-xs text-emerald-400 mt-1">✓ {fields.blackWhiteFile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Upload General Document</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, fields: { ...fields, generalFile: e.target.files?.[0]?.name || '' } })}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full px-3 py-2 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg text-[var(--c-text)] file:bg-red-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2 file:cursor-pointer hover:file:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-xs text-[var(--c-text3)] mt-1">PDF, JPG, PNG, DOC, DOCX (Max 5MB)</p>
              {fields.generalFile && <p className="text-xs text-emerald-400 mt-1">✓ {fields.generalFile}</p>}
            </div>
          </>
        )}

        {formData.subType === 'Delete Invoice' && (
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Invoice Number</label>
            <input
              type="text"
              value={fields.invoiceNumber || ''}
              onChange={(e) => setFormData({ ...formData, fields: { ...fields, invoiceNumber: e.target.value } })}
              className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors['fields.invoiceNumber'] ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              placeholder="INV-001"
            />
            {errors['fields.invoiceNumber'] && <p className="text-red-500 text-sm mt-1">{errors['fields.invoiceNumber']}</p>}
          </div>
        )}

        {(formData.subType === 'Freeze Student' || formData.subType === 'Archive Student' || formData.subType === 'Delete Invoice') && (
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Reason</label>
            <textarea
              value={fields.reason || ''}
              onChange={(e) => setFormData({ ...formData, fields: { ...fields, reason: e.target.value } })}
              className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors['fields.reason'] ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              rows={3}
              placeholder="Please explain the reason..."
            />
            {errors['fields.reason'] && <p className="text-red-500 text-sm mt-1">{errors['fields.reason']}</p>}
          </div>
        )}

        {(formData.subType === 'Login Issue' || formData.subType === 'Others') && (
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Remarks</label>
            <textarea
              value={fields.remarks || ''}
              onChange={(e) => setFormData({ ...formData, fields: { ...fields, remarks: e.target.value } })}
              className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors['fields.remarks'] ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              rows={3}
              placeholder="Please provide details..."
            />
            {errors['fields.remarks'] && <p className="text-red-500 text-sm mt-1">{errors['fields.remarks']}</p>}
          </div>
        )}
      </>
    );
  };

  const renderOtherContextFields = () => {
    const fields = formData.fields as any;
    const getSubTypes = () => {
      if (selectedPlatform === 'ClickUp') return ['Missing', 'Duplicate', 'Linkage', 'Others'];
      if (selectedPlatform === 'GHL') return ['Tally', 'Login', 'Access', 'Others'];
      if (selectedPlatform === 'Process Street') return ['Extend', 'Others'];
      return [];
    };

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Issue Type</label>
          <select
            value={formData.subType}
            onChange={(e) => {
              setFormData({ ...formData, subType: e.target.value, fields: {} });
              setErrors({});
            }}
            className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
              errors.subType ? 'border-red-500' : 'border-[var(--c-border)]'
            }`}
          >
            <option value="">Select Type</option>
            {getSubTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.subType && <p className="text-red-500 text-sm mt-1">{errors.subType}</p>}
        </div>

        {formData.subType === 'Others' && (
          <div>
            <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Remarks</label>
            <textarea
              value={fields.remarks || ''}
              onChange={(e) => setFormData({ ...formData, fields: { ...fields, remarks: e.target.value } })}
              className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors['fields.remarks'] ? 'border-red-500' : 'border-[var(--c-border)]'
              }`}
              rows={3}
              placeholder="Please describe your issue..."
            />
            {errors['fields.remarks'] && <p className="text-red-500 text-sm mt-1">{errors['fields.remarks']}</p>}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen py-12">
      {!selectedPlatform ? (
        // Platform Selection Grid
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[var(--c-text)] mb-2">Create New Ticket</h1>
            <p className="text-[var(--c-text2)] text-sm">Select a platform to start</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PLATFORM_CARDS.map(platform => (
              <button
                key={platform.name}
                onClick={() => handlePlatformSelect(platform.name as IssueContext)}
                className="group relative h-32 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                    {platform.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white text-center px-3">
                    {platform.name}
                  </h3>
                </div>

                {/* Border */}
                <div className="absolute inset-0 border-2 border-white/20 group-hover:border-white/50 rounded-xl transition-colors pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Modal Form
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--c-card)] rounded-2xl border border-[var(--c-border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--c-card)] border-b border-[var(--c-border)] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--c-text)]">Create Ticket for {selectedPlatform}</h2>
                <p className="text-[var(--c-text2)] text-sm mt-1">Fill in the details below</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[var(--c-text2)] hover:text-[var(--c-text)] text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--c-text2)] mb-2">Branch Name</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className={`w-full px-3 py-2 bg-[var(--c-input)] border rounded-lg text-[var(--c-text)] focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.branch ? 'border-red-500' : 'border-[var(--c-border)]'
                  }`}
                >
                  <option value="">Select Branch</option>
                  {MOCK_BRANCHES.map(branch => (
                    <option key={branch.code} value={branch.name}>{branch.name}</option>
                  ))}
                </select>
                {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
              </div>

              {selectedPlatform === 'Aone' && renderAoneFields()}
              {(selectedPlatform === 'ClickUp' || selectedPlatform === 'GHL' || selectedPlatform === 'Process Street') && renderOtherContextFields()}

              {/* Footer */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[var(--c-border)]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Create Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
