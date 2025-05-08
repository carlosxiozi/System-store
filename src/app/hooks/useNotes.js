import { useState, useEffect } from 'react';
import { getNotes } from '../helpers/Notes';

export function useGetNotes() {
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNotes() {
            try {
                const data = await getNotes();
                setNotes(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchNotes();
    }, []);
    return { notes, loading, error };
}