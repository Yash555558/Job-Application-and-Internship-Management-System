import React, { useState, useEffect, useRef } from 'react';

export default function JobsFilterBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const timeoutRef = useRef();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onFilterChange({ search, location, type });
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [search, location, type, onFilterChange]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search jobs or skills"
          className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="internship">Internship</option>
          <option value="job">Full-time</option>
        </select>

        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="📍 Location"
          className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => {
            setSearch('');
            setLocation('');
            setType('');
          }}
          className="px-4 py-2.5 border rounded-lg hover:bg-gray-100"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
