import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import { globalSearchService } from '@/services/api/globalSearchService';
import { cn } from '@/utils/cn';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ contacts: [], companies: [], deals: [], activities: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allResults = [
    ...results.contacts.map(item => ({ ...item, type: 'contact', path: '/contacts' })),
    ...results.companies.map(item => ({ ...item, type: 'company', path: '/companies' })),
    ...results.deals.map(item => ({ ...item, type: 'deal', path: '/deals' })),
    ...results.activities.map(item => ({ ...item, type: 'activity', path: '/activities' }))
  ];

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const searchResults = await globalSearchService.searchAll(query);
          setResults(searchResults);
        } catch (error) {
          toast.error('Search failed. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ contacts: [], companies: [], deals: [], activities: [] });
      }
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allResults[selectedIndex]) {
            handleResultClick(allResults[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allResults, onClose]);

  const handleResultClick = (result) => {
    navigate(result.path);
    onClose();
    setQuery('');
    toast.success(`Navigating to ${result.type}`);
  };

  const getResultTitle = (result) => {
    switch (result.type) {
      case 'contact':
        return `${result.firstName} ${result.lastName}`;
      case 'company':
        return result.name;
      case 'deal':
        return result.name;
      case 'activity':
        return result.description?.substring(0, 50) + '...';
      default:
        return 'Unknown';
    }
  };

  const getResultSubtitle = (result) => {
    switch (result.type) {
      case 'contact':
        return `${result.email} • ${result.company}`;
      case 'company':
        return `${result.industry} • ${result.website || 'No website'}`;
      case 'deal':
        return `${result.company} • $${result.value?.toLocaleString()}`;
      case 'activity':
        return `${result.type} • ${new Date(result.date).toLocaleDateString()}`;
      default:
        return '';
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'contact': return 'User';
      case 'company': return 'Building2';
      case 'deal': return 'DollarSign';
      case 'activity': return 'Activity';
      default: return 'Search';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'contact': return 'text-blue-400 bg-blue-500/20';
      case 'company': return 'text-green-400 bg-green-500/20';
      case 'deal': return 'text-yellow-400 bg-yellow-500/20';
      case 'activity': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="glass-card rounded-xl shadow-2xl w-full max-w-2xl">
          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search contacts, companies, deals, and activities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-24 py-3 text-lg glass-input border-0 focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-xs text-slate-500">
                <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              </div>
            )}

            {!loading && query && allResults.length === 0 && (
              <div className="p-8 text-center">
                <ApperIcon name="Search" size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">No results found</h3>
                <p className="text-slate-500">Try adjusting your search terms</p>
              </div>
            )}

            {!loading && allResults.length > 0 && (
              <div className="p-2">
                {/* Contacts */}
                {results.contacts.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Contacts ({results.contacts.length})
                    </div>
                    {results.contacts.map((contact, index) => {
                      const globalIndex = allResults.findIndex(r => r.Id === contact.Id && r.type === 'contact');
                      return (
                        <div
                          key={`contact-${contact.Id}`}
                          onClick={() => handleResultClick({ ...contact, type: 'contact', path: '/contacts' })}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            selectedIndex === globalIndex 
                              ? "bg-blue-500/20 border border-blue-500/30" 
                              : "hover:bg-white/5"
                          )}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="User" size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-medium text-white truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultTitle(contact), query) 
                              }}
                            />
                            <div 
                              className="text-sm text-slate-400 truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultSubtitle(contact), query) 
                              }}
                            />
                          </div>
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium capitalize", getTypeColor('contact'))}>
                            Contact
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Companies */}
                {results.companies.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Companies ({results.companies.length})
                    </div>
                    {results.companies.map((company) => {
                      const globalIndex = allResults.findIndex(r => r.Id === company.Id && r.type === 'company');
                      return (
                        <div
                          key={`company-${company.Id}`}
                          onClick={() => handleResultClick({ ...company, type: 'company', path: '/companies' })}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            selectedIndex === globalIndex 
                              ? "bg-green-500/20 border border-green-500/30" 
                              : "hover:bg-white/5"
                          )}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="Building2" size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-medium text-white truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultTitle(company), query) 
                              }}
                            />
                            <div 
                              className="text-sm text-slate-400 truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultSubtitle(company), query) 
                              }}
                            />
                          </div>
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium capitalize", getTypeColor('company'))}>
                            Company
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Deals */}
                {results.deals.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Deals ({results.deals.length})
                    </div>
                    {results.deals.map((deal) => {
                      const globalIndex = allResults.findIndex(r => r.Id === deal.Id && r.type === 'deal');
                      return (
                        <div
                          key={`deal-${deal.Id}`}
                          onClick={() => handleResultClick({ ...deal, type: 'deal', path: '/deals' })}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            selectedIndex === globalIndex 
                              ? "bg-yellow-500/20 border border-yellow-500/30" 
                              : "hover:bg-white/5"
                          )}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="DollarSign" size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-medium text-white truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultTitle(deal), query) 
                              }}
                            />
                            <div 
                              className="text-sm text-slate-400 truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultSubtitle(deal), query) 
                              }}
                            />
                          </div>
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium capitalize", getTypeColor('deal'))}>
                            Deal
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Activities */}
                {results.activities.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Activities ({results.activities.length})
                    </div>
                    {results.activities.map((activity) => {
                      const globalIndex = allResults.findIndex(r => r.Id === activity.Id && r.type === 'activity');
                      return (
                        <div
                          key={`activity-${activity.Id}`}
                          onClick={() => handleResultClick({ ...activity, type: 'activity', path: '/activities' })}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            selectedIndex === globalIndex 
                              ? "bg-purple-500/20 border border-purple-500/30" 
                              : "hover:bg-white/5"
                          )}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="Activity" size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-medium text-white truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultTitle(activity), query) 
                              }}
                            />
                            <div 
                              className="text-sm text-slate-400 truncate"
                              dangerouslySetInnerHTML={{ 
                                __html: globalSearchService.highlightText(getResultSubtitle(activity), query) 
                              }}
                            />
                          </div>
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium capitalize", getTypeColor('activity'))}>
                            Activity
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!loading && !query && (
              <div className="p-8 text-center">
                <ApperIcon name="Search" size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">Global Search</h3>
                <p className="text-slate-500 mb-4">Search across contacts, companies, deals, and activities</p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-700 rounded">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-700 rounded">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-700 rounded">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;