'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Ship, Truck, PlaneTakeoff, Train, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const INCOTERMS_2020 = {
  sea: ['FAS', 'FOB', 'CFR', 'CIF'],
  road: ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'],
  rail: ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'],
  air: ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP']
};

const transportTypes = [
  {
    id: 'sea',
    name: 'Sea Freight',
    icon: Ship,
    description: 'Ocean container or bulk shipping'
  },
  {
    id: 'road',
    name: 'Road Freight',
    icon: Truck,
    description: 'Truck or road transportation'
  },
  {
    id: 'rail',
    name: 'Rail Freight',
    icon: Train,
    description: 'Railway transportation'
  },
  {
    id: 'air',
    name: 'Air Freight',
    icon: PlaneTakeoff,
    description: 'Air cargo transportation'
  }
];

const responsibilities = [
  {
    id: 'loading',
    question: 'Who is responsible for loading the goods?'
  },
  {
    id: 'transport',
    question: 'Who arranges and pays for main transport?'
  },
  {
    id: 'customs',
    question: 'Who handles export/import customs clearance?'
  },
  {
    id: 'insurance',
    question: 'Who provides cargo insurance?'
  },
  {
    id: 'unloading',
    question: 'Who is responsible for unloading at destination?'
  }
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [transportType, setTransportType] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');

  const determineIncoterm = () => {
    if (transportType === 'sea') {
      if (answers.loading === 'seller' && answers.transport === 'seller' && answers.insurance === 'seller') {
        return 'CIF (Cost, Insurance and Freight)®';
      } else if (answers.loading === 'seller' && answers.transport === 'seller') {
        return 'CFR (Cost and Freight)®';
      } else if (answers.loading === 'seller') {
        return 'FOB (Free On Board)®';
      }
      return 'FAS (Free Alongside Ship)®';
    } else {
      if (answers.loading === 'buyer' && answers.transport === 'buyer') {
        return 'EXW (Ex Works)®';
      } else if (answers.transport === 'seller' && answers.insurance === 'seller') {
        return 'CIP (Carriage and Insurance Paid)®';
      } else if (answers.transport === 'seller') {
        return 'CPT (Carriage Paid To)®';
      } else if (answers.unloading === 'seller') {
        return 'DPU (Delivered at Place Unloaded)®';
      } else if (answers.customs === 'seller') {
        return 'DDP (Delivered Duty Paid)®';
      }
      return 'DAP (Delivered at Place)®';
    }
  };

  const handleNext = () => {
    if (step === 2) {
      setResult(determineIncoterm());
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Incoterms® 2020 Calculator
        </h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Find the right Incoterms® 2020 rule for your international shipment
        </p>
        
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Transportation Mode</CardTitle>
              <CardDescription>Select the primary mode of transport for your shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transportTypes.map((type) => (
                  <div
                    key={type.id}
                    className={cn(
                      "p-6 rounded-lg border-2 cursor-pointer transition-all",
                      transportType === type.id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-border hover:border-emerald-300"
                    )}
                    onClick={() => setTransportType(type.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <type.icon className="w-12 h-12 mb-3 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {transportType && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Available Incoterms® 2020 rules for {transportType} transport:</h4>
                  <div className="flex flex-wrap gap-2">
                    {INCOTERMS_2020[transportType].map((term) => (
                      <span key={term} className="px-2 py-1 bg-white dark:bg-gray-700 rounded-md text-sm">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleNext}
                disabled={!transportType}
              >
                Next Step
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Specify Responsibilities</CardTitle>
              <CardDescription>Define who handles each aspect of the shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {responsibilities.map((resp) => (
                  <div key={resp.id} className="space-y-2">
                    <Label>{resp.question}</Label>
                    <RadioGroup
                      onValueChange={(value) =>
                        setAnswers({ ...answers, [resp.id]: value })
                      }
                      value={answers[resp.id]}
                    >
                      {['seller', 'buyer'].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${resp.id}-${option}`} />
                          <Label htmlFor={`${resp.id}-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              <Button
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleNext}
                disabled={Object.keys(answers).length !== responsibilities.length}
              >
                Get Recommendation
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && result && (
          <Card>
            <CardHeader>
              <CardTitle>Your Recommended Incoterms® 2020 Rule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">{result}</h2>
                <p className="text-muted-foreground mb-6">
                  Based on your selections, we recommend using {result} for your shipment.
                  This recommendation is based on the Incoterms® 2020 rules published by the International Chamber of Commerce.
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 mb-3">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">Need expert assistance?</span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Call us at <a href="tel:8337827628" className="font-bold">833-782-7628 Ext. 1</a> to speak with a logistics expert about your shipping needs.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setStep(1);
                      setTransportType('');
                      setAnswers({});
                      setResult('');
                    }}
                  >
                    Start Over
                  </Button>
                  <Button
                    className="bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50"
                    onClick={() => window.location.href = 'tel:8337827628,1'}
                  >
                    Contact Expert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}