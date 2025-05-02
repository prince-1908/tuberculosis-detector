'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';

type Prediction = {
    id: string;
    image_url: string;
    class_label: string;
    probability: number;
    risk_level: string;
    created_at: string;
    patient_name: string;
};

export default function History() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchPredictions = async () => {
            const { data, error } = await supabase.from('predictions').select('*').order('created_at', { ascending: false });
            if (!error) setPredictions(data || []);
        };
        fetchPredictions().finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className='flex items-center justify-center h-screen flex-col gap-7'>
            <p className="mb-4 text-center text-blue-700 text-7xl font-bold">Tuberculosis Detector</p>
            <div className="loader"></div>
        </div>
    )

    return (

        <main>
            <Navbar />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Prediction History</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr>
                                <th className="p-3 border-b">Patient Name</th>
                                <th className="p-3 border-b">Image</th>
                                <th className="p-3 border-b">Result</th>
                                <th className="p-3 border-b">Probability</th>
                                <th className="p-3 border-b">Risk Level</th>
                                <th className="p-3 border-b">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {predictions.map((item) => (
                                <tr key={item.id} className="text-center">
                                    <td className="p-2 border-b">{item.patient_name}</td>
                                    <td className="p-2 border-b">
                                        <Image
                                            src={item.image_url}
                                            alt="X-ray"
                                            height={80}
                                            width={80}
                                            className="w-20 h-20 object-cover mx-auto rounded"
                                        />
                                    </td>
                                    <td className="p-2 border-b">{item.class_label}</td>
                                    <td className="p-2 border-b">{(item.probability * 100).toFixed(6)}%</td>
                                    <td className="p-2 border-b">{item.risk_level}</td>
                                    <td className="p-2 border-b">{new Date(item.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
