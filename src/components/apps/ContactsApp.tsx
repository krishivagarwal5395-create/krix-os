import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Building, Trash2, Download } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const ContactsApp: React.FC = () => {
  const { contacts, addContact, deleteContact } = useDesktop();
  const [search, setSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(contacts[0]?.id || null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCompany, setNewCompany] = useState('');

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    addContact({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+1 (555) 000-0000',
      company: newCompany.trim() || 'ThinkPad Systems',
    });
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewCompany('');
    setIsAdding(false);
  };

  const exportVCard = () => {
    if (!selectedContact) return;
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${selectedContact.name}\nEMAIL:${selectedContact.email}\nTEL:${selectedContact.phone}\nORG:${selectedContact.company || ''}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedContact.name.replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar List */}
      <div className="w-64 bg-slate-950/80 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">All Contacts</span>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 rounded-lg bg-red-600 hover:bg-red-500 text-white"
            title="Add Contact"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="p-2 border-b border-white/10">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-7 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filtered.map((c) => {
            const isSelected = selectedContact?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedContactId(c.id)}
                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                  isSelected ? 'bg-red-600/20 border-l-4 border-red-500' : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${c.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                  {c.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{c.company || c.email}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail or Add Form */}
      <div className="flex-1 flex flex-col bg-slate-900 p-8 overflow-y-auto">
        {isAdding ? (
          <form onSubmit={handleAdd} className="max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Add New Contact</h3>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Company or Role"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold">
                Save
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-slate-400">
                Cancel
              </button>
            </div>
          </form>
        ) : selectedContact ? (
          <div className="max-w-md space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${selectedContact.avatarColor} text-white flex items-center justify-center text-2xl font-bold shadow-xl`}>
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedContact.name}</h3>
                  <div className="text-xs text-slate-400">{selectedContact.company}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportVCard}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300"
                  title="Export vCard (.vcf)"
                >
                  <Download size={15} />
                </button>
                <button
                  onClick={() => deleteContact(selectedContact.id)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400"
                  title="Delete Contact"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={16} className="text-red-400" />
                <span>{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone size={16} className="text-emerald-400" />
                <span>{selectedContact.phone}</span>
              </div>
              {selectedContact.company && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Building size={16} className="text-blue-400" />
                  <span>{selectedContact.company}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 text-xs">No contact selected</div>
        )}
      </div>
    </div>
  );
};
