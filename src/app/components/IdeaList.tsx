"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import random from 'random';
import { TreeDeciduous } from 'lucide-react';


function Home() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [ideas, setIdeas] = useState([]);
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    useEffect(() => {
        const storedIdeas = localStorage.getItem('ideas');
        if (storedIdeas) {
            const parsedIdeas = JSON.parse(storedIdeas);
            setIdeas(parsedIdeas.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
        }
    }, []);

    const onSubmit = (data) => {
        const currentDate = new Date();
        setIdeas((prevIdeas) => [...prevIdeas, { ...data, dateCreated: currentDate }].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
        localStorage.setItem('ideas', JSON.stringify(ideas));
        setOpen(false);
        reset();
        toast({
            title: "✨ ⚡ Boom! Another idea added to the brilliance bank!",
            description: "Keep feeding the fire!  You're on a creative roll!  Keep crushing it!",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <Drawer open={open}>
                <header className="flex items-center justify-between py-8">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Got a spark? ⚡️ Don't let it fizzle!
                    </h1>
                    <DrawerTrigger asChild><Button className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded" onClick={() => setOpen(true)}>
                        <TreeDeciduous />
                        Shake Your Brain Tree!
                    </Button></DrawerTrigger>
                </header>

                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle asChild><h1 className="text-6xl font-bold tracking-tight mb-4">Brain Sparks? ⚡️</h1></DrawerTitle>
                        <DrawerDescription asChild><h2 className="text-2xl font-semibold">Capture them before they fizzle!</h2></DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="tems-center justify-center">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                                <div className="mb-4">
                                    <input
                                        {...register("title", { required: true })}
                                        placeholder="Give your idea a catchy name"
                                        className="p-2 border rounded-md w-full"
                                    />
                                    {errors.title && <span className="text-red-500 text-xs italic">Title is required</span>}
                                </div>

                                <textarea
                                    {...register("description")}
                                    placeholder="Unleash the details, no matter how crazy they seem"
                                    className="p-2 border rounded-md w-full"
                                    rows={4}
                                />
                                <DrawerFooter>
                                    <Button type="submit">Release the idea beast!</Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline" onClick={() => { setOpen(false) }}>Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </form>
                        </div>
                    </div>

                </DrawerContent>
            </Drawer>
            <section className="mt-8">

                {ideas.length === 0 && (
                    <p className="text-gray-600">Don't worry, your first idea is just around the corner.</p>
                )}
                <ul className="space-y-4">
                    {ideas.map((idea) => (
                        <li key={idea.title} className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
                            <p className="text-gray-700">{idea.description}</p>
                            <span className="text-gray-500">
                                Date Created: {idea.dateCreated ? dayjs(idea.dateCreated).fromNow() : (
                                    <i>This idea was born in the mists of time!</i>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div >
    );
}

export default Home;