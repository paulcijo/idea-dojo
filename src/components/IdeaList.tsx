"use client";
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { TreeDeciduous, Lock } from 'lucide-react';

import { Dayjs, PluginFunc } from 'dayjs'
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
type DateType = string | number | Date | Dayjs

declare module 'dayjs' {
    interface Dayjs {
        fromNow(withoutSuffix?: boolean): string
        from(compared: DateType, withoutSuffix?: boolean): string
        toNow(withoutSuffix?: boolean): string
        to(compared: DateType, withoutSuffix?: boolean): string
    }
}

interface Idea {
    title: string;
    description: string;
    dateCreated: Date;
}

function Home() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Idea>();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [open, setOpen] = React.useState(false);
    const [openSheet, setOpenSheet] = useState(false);
    const { toast } = useToast();
    const [selectedIdea, setSelectedIdea] = useState<Idea>();

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    useEffect(() => {
        const storedIdeas = localStorage.getItem('ideas');
        if (storedIdeas) {
            const parsedIdeas = JSON.parse(storedIdeas);
            setIdeas(parsedIdeas.sort((a: Idea, b: Idea) =>
                new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
            ));
        }
    }, []);

    useEffect(() => {
        console.log(selectedIdea?.title);
        setOpenSheet(true);
    }, [selectedIdea]); // Run the effect whenever selectedIdea changes

    useEffect(() => {
        if (openSheet === false) {
            setSelectedIdea(undefined);
        }
    }, [openSheet]); // Run the effect whenever selectedIdea changes

    const onSubmit: SubmitHandler<Idea> = (data: Idea) => {
        const currentDate = new Date();
        setIdeas((prevIdeas) => [...prevIdeas, { ...data, dateCreated: currentDate }].sort((a: Idea, b: Idea) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()));
        localStorage.setItem('ideas', JSON.stringify(ideas));
        setOpen(false);
        reset();
        toast({
            title: "✨ ⚡ Boom! Another idea added to the brilliance bank!",
            description: "Keep feeding the fire!  You&apos;re on a creative roll!  Keep crushing it!",
        });
    };


    return (
        <div className="container mx-auto p-4">
            <Drawer open={open} onOpenChange={setOpen}>
                <header className="flex flex-col lg:flex-row items-center space-y-2 lg:justify-between py-8">
                    <h1 className="text-2xl lg:text-4xl text-center font-bold tracking-tight">
                        Got a spark? ⚡️ Don&apos;t let it fizzle!
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
                    <p className="text-gray-600">Don&apos;t worry, your first idea is just around the corner.</p>
                )}
                <ul className="space-y-4">
                    {ideas.map((idea) => (
                        <li key={idea.title} className="bg-white rounded-lg shadow p-4" onClick={() => setSelectedIdea(idea)}>
                            <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
                            <p className="text-gray-700">{idea.description}</p>
                            <span className="text-gray-500">
                                ... {idea.dateCreated ? dayjs(idea.dateCreated).fromNow() : (
                                    <i>This idea was born in the mists of time!</i>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                {selectedIdea && (
                    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                        <SheetContent className="h-full flex flex-col w-[400px] sm:w-screen">
                            <SheetHeader className="py-4">
                                <SheetTitle className="text-xl font-bold">✨ Sharpen Your Spark into a Flame</SheetTitle>
                            </SheetHeader>
                            <form className="flex flex-col flex-grow">
                                <Input {...register("title")} defaultValue={selectedIdea.title} className="mb-4" />
                                <Textarea {...register("description")} defaultValue={selectedIdea.description} className="mb-4 flex-1 p-4" />
                                <Button className="w-full bg-gray-800 text-white py-4 space-x-2" type="submit">
                                    <Lock size={20} /> <span>Lock it in! </span>
                                </Button>
                            </form>
                        </SheetContent>
                    </Sheet>
                )}
            </section>
        </div >
    );
}

export default Home;
