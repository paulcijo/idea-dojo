import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';

const NewIdeaModal = ({ onAddIdea }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && description) {
            onAddIdea({ title, description, createdAt: Date.now() });
            setTitle('');
            setDescription('');
            setIsDialogOpen(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <h1> Hello world</h1>
        </Dialog>
    );
};
