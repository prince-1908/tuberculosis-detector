'use client'

import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { Navbar } from '@/components/Navbar';

const TARGET_CLASSES: { [key: string]: string } = {
  0: "Normal",
  1: "Tuberculosis"
};

export default function Home() {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [predictions, setPredictions] = useState<{ className: string, probability: number }[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [patientName, setPatientName] = useState<string>('')

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tf.loadGraphModel('/model/model.json');
      setModel(loadedModel);
      setLoadingModel(false);
    };
    loadModel();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const predict = async () => {
    if (!model || !imageRef.current) {
      alert('Model or image not loaded.');
      return;
    }

    const tensor = tf.browser.fromPixels(imageRef.current)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .reverse(-1);

    const predictionData = await model.predict(tensor) as tf.Tensor;
    const predictionArray = await predictionData.data();

    const topPredictions = Array.from(predictionArray).map((p, i) => ({
      probability: p,
      className: TARGET_CLASSES[i]
    }))
      .filter(pred => pred.className === "Tuberculosis")
      .sort((a, b) => b.probability - a.probability);

    setPredictions(topPredictions);

    if (topPredictions.length > 0) {
      const { className, probability } = topPredictions[0];
      const riskLevel = getRiskLevel(probability);
      const { error } = await supabase.from('predictions').insert({
        image_url: imageUrl,
        class_label: className,
        probability,
        risk_level: riskLevel,
        patient_name: patientName
      });

      if (error) console.error("Error saving to Supabase:", error.message);
    }
  };

  const getRiskLevel = (probability: number) => {
    if (probability > 0.75) return "High Risk";
    if (probability > 0.4) return "Moderate Risk";
    return "Low Risk";
  };

  const getRiskColor = (probability: number) => {
    if (probability > 0.75) return "text-red-600";
    if (probability > 0.4) return "text-yellow-500";
    return "text-green-600";
  };

  if (loadingModel) return (
    <div className='flex items-center justify-center h-screen flex-col gap-7'>
      <p className="mb-4 text-center text-blue-700 text-7xl font-bold">Tuberculosis Detector</p>
      <div className="loader"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="container mx-auto mt-10 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <input
              type="text"
              onChange={(e) => setPatientName(e.target.value)}
              value={patientName}
              placeholder='Patient Name'
              className='w-full border border-gray-300 rounded p-2'
            />
            <input
              type="file"
              className="w-full border border-gray-300 rounded p-2"
              onChange={handleImageChange}
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700"
              onClick={predict}
            >
              Predict
            </button>
            {imageUrl && (
              <div className="rounded shadow-md overflow-hidden w-full max-w-xs">
                <Image
                  src={imageUrl}
                  ref={imageRef}
                  width={300}
                  height={300}
                  alt="Selected Image"
                  className="rounded"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Result</h2>
            {predictions.length > 0 ? (
              <div className="bg-white p-4 rounded shadow-md">
                {predictions.map((p, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-red-700">{p.className}</p>
                    <p className="mt-1">
                      Probability: <span className="font-mono">{(p.probability * 100).toFixed(5)} %</span>
                    </p>
                    <p className={`mt-1 font-semibold ${getRiskColor(p.probability)}`}>
                      Risk Level: {getRiskLevel(p.probability)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No prediction yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Note & Precautions</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>This is not a medical diagnosis. Always consult a doctor.</li>
            <li>Maintain good hygiene and respiratory health.</li>
            <li>If you experience TB symptoms, get tested at a healthcare center.</li>
            <li>Keep lungs strong through proper diet and regular checkups.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
