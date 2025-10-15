import React, { useState, useEffect } from 'react';
import { Copy, Link2, Trash2, ExternalLink, TrendingUp } from 'lucide-react';

// Types
interface ShortUrl {
  _id: string;
  fullUrl: string;
  shorturl: string;
  clicks: number;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5001/api';

const App: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [fullUrl, setFullUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch all URLs
  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shortUrl`);
      const data = await response.json();
      
      if (response.ok) {
        setUrls(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching URLs:', err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Create short URL
  const handleCreateUrl = async () => {
    setError('');
    setSuccessMsg('');
    
    if (!fullUrl) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(fullUrl);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/shortUrl`);
      console.log('Request body:', { fullUrl });

      const response = await fetch(`${API_BASE_URL}/shortUrl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullUrl }),
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSuccessMsg('URL shortened successfully!');
        setFullUrl('');
        fetchUrls();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(data.msg || 'Failed to create short URL');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Cannot connect to server. Make sure backend is running on port 5001'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete URL
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shortUrl/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUrls();
        setSuccessMsg('URL deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete URL');
    }
  };

  // Copy to clipboard
  const handleCopy = (shortUrl: string, id: string) => {
    const fullShortUrl = `http://localhost:5001/api/shortUrl/${shortUrl}`;
    navigator.clipboard.writeText(fullShortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Link2 className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-600">
            Shorten your URLs and track clicks effortlessly
          </p>
        </div>

        {/* Create URL Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your long URL
              </label>
              <input
                type="text"
                value={fullUrl}
                onChange={(e) => setFullUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/your-long-url"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMsg}
              </div>
            )}

            <button
              onClick={handleCreateUrl}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
              <Link2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* URLs List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Shortened URLs ({urls.length})
          </h2>

          {urls.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No URLs yet. Create your first short URL above!</p>
            </div>
          ) : (
            urls.map((url) => (
              <div
                key={url._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <ExternalLink className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1">Original URL</p>
                        <a
                          href={url.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-indigo-600 break-all"
                        >
                          {url.fullUrl}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Link2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Short URL</p>
                        <code className="text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded">
                          localhost:5001/api/shortUrl/{url.shorturl}
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>{url.clicks} clicks</span>
                      </div>
                      <span>Created {formatDate(url.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(url.shorturl, url._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedId === url._id ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;