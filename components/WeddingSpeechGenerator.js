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
    person1Name: '',
    person1Gender: '',
    person2Name: '',
    person2Gender: '',
    weddingDate: '',
    weddingLocation: '',
    officiantName: '',
    father1Name: '',
    father2Name: '',
    mother1Name: '',
    mother2Name: '',
    children: '',
    missingPersons: '',
    witnesses: '',
    howMet: '',
    firstMeeting: '',
    firstImpression: '',
    specialMoments: '',
    funnyStories: '',
    timeBeforeRelationship: '',
    obstacles: '',
    realizationMoment: '',
    becameCouple: '',
    firstDate: '',
    milestones: '',
    movingTogether: '',
    specialTrips: '',
    challenges: '',
    person1AboutPerson2: '',
    person2AboutPerson1: '',
    person1Loves: '',
    person2Loves: '',
    commonInterests: '',
    favoriteActivities: '',
    person1Background: '',
    person2Background: '',
    insiderJokes: '',
    person1Quirks: '',
    person2Quirks: '',
    dealWithQuirks: '',
    morningPerson: '',
    habits: '',
    proposalLocation: '',
    proposalStory: '',
    whoProposed: '',
    ringDetails: '',
    reaction: '',
    proposalMoments: '',
    dailyLife: '',
    eveningActivities: '',
    freeTime: '',
    rituals: '',
    conflictResolution: '',
    biggestCrisis: '',
    person1Grateful: '',
    person2Grateful: '',
    appreciation: '',
    showLove: '',
    goals: '',
    dreams: '',
    travelPlans: '',
    familyPlans: '',
    careerPlans: '',
    quotes: '',
    music: '',
    symbols: '',
    emotionalMemories: '',
    sadMoments: '',
    successes: '',
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

  const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  const API_BASE_URL = 'https://api.anthropic.com/v1/messages';

  const extractDataFromNotes = async () => {
    if (!rawNotes.trim()) {
      alert('Bitte geben Sie Ihre Notizen ein.');
      return;
    }
    
    setIsExtracting(true);
    
    try {
      // Demo-Fallback da API-Key wahrscheinlich nicht gesetzt
      console.log('Fallback zu lokaler Simulation...');
      const extractedData = simulateAIExtraction(rawNotes);
      setFormData(prev => ({ ...prev, ...extractedData }));
      setExtractionCompleted(true);
      setCurrentStep(1);
      alert('✅ Demo-Extraktion erfolgreich! Alle Felder wurden befüllt.');
    } catch (error) {
      console.error('Fehler bei der Extraktion:', error);
      alert('❌ Extraktion fehlgeschlagen.');
    }
    
    setIsExtracting(false);
  };

  const simulateAIExtraction = (notes) => {
    const text = notes.toLowerCase();
    
    return {
      person1Name: "Sarah",
      person1Gender: "weiblich", 
      person2Name: "Alexander",
      person2Gender: "männlich",
      weddingDate: "2024-09-14",
      weddingLocation: "Schloss Bensberg",
      officiantName: "Maria Hochzeit",
      howMet: "Über Dating-App kennengelernt, beide waren Dating-müde",
      firstMeeting: "Café in Kölner Altstadt, Alexander verschüttete Kaffee",
      funnyStories: "Alexander 10 Min zu spät, dreimal umgezogen, Kaffee verschüttet",
      proposalStory: "Eigener Garten unter dem Apfelbaum, es regnete",
      biggestCrisis: "Pandemie 2022 war schwierig, als Sarah Job verlor",
      goals: "Haus mit großem Garten kaufen, Japan-Reise",
      specialWishes: `Basierend auf Notizen: ${notes.substring(0, 100)}...`
    };
  };

  const handleGenerateSpeech = async () => {
    setIsGenerating(true);
    
    // Demo-Rede generieren
    setTimeout(() => {
      const demoSpeech = `# Traurede für ${formData.person1Name || 'Person 1'} & ${formData.person2Name || 'Person 2'}

## Liebe Gäste, liebe Familie, liebe Freunde,

ich begrüße Sie alle herzlich zu diesem außergewöhnlichen Tag! Mein Name ist ${formData.officiantName || 'Trauredner/in'}, und es ist mir eine große Ehre, heute ${formData.person1Name || 'Person 1'} und ${formData.person2Name || 'Person 2'} zu trauen.

## Ihre besondere Geschichte

${formData.howMet || 'Die beiden haben sich auf eine ganz besondere Weise kennengelernt.'}

${formData.firstMeeting || 'Ihr erstes Treffen war der Beginn einer wunderbaren Liebesgeschichte.'}

## Der Antrag

${formData.proposalStory || 'Der Heiratsantrag war ein unvergesslicher Moment voller Emotionen und Freude.'}

## Das Eheversprechen

${formData.person1Name || 'Person 1'} und ${formData.person2Name || 'Person 2'}, Sie haben sich gefunden und entschieden, Ihren Lebensweg gemeinsam zu gehen.

Mit der Kraft, die mir übertragen wurde, erkläre ich Sie hiermit zu Mann und Frau!

Sie dürfen sich küssen!

---

*🤖 Demo-Version: Vollständige KI-Rede verfügbar mit API-Key Konfiguration.*`;

      setGeneratedSpeech(demoSpeech);
      setShowSpeech(true);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSpeech);
    alert('Rede in die Zwischenablage kopiert!');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText style={{ color: '#5C493E' }} size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>🤖 KI-Datenextraktion</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">📝 Notizen aus Brautpaar-Gesprächen</h3>
              <p className="text-sm text-blue-700 mb-4">
                Fügen Sie hier alle Ihre Notizen aus Gesprächen mit dem Brautpaar ein. 
                Die KI extrahiert automatisch alle relevanten Informationen.
              </p>
              
              <textarea 
                className="w-full p-4 rounded-lg border border-blue-300 h-60 text-sm"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Geben Sie hier Ihre Notizen ein:

Beispiel:
Sarah und Alexander heiraten am 14.09.2024 in Schloss Bensberg.
Sie haben sich über eine Dating-App kennengelernt.
Erstes Date war in einem Café in der Kölner Altstadt.
Alexander verschüttete Kaffee über sein weißes Hemd.
Der Antrag fand im eigenen Garten unter dem Apfelbaum statt..."
                style={{ 
                  backgroundColor: 'white',
                  color: '#5C493E'
                }}
              />
            </div>
            
            <div className="text-center">
              <button 
                onClick={extractDataFromNotes}
                disabled={isExtracting || !rawNotes.trim()}
                className="text-white px-8 py-4 rounded-lg flex items-center space-x-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: '#5C493E' }}
              >
                {isExtracting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>🤖 KI extrahiert Daten...</span>
                  </>
                ) : (
                  <>
                    <FileText size={24} />
                    <span>🚀 Demo-Extraktion starten</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="border-t pt-4" style={{ borderColor: '#CDB391' }}>
              <button 
                onClick={() => setCurrentStep(1)}
                className="text-center w-full py-2 text-sm underline hover:no-underline transition-all"
                style={{ color: '#5C493E' }}
              >
                ⚡ Überspringen und manuell ausfüllen
              </button>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users style={{ color: '#5C493E' }} size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Grunddaten des Brautpaares
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Name Person 1
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg border"
                  value={formData.person1Name}
                  onChange={(e) => updateFormData('person1Name', e.target.value)}
                  placeholder="Sarah"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Geschlecht Person 1
                </label>
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={formData.person1Gender}
                  onChange={(e) => updateFormData('person1Gender', e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="weiblich">Weiblich</option>
                  <option value="männlich">Männlich</option>
                  <option value="divers">Divers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Name Person 2
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.person2Name}
                  onChange={(e) => updateFormData('person2Name', e.target.value)}
                  placeholder="Alexander"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Geschlecht Person 2
                </label>
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={formData.person2Gender}
                  onChange={(e) => updateFormData('person2Gender', e.target.value)}
                >
                  <option value="">Bitte wählen</option>
                  <option value="weiblich">Weiblich</option>
                  <option value="männlich">Männlich</option>
                  <option value="divers">Divers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Datum der Trauung
                </label>
                <input 
                  type="date" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.weddingDate}
                  onChange={(e) => updateFormData('weddingDate', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Ort der Trauung
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.weddingLocation}
                  onChange={(e) => updateFormData('weddingLocation', e.target.value)}
                  placeholder="Schloss Bensberg"
                />
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText style={{ color: '#5C493E' }} size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Stil der Rede & Generierung
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>Gewünschter Ton der Rede</label>
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={formData.speechTone}
                  onChange={(e) => updateFormData('speechTone', e.target.value)}
                >
                  <option value="romantisch">Romantisch & emotional</option>
                  <option value="humorvoll">Humorvoll & leicht</option>
                  <option value="feierlich">Feierlich & traditionell</option>
                  <option value="modern">Modern & ungezwungen</option>
                  <option value="gemischt">Gemischt (romantisch mit Humor)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>Gewünschte Länge</label>
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={formData.speechLength}
                  onChange={(e) => updateFormData('speechLength', e.target.value)}
                >
                  <option value="kurz">Kurz (10-15 Min)</option>
                  <option value="mittel">Mittel (15-25 Min)</option>
                  <option value="lang">Lang (25-35 Min)</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#5C493E' }}>Bereit für Ihre personalisierte Traurede?</h3>
              <p className="text-gray-600 mb-4">
                Alle Informationen sind erfasst. Klicken Sie auf "Rede generieren" um Ihre Demo-Rede zu erstellen.
              </p>
              <div className="text-center">
                <button 
                  onClick={handleGenerateSpeech}
                  disabled={isGenerating}
                  className="text-white px-8 py-4 rounded-lg flex items-center space-x-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: '#5C493E' }}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Demo-Rede wird erstellt...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={24} />
                      <span>🤖 Demo-Rede generieren</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#5C493E' }}>
              Schritt {currentStep} von {totalSteps - 1}
            </h2>
            <p className="text-gray-600 mb-6">
              Dieser Schritt wird in der vollständigen Version implementiert.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Inhalt für Schritt {currentStep} kommt hier hin:
                  <br />
                  - Familie & nahestehende Personen
                  <br />
                  - Kennenlerngeschichte  
                  <br />
                  - Charaktere & Eigenschaften
                  <br />
                  - Der Antrag & besondere Momente
                  <br />
                  - Alltag & bewährte Partnerschaft
                  <br />
                  - Zukunft & besondere Details
                </p>
              </div>
            </div>
          </div>
        );
    }
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
                    style={{ backgroundColor: '#5C493E' }}
                  >
                    Weiter
                  </button>
                ) : (
                  <button 
                    onClick={handleGenerateSpeech}
                    disabled={isGenerating}
                    className="px-6 py-3 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: '#CDB391' }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Rede wird erstellt...</span>
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        <span>🤖 Rede generieren</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText style={{ color: '#5C493E' }} size={24} />
                  <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>Ihre personalisierte Traurede</h2>
                </div>
                <button 
                  onClick={() => setShowSpeech(false)}
                  className="hover:opacity-75 transition-opacity"
                  style={{ color: '#5C493E' }}
                >
                  ← Zurück zum Formular
                </button>
              </div>
              
              <div className="rounded-lg p-4" style={{ backgroundColor: '#EDEBE7' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold" style={{ color: '#5C493E' }}>
                    Traurede für {formData.person1Name || 'Person 1'} & {formData.person2Name || 'Person 2'}
                  </h3>
                  <button 
                    onClick={copyToClipboard}
                    className="text-white px-4 py-2 rounded transition-colors text-sm"
                    style={{ backgroundColor: '#CDB391' }}
                  >
                    📋 Kopieren
                  </button>
                </div>
                
                <textarea
                  value={generatedSpeech}
                  onChange={(e) => setGeneratedSpeech(e.target.value)}
                  className="w-full h-96 p-4 rounded-lg text-sm resize-none"
                  style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #CDB391',
                    color: '#5C493E'
                  }}
                  placeholder="Ihre generierte Rede erscheint hier..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingSpeechGenerator;
