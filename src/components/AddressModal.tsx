import React, { useState } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Check } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (address: string) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [customAddress, setCustomAddress] = useState('');

  if (!isOpen) return null;

  const savedAddresses = [
    {
      id: 'addr-1',
      tag: 'Home',
      icon: <Home className="w-4 h-4 text-red-600" />,
      address: 'House #42, Lane 3, Civil Lines, Near Clock Tower',
    },
    {
      id: 'addr-2',
      tag: 'Shop / Work',
      icon: <Briefcase className="w-4 h-4 text-amber-600" />,
      address: 'Main Market, Shop 18, Commercial Complex',
    },
    {
      id: 'addr-3',
      tag: 'Friends / Family',
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      address: 'Plot 15, Sector 4, Green Park Colony',
    },
  ];

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    onSelectAddress(customAddress.trim());
    setCustomAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-stone-900">Choose Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Saved Addresses */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Saved Locations
            </span>

            {savedAddresses.map((sa) => {
              const isSelected = currentAddress.includes(sa.tag) || currentAddress === sa.address;

              return (
                <div
                  key={sa.id}
                  onClick={() => {
                    onSelectAddress(`${sa.tag}: ${sa.address}`);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-50/50'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-2xs mt-0.5">{sa.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{sa.tag}</span>
                      {isSelected && <Check className="w-4 h-4 text-red-600" />}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{sa.address}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Custom Address Form */}
          <form onSubmit={handleAddNew} className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Deliver Somewhere Else
            </span>
            <input
              type="text"
              required
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="Enter flat / house no, colony, landmark..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Set as Delivery Location</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
