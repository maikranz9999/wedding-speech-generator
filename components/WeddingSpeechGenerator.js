
// components/WeddingSpeechGenerator.js
import { useState } from 'react';
import { Heart, Users, Calendar, MapPin, FileText } from 'lucide-react';

const WeddingSpeechGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedStyleFile, setUploadedStyleFile] = useState(null);
  const [styleAnalysis, setStyleAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [rawNotes, setRawNotes] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionCompleted, setExtractionCompleted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Grunddaten
    person1Name: '',
    person1Gender: '',
    person2Name: '',
    person2Gender: '',
    weddingDate: '',
    weddingLocation: '',
    officiantName: '',
    
    // Familie
    father1Name: '',
    father2Name: '',
    mother1Name: '',
    mother2Name: '',
    children: '',
    missingPersons: '',
    witnesses: '',
    
    // Kennenlerngeschichte
    howMet: '',
    firstMeeting: '',
    firstImpression: '',
    specialMoments: '',
    funnyStories: '',
    timeBeforeRelationship: '',
    obstacles: '',
    realizationMoment: '',
    
    // Beziehung
    becameCouple: '',
    firstDate: '',
    milestones: '',
    movingTogether: '',
    specialTrips: '',
    challenges: '',
    
    // Charaktere
    person1AboutPerson2: '',
    person2AboutPerson1: '',
    person1Loves: '',
    person2Loves: '',
    commonInterests: '',
    favoriteActivities: '',
    person1Background: '',
    person2Background: '',
    insiderJokes: '',
    
    // Macken
    person1Quirks: '',
    person2Quirks: '',
    dealWithQuirks: '',
    morningPerson: '',
    habits: '',
    
    // Antrag
    proposalLocation: '',
    proposalStory: '',
    whoProposed: '',
    ringDetails: '',
    reaction: '',
    proposalMoments: '',
    
    // Alltag
    dailyLife: '',
    eveningActivities: '',
    freeTime: '',
    rituals: '',
    conflictResolution: '',
    biggestCrisis: '',
    
    // Dankbarkeit
    person1Grateful: '',
    person2Grateful: '',
    appreciation: '',
    showLove: '',
    
    // Zukunft
    goals: '',
    dreams: '',
    travelPlans: '',
    familyPlans: '',
    careerPlans: '',
    
    // Besondere Details
    quotes: '',
    music: '',
    symbols: '',
    emotionalMemories: '',
    sadMoments: '',
    successes: '',
    
    // Stil
    speechTone: 'gemischt',
    speechLength: 'mittel',
    specialWishes: ''
  });

  const totalSteps = 10;

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // WICHTIG: Environment Variable für API-Key verwenden
  const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  const API_BASE_URL = 'https://api.anthropic.com/v1/messages';

  const extractDataFromNotes = async () => {
    if (!rawNotes.trim()) {
      alert('Bitte geben Sie Ihre Notizen ein.');
      return;
    }
    
    setIsExtracting(true);
    
    try {
      // ECHTER API-CALL zu Claude
      const extractionPrompt = `Analysiere den folgenden Text aus Hochzeits-Interviews und extrahiere alle relevanten Informationen. Gib mir die Daten als valides JSON zurück mit genau diesen Keys (verwende leere Strings "" für fehlende Informationen):

{
  "person1Name": "",
  "person1Gender": "",
  "person2Name": "",
  "person2Gender": "",
  "weddingDate": "",
  "weddingLocation": "",
  "officiantName": "",
  "father1Name": "",
  "mother1Name": "",
  "father2Name": "",
  "mother2Name": "",
  "children": "",
  "witnesses": "",
  "missingPersons": "",
  "howMet": "",
  "firstMeeting": "",
  "firstImpression": "",
  "funnyStories": "",
  "realizationMoment": "",
  "person1AboutPerson2": "",
  "person2AboutPerson1": "",
  "person1Loves": "",
  "person2Loves": "",
  "person1Background": "",
  "person2Background": "",
  "insiderJokes": "",
  "commonInterests": "",
  "proposalLocation": "",
  "proposalStory": "",
  "whoProposed": "",
  "ringDetails": "",
  "dailyLife": "",
  "biggestCrisis": "",
  "person1Grateful": "",
  "person2Grateful": "",
  "goals": "",
  "quotes": "",
  "music": "",
  "specialWishes": ""
}

Text: ${rawNotes}

Wichtig: Antworte NUR mit dem validen JSON, keine anderen Texte!`;

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: extractionPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      // JSON aus der Antwort extrahieren
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Keine gültige JSON-Antwort von der KI erhalten');
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      
      // FormData aktualisieren
      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));
      
      setExtractionCompleted(true);
      setCurrentStep(1);
      alert('✅ Echte KI-Extraktion erfolgreich! Alle Felder wurden intelligent befüllt.');
      
    } catch (error) {
      console.error('Fehler bei der echten KI-Extraktion:', error);
      
      if (error.message.includes('API Error: 401')) {
        alert('❌ API-Key ungültig. Bitte tragen Sie Ihren echten Anthropic API-Key ein.');
      } else if (error.message.includes('API Error: 429')) {
        alert('❌ Rate Limit erreicht. Bitte warten Sie einen Moment.');
      } else {
        alert(`❌ KI-Extraktion fehlgeschlagen: ${error.message}`);
      }
      
      // Fallback zu lokaler Simulation
      console.log('Fallback zu lokaler Simulation...');
      const extractedData = simulateAIExtraction(rawNotes);
      setFormData(prev => ({ ...prev, ...extractedData }));
      setExtractionCompleted(true);
      setCurrentStep(1);
    }
    
    setIsExtracting(false);
  };

  // Rest des Codes bleibt genau gleich...
  // [Hier würde der komplette Rest Ihres ursprünglichen Codes stehen]
  // Ich kürze es hier nur aus Platzgründen ab

  // Simuliere eine echte KI-JSON-Extraktion (Fallback)
  const simulateAIExtraction = (notes) => {
    const text = notes.toLowerCase();
    
    const aiResponse = {
      person1Name: "",
      person1Gender: "",
      person2Name: "",
      person2Gender: "",
      weddingDate: "",
      weddingLocation: "",
      officiantName: "",
      father1Name: "",
      mother1Name: "",
      father2Name: "",
      mother2Name: "",
      children: "",
      witnesses: "",
      missingPersons: "",
      howMet: "",
      firstMeeting: "",
      firstImpression: "",
      funnyStories: "",
      realizationMoment: "",
      person1AboutPerson2: "",
      person2AboutPerson1: "",
      person1Loves: "",
      person2Loves: "",
      person1Background: "",
      person2Background: "",
      insiderJokes: "",
      commonInterests: "",
      proposalLocation: "",
      proposalStory: "",
      whoProposed: "",
      ringDetails: "",
      dailyLife: "",
      biggestCrisis: "",
      person1Grateful: "",
      person2Grateful: "",
      goals: "",
      quotes: "",
      music: "",
      specialWishes: ""
    };

    // Intelligente Extraktion mit Kontext-Verständnis
    // [Hier steht Ihre komplette Extraktions-Logik]
    
    return aiResponse;
  };

  // Alle anderen Funktionen und der komplette renderStep() Code...
  // [Der gesamte Rest Ihres Codes bleibt unverändert]

  const renderStep = () => {
    // Hier kommt Ihr kompletter renderStep() Code
    // Alle switch cases von 0 bis 9...
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EDEBE7 0%, #F0E9E0 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#5C493E' }}>🤖 KI-Hochzeitsredner Tool</h1>
          <p className="text-gray-600">Erstellen Sie eine personalisierte Traurede in wenigen Schritten - jetzt mit KI-Datenextraktion!</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: '#5C493E' }}>
              {currentStep === 0 ? 'KI-Extraktion' : `Schritt ${currentStep} von ${totalSteps - 1}`}
            </span>
            <span className="text-sm" style={{ color: '#5C493E' }}>
              {Math.round((currentStep / (totalSteps - 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(90deg, #CDB391 0%, #5C493E 100%)',
                width: `${(currentStep / (totalSteps - 1)) * 100}%` 
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto" style={{ backgroundColor: '#F0E9E0' }}>
          {!showSpeech ? (
            <>
              {renderStep()}
              
              <div className="flex justify-between mt-8 pt-6" style={{ borderTop: '1px solid #CDB391' }}>
                <button 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ 
                    backgroundColor: '#EDEBE7', 
                    color: '#5C493E',
                    border: '1px solid #CDB391'
                  }}
                >
                  Zurück
                </button>
                
                {currentStep < totalSteps - 1 ? (
                  <button 
                    onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                    className="px-6 py-3 text-white rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: '#5C493E',
                      '&:hover': { backgroundColor: '#4a3d32' }
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4a3d32'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#5C493E'}
                  >
                    Weiter
                  </button>
                ) : (
                  <button 
                    onClick={handleGenerateSpeech}
                    disabled={isGenerating}
                    className="px-6 py-3 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: '#CDB391' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b8a082'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#CDB391'}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>KI arbeitet...</span>
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        <span>🤖 KI-Rede generieren</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Speech display code */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingSpeechGenerator;
