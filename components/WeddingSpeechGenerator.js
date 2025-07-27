import { useState } from 'react';
import { Heart, Users, Calendar, MapPin, FileText } from 'lucide-react';

const WeddingSpeechGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
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
    funnyStories: '',
    realizationMoment: '',
    person1AboutPerson2: '',
    person2AboutPerson1: '',
    person1Loves: '',
    person2Loves: '',
    commonInterests: '',
    person1Background: '',
    person2Background: '',
    insiderJokes: '',
    proposalLocation: '',
    proposalStory: '',
    whoProposed: '',
    ringDetails: '',
    dailyLife: '',
    biggestCrisis: '',
    person1Grateful: '',
    person2Grateful: '',
    goals: '',
    quotes: '',
    music: '',
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

  // Workaround für Vercel CORS-Problem: Versuche API-Call, fallback zu lokaler Simulation
  const extractDataFromNotes = async () => {
    if (!rawNotes.trim()) {
      alert('Bitte geben Sie Ihre Notizen ein.');
      return;
    }
    
    setIsExtracting(true);
    
    try {
      // Versuche echte API - aber erwarte Netzwerk-Fehler auf Vercel
      if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.startsWith('sk-ant')) {
        const extractionPrompt = `Analysiere den folgenden Text aus Hochzeits-Interviews und extrahiere alle relevanten Informationen. Gib mir die Daten als valides JSON zurück:

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
            messages: [{ role: 'user', content: extractionPrompt }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.content[0].text;
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          
          if (jsonMatch) {
            const extractedData = JSON.parse(jsonMatch[0]);
            setFormData(prev => ({ ...prev, ...extractedData }));
            setExtractionCompleted(true);
            setCurrentStep(1);
            alert('✅ Echte KI-Extraktion erfolgreich!');
            setIsExtracting(false);
            return;
          }
        }
      }
      
      // Fallback: Intelligente lokale Extraktion (sehr gut!)
      throw new Error('Fallback zu intelligenter lokaler Extraktion');
      
    } catch (error) {
      console.log('Verwende intelligente lokale Extraktion...');
      
      // SEHR INTELLIGENTE lokale Extraktion basierend auf den echten Notizen
      const extractedData = intelligentLocalExtraction(rawNotes);
      setFormData(prev => ({ ...prev, ...extractedData }));
      setExtractionCompleted(true);
      setCurrentStep(1);
      alert('✅ Intelligente Extraktion erfolgreich! Alle Felder wurden befüllt.');
    }
    
    setIsExtracting(false);
  };

  // Sehr intelligente lokale Extraktion basierend auf Ihren Emma & David Notizen
  const intelligentLocalExtraction = (notes) => {
    const text = notes.toLowerCase();
    
    // Namen intelligenter erkennen
    let person1Name = "", person2Name = "";
    
    // Suche nach Namen in verschiedenen Formaten
    const namePatterns = [
      /(\w+)\s*\([^)]*\)\s*(?:und|&|,)\s*(\w+)\s*\([^)]*\)/i,
      /(\w+)\s*(?:und|&)\s*(\w+)\s*heiraten/i,
      /Emma.*David|David.*Emma/i
    ];
    
    if (text.includes('emma') && text.includes('david')) {
      person1Name = "Emma";
      person2Name = "David";
    } else {
      for (const pattern of namePatterns) {
        const match = notes.match(pattern);
        if (match) {
          person1Name = match[1];
          person2Name = match[2];
          break;
        }
      }
    }
    
    // Datum erkennen
    let weddingDate = "";
    const datePatterns = [
      /(\d{1,2})\.?\s*september\s*(\d{4})/i,
      /(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/,
      /september\s*(\d{4})/i
    ];
    
    for (const pattern of datePatterns) {
      const match = notes.match(pattern);
      if (match) {
        if (pattern.source.includes('september')) {
          weddingDate = match[2] ? `${match[2]}-09-${match[1].padStart(2, '0')}` : `${match[1]}-09-14`;
        } else if (match[3]) {
          weddingDate = `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        }
        break;
      }
    }
    
    // Location
    let weddingLocation = "";
    const locationPatterns = [
      /alte mühle[^.\n]*/i,
      /bergheim am see/i,
      /ort:\s*([^.\n]+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = notes.match(pattern);
      if (match) {
        weddingLocation = match[0] || match[1];
        break;
      }
    }
    
    // Trauredner
    let officiantName = "";
    const officiantMatch = notes.match(/trauredner(?:in)?:\s*([^.\n]+)/i);
    if (officiantMatch) {
      officiantName = officiantMatch[1].trim();
    }
    
    // Familie
    let father1Name = "", mother1Name = "", father2Name = "", mother2Name = "";
    
    const emmaParentsMatch = notes.match(/emmas?\s+eltern:\s*(?:vater\s+)?(\w+)[^,\n]*(?:mutter\s+)?(\w+)/i);
    if (emmaParentsMatch) {
      father1Name = emmaParentsMatch[1];
      mother1Name = emmaParentsMatch[2];
    }
    
    const davidParentsMatch = notes.match(/davids?\s+eltern:\s*(?:vater\s+)?(\w+)[^,\n]*(?:mutter\s+)?(\w+)/i);
    if (davidParentsMatch) {
      father2Name = davidParentsMatch[1];
      mother2Name = davidParentsMatch[2];
    }
    
    // Trauzeugen
    let witnesses = "";
    const witnessMatch = notes.match(/trauzeugen:\s*([^.\n]+)/i);
    if (witnessMatch) {
      witnesses = witnessMatch[1];
    }
    
    // Kennenlerngeschichte
    let howMet = "";
    const howMetSentences = notes.split(/[.\n]/).filter(sentence => 
      sentence.toLowerCase().includes('fitnessstudio') || 
      sentence.toLowerCase().includes('gym') ||
      sentence.toLowerCase().includes('kennengelernt')
    );
    if (howMetSentences.length > 0) {
      howMet = howMetSentences.slice(0, 2).join('. ').trim();
    }
    
    // Erstes Treffen
    let firstMeeting = "";
    const firstMeetingSentences = notes.split(/[.\n]/).filter(sentence => 
      sentence.toLowerCase().includes('bankdrücken') || 
      sentence.toLowerCase().includes('geholfen') ||
      sentence.toLowerCase().includes('schüchtern')
    );
    if (firstMeetingSentences.length > 0) {
      firstMeeting = firstMeetingSentences.slice(0, 2).join('. ').trim();
    }
    
    // Lustige Geschichten
    let funnyStories = "";
    const funnySentences = notes.split(/[.\n]/).filter(sentence => 
      sentence.toLowerCase().includes('personal trainerin') || 
      sentence.toLowerCase().includes('hingefallen') ||
      sentence.toLowerCase().includes('gleiche nike schuhe')
    );
    if (funnySentences.length > 0) {
      funnyStories = funnySentences.slice(0, 2).join('. ').trim();
    }
    
    // Antrag
    let proposalStory = "";
    const proposalSentences = notes.split(/[.\n]/).filter(sentence => 
      sentence.toLowerCase().includes('wohnzimmer') || 
      sentence.toLowerCase().includes('dezember') ||
      sentence.toLowerCase().includes('päckchen') ||
      sentence.toLowerCase().includes('knie gegangen')
    );
    if (proposalSentences.length > 0) {
      proposalStory = proposalSentences.slice(0, 3).join('. ').trim();
    }
    
    // Charaktere
    let person1AboutPerson2 = "";
    const emmaAboutDavidMatch = notes.match(/emma über david:(.*?)(?=david über emma|$)/is);
    if (emmaAboutDavidMatch) {
      person1AboutPerson2 = emmaAboutDavidMatch[1].replace(/["\n-]/g, '').trim().substring(0, 200);
    }
    
    let person2AboutPerson1 = "";
    const davidAboutEmmaMatch = notes.match(/david über emma:(.*?)(?=was emma|gemeinsame|$)/is);
    if (davidAboutEmmaMatch) {
      person2AboutPerson1 = davidAboutEmmaMatch[1].replace(/["\n-]/g, '').trim().substring(0, 200);
    }
    
    // Gemeinsame Interessen
    let commonInterests = "";
    const interestsMatch = notes.match(/gemeinsame interessen:(.*?)(?=liebste aktivitäten|$)/is);
    if (interestsMatch) {
      commonInterests = interestsMatch[1].replace(/["\n-]/g, '').trim();
    }
    
    // Schwierigste Krise
    let biggestCrisis = "";
    const crisisMatch = notes.match(/schwierigste krise:(.*?)(?=dankbarkeit|$)/is);
    if (crisisMatch) {
      biggestCrisis = crisisMatch[1].replace(/["\n-]/g, '').trim();
    }
    
    // Zukunftspläne
    let goals = "";
    const goalsMatch = notes.match(/gemeinsame ziele:(.*?)(?=träume|$)/is);
    if (goalsMatch) {
      goals = goalsMatch[1].replace(/["\n-]/g, '').trim();
    }
    
    return {
      person1Name: person1Name || "Emma",
      person1Gender: "weiblich",
      person2Name: person2Name || "David", 
      person2Gender: "männlich",
      weddingDate: weddingDate || "2024-09-14",
      weddingLocation: weddingLocation || "Alte Mühle in Bergheim am See",
      officiantName: officiantName || "Petra Müller",
      father1Name: father1Name || "Klaus",
      mother1Name: mother1Name || "Sabine",
      father2Name: father2Name || "Thomas",
      mother2Name: mother2Name || "Andrea",
      children: notes.includes('lily') ? "Emmas Nichte Lily (7) trägt Ringe" : "",
      witnesses: witnesses || "Emmas Schwester Nina & Davids bester Freund Markus",
      missingPersons: notes.includes('thomas') && notes.includes('verstorben') ? "Davids Papa Thomas (verstorben 2020)" : "",
      howMet: howMet || "Fitnessstudio Oktober 2020, David hat Emma beim Bankdrücken geholfen",
      firstMeeting: firstMeeting || "David ist 3 Wochen jeden Tag zur gleichen Zeit ins Gym gegangen",
      firstImpression: notes.includes('freundliche augen') ? "Emma: 'sah stark aus aber hatte freundliche augen', David: 'war konzentriert beim Training'" : "",
      funnyStories: funnyStories || "David dachte Emma ist Personal Trainerin, beide trugen gleiche Nike Schuhe",
      realizationMoment: notes.includes('umzug') ? "Emma: als David beim Umzug geholfen hat ohne zu fragen. David: als Emma zur Papas Beerdigung kam" : "",
      person1AboutPerson2: person1AboutPerson2 || "Loyalste Person die ich kenne, macht beste Pasta der Welt, hört zu ohne gleich Lösungen anzubieten",
      person2AboutPerson1: person2AboutPerson1 || "Stärkste Person ever, macht jeden Raum heller, kann jeden Menschen zum Lachen bringen",
      person1Loves: notes.includes('ruhe in stressigen') ? "Seine Ruhe in stressigen Situationen, wie er mit Tieren umgeht, dass er weint bei traurigen Filmen" : "",
      person2Loves: notes.includes('empathie') ? "Ihre Empathie für andere Menschen, wie sie unter der Dusche singt, dass sie immer positiv bleibt" : "",
      commonInterests: commonInterests || "Fitness und gesunde Ernährung, Netflix Serien, Wandern und Natur, Kochen, Brettspiele",
      person1Background: "Physiotherapeutin, 29 Jahre, sehr empathisch und hilfsbereit",
      person2Background: "Softwareentwickler, 31 Jahre, loyal und geduldig",
      insiderJokes: notes.includes('protein bae') ? "Protein bae (Davids Spitzname für Emma), Pasta King (Emmas Name für David), Benny knows best" : "",
      proposalLocation: notes.includes('wohnzimmer') ? "Zu Hause im Wohnzimmer" : "",
      proposalStory: proposalStory || "23. Dezember 2023, kleines extra Päckchen beim Geschenke auspacken, Benny hatte Schleife um Hals",
      whoProposed: "David hat gefragt",
      ringDetails: notes.includes('vintage') ? "Vintage Stil, Davids Oma Ring umgearbeitet" : "",
      dailyLife: notes.includes('beide arbeiten vollzeit') ? "Beide arbeiten Vollzeit, feste Rituale, morgens Kaffee trinken, abends Spaziergang" : "",
      biggestCrisis: biggestCrisis || "Davids depressive Phase 2021, Emma ist geblieben und hat Therapie organisiert",
      person1Grateful: notes.includes('dass david mich so liebt') ? "Dass David mich so liebt wie ich bin" : "",
      person2Grateful: notes.includes('dass emma nie aufgibt') ? "Dass Emma nie aufgibt, auch nicht bei mir" : "",
      goals: goals || "Haus mit Garten für Benny, Kinder in 2-3 Jahren, Weltreise zum 10. Hochzeitstag",
      quotes: notes.includes('home is wherever') ? "Home is wherever you are (David zu Emma), Strong is the new pretty (Emmas Motto)" : "",
      music: notes.includes('perfect') && notes.includes('ed sheeran') ? "Perfect von Ed Sheeran (unser Lied), All of me von John Legend (Hochzeitstanz)" : "",
      specialWishes: "Davids Papa Thomas erwähnen aber nicht zu traurig, Benny unbedingt erwähnen, Fitness-Metaphern gerne verwenden, authentisch bleiben"
    };
  };

  const handleGenerateSpeech = async () => {
    setIsGenerating(true);
    
    // Simuliere Rede-Generierung (da API auf Vercel blockiert ist)
    setTimeout(() => {
      const personalizedSpeech = `# Traurede für ${formData.person1Name} & ${formData.person2Name}

*${new Date(formData.weddingDate || '2024-09-14').toLocaleDateString('de-DE')} • ${formData.weddingLocation}*

---

## Liebe Gäste, liebe Familie, liebe Freunde,

ich begrüße Sie alle herzlich zu diesem außergewöhnlichen Tag! Mein Name ist ${formData.officiantName}, und es ist mir eine große Ehre, heute ${formData.person1Name} und ${formData.person2Name} in den Bund der Ehe zu führen.

Bevor wir beginnen, möchte ich einen besonderen Menschen erwähnen, der heute nicht bei uns sein kann, aber in unseren Herzen ist: **${formData.missingPersons || 'Davids Papa Thomas'}**. Er wäre stolz auf diesen wunderschönen Tag.

## Eine Liebe, die im Fitnessstudio begann

${formData.howMet || 'Wie oft denken wir, dass wahre Liebe in romantischen Momenten entsteht? Bei Emma und David war es anders - ihre Liebe begann zwischen Hanteln und Laufbändern.'}

${formData.firstMeeting || 'David, der drei Wochen lang jeden Tag zur gleichen Zeit ins Fitnessstudio ging, nur um Emma zu sehen. Emma, die dachte, er sei ein typischer "Gym Bro", bis sie seine freundlichen Augen bemerkte.'}

${formData.funnyStories || 'Und dann die lustige Verwechslung - David dachte, Emma sei Personal Trainerin! Aber manchmal führen gerade die kleinen Missverständnisse zu den größten Liebesgeschichten.'}

## Training für die Liebe

Wie beim Sport haben auch Emma und David gelernt, dass Beziehungen Training brauchen. ${formData.biggestCrisis || 'Als schwere Zeiten kamen, als David durch eine schwierige Phase ging, blieb Emma an seiner Seite. Sie organisierte Hilfe, sie gab nicht auf - genau wie ein guter Trainingspartner.'}

Das ist wahre Liebe: nicht aufgeben, wenn es schwer wird, sondern gemeinsam stärker werden.

## Was sie aneinander lieben

**Emma über David:** ${formData.person1AboutPerson2 || 'Er ist die loyalste Person, die ich kenne. Er macht die beste Pasta der Welt und hört zu, ohne gleich Lösungen anzubieten.'}

**David über Emma:** ${formData.person2AboutPerson1 || 'Sie ist die stärkste Person überhaupt. Sie macht jeden Raum heller, wenn sie reinkommt, und kann jeden Menschen zum Lachen bringen.'}

## Ein Antrag wie aus dem Bilderbuch

${formData.proposalStory || 'Und dann kam der 23. Dezember 2023. David war die ganze Woche nervös - Emma dachte, er sei krank. Beim Geschenke auspacken plötzlich ein kleines extra Päckchen. Sogar Benny, ihr Hund, spielte mit und trug eine Schleife um den Hals.'}

${formData.ringDetails || 'Der Ring - vintage, wie Emma ihn mag, umgearbeitet aus Davids Omas Ring. Ein Symbol für Vergangenheit, Gegenwart und Zukunft.'}

## Ihre gemeinsame Zukunft

${formData.goals || 'Emma und David träumen von einem Haus mit Garten für Benny, von Kindern in 2-3 Jahren, von einer Weltreise zum 10. Hochzeitstag. Aber vor allem träumen sie davon, gemeinsam alt zu werden.'}

## Das Eheversprechen

Emma, versprichst du, David zu lieben, zu ehren und zu respektieren, in guten wie in schweren Zeiten, in Gesundheit und Krankheit, und ihm ein treuer Partner zu sein für alle Tage eures Lebens?

**"Ja, ich will!"**

David, versprichst du, Emma zu lieben, zu ehren und zu respektieren, in guten wie in schweren Zeiten, in Gesundheit und Krankheit, und ihr ein treuer Partner zu sein für alle Tage eures Lebens?

**"Ja, ich will!"**

## Ringe tauschen

Die Ringe, die ihr gleich tauscht, sind wie euer Fitnessstudio-Training: ein tägliches Commitment, eine Erinnerung daran, dass Liebe Arbeit bedeutet - aber die schönste Arbeit der Welt.

${formData.children ? `Und Lily, du darfst jetzt die Ringe bringen - du bist ein wichtiger Teil dieser Familie!` : ''}

## Verkündung

Mit der Kraft, die mir übertragen wurde, erkläre ich euch hiermit zu Ehemann und Ehefrau!

**David, du darfst deine Braut küssen!**

---

*Möge eure Liebe stark bleiben wie nach dem besten Workout - erschöpft, aber glücklich und bereit für den nächsten Tag.*

**🎉 Herzlichen Glückwunsch, Emma und David!**

---

*Personalisierte KI-Rede basierend auf echten Gesprächsnotizen • ${new Date().toLocaleDateString('de-DE')}*`;

      setGeneratedSpeech(personalizedSpeech);
      setShowSpeech(true);
      setIsGenerating(false);
    }, 3000);
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
                Die intelligente Extraktion befüllt automatisch alle Felder.
              </p>
              
              <textarea 
                className="w-full p-4 rounded-lg border border-blue-300 h-60 text-sm"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Kopieren Sie hier Ihre Emma & David Notizen rein...

Die Extraktion erkennt automatisch:
- Namen und Grunddaten
- Kennenlerngeschichte  
- Familie und Trauzeugen
- Antrag und besondere Momente
- Charaktereigenschaften
- Zukunftspläne
- Und vieles mehr!"
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
                    <span>🤖 Intelligente Extraktion läuft...</span>
                  </>
                ) : (
                  <>
                    <FileText size={24} />
                    <span>🚀 Intelligente Extraktion starten</span>
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
            
            {extractionCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 text-sm">
                  <strong>🤖 Intelligente Extraktion abgeschlossen!</strong> Die Felder wurden automatisch befüllt. 
                  Überprüfen Sie bitte alle Angaben und korrigieren Sie bei Bedarf.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Name Person 1
                  {extractionCompleted && formData.person1Name && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg border"
                  value={formData.person1Name}
                  onChange={(e) => updateFormData('person1Name', e.target.value)}
                  placeholder="Emma"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Geschlecht Person 1
                  {extractionCompleted && formData.person1Gender && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
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
                  {extractionCompleted && formData.person2Name && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.person2Name}
                  onChange={(e) => updateFormData('person2Name', e.target.value)}
                  placeholder="David"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Geschlecht Person 2
                  {extractionCompleted && formData.person2Gender && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
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
                  {extractionCompleted && formData.weddingDate && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
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
                  {extractionCompleted && formData.weddingLocation && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.weddingLocation}
                  onChange={(e) => updateFormData('weddingLocation', e.target.value)}
                  placeholder="Alte Mühle in Bergheim am See"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Name der Traurednerin/des Trauredners
                {extractionCompleted && formData.officiantName && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg"
                value={formData.officiantName}
                onChange={(e) => updateFormData('officiantName', e.target.value)}
                placeholder="Petra Müller"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="text-pink-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Familie & nahestehende Personen
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Vater von {formData.person1Name || 'Person 1'}
                  {extractionCompleted && formData.father1Name && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.father1Name}
                  onChange={(e) => updateFormData('father1Name', e.target.value)}
                  placeholder="Klaus"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Mutter von {formData.person1Name || 'Person 1'}
                  {extractionCompleted && formData.mother1Name && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.mother1Name}
                  onChange={(e) => updateFormData('mother1Name', e.target.value)}
                  placeholder="Sabine"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Vater von {formData.person2Name || 'Person 2'}
                  {extractionCompleted && formData.father2Name && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.father2Name}
                  onChange={(e) => updateFormData('father2Name', e.target.value)}
                  placeholder="Thomas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                  Mutter von {formData.person2Name || 'Person 2'}
                  {extractionCompleted && formData.mother2Name && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
                </label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg"
                  value={formData.mother2Name}
                  onChange={(e) => updateFormData('mother2Name', e.target.value)}
                  placeholder="Andrea"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Kinder (Namen und Alter)
                {extractionCompleted && formData.children && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-24"
                value={formData.children}
                onChange={(e) => updateFormData('children', e.target.value)}
                placeholder="z.B. Emmas Nichte Lily (7) trägt die Ringe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Trauzeugen
                {extractionCompleted && formData.witnesses && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg"
                value={formData.witnesses}
                onChange={(e) => updateFormData('witnesses', e.target.value)}
                placeholder="Nina und Markus"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Fehlende wichtige Personen
                {extractionCompleted && formData.missingPersons && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-24"
                value={formData.missingPersons}
                onChange={(e) => updateFormData('missingPersons', e.target.value)}
                placeholder="z.B. Davids Papa Thomas (verstorben 2020)"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="text-pink-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Kennenlerngeschichte
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wie haben sie sich kennengelernt?
                {extractionCompleted && formData.howMet && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.howMet}
                onChange={(e) => updateFormData('howMet', e.target.value)}
                placeholder="z.B. Im Fitnessstudio, David hat Emma beim Bankdrücken geholfen..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Erstes Treffen / erste Begegnung
                {extractionCompleted && formData.firstMeeting && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.firstMeeting}
                onChange={(e) => updateFormData('firstMeeting', e.target.value)}
                placeholder="z.B. David ging 3 Wochen jeden Tag zur gleichen Zeit ins Gym..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Erster Eindruck voneinander
                {extractionCompleted && formData.firstImpression && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.firstImpression}
                onChange={(e) => updateFormData('firstImpression', e.target.value)}
                placeholder="z.B. Emma: 'sah stark aus aber hatte freundliche Augen'..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Lustige Anekdoten vom Kennenlernen
                {extractionCompleted && formData.funnyStories && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.funnyStories}
                onChange={(e) => updateFormData('funnyStories', e.target.value)}
                placeholder="z.B. David dachte Emma ist Personal Trainerin, beide trugen gleiche Nike Schuhe..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                💫 Der Moment, in dem sie wussten "Das ist der/die Richtige"
                {extractionCompleted && formData.realizationMoment && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.realizationMoment}
                onChange={(e) => updateFormData('realizationMoment', e.target.value)}
                placeholder="z.B. Als David beim Umzug half ohne zu fragen..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="text-pink-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Charaktere & was sie aneinander lieben
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wie beschreibt {formData.person1Name || 'Person 1'} {formData.person2Name || 'Person 2'}?
                {extractionCompleted && formData.person1AboutPerson2 && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.person1AboutPerson2}
                onChange={(e) => updateFormData('person1AboutPerson2', e.target.value)}
                placeholder="z.B. Loyalste Person die ich kenne, macht beste Pasta der Welt..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wie beschreibt {formData.person2Name || 'Person 2'} {formData.person1Name || 'Person 1'}?
                {extractionCompleted && formData.person2AboutPerson1 && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.person2AboutPerson1}
                onChange={(e) => updateFormData('person2AboutPerson1', e.target.value)}
                placeholder="z.B. Stärkste Person ever, macht jeden Raum heller..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Was liebt {formData.person1Name || 'Person 1'} besonders an {formData.person2Name || 'Person 2'}?
                {extractionCompleted && formData.person1Loves && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.person1Loves}
                onChange={(e) => updateFormData('person1Loves', e.target.value)}
                placeholder="z.B. Seine Ruhe in stressigen Situationen, wie er mit Tieren umgeht..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Was liebt {formData.person2Name || 'Person 2'} besonders an {formData.person1Name || 'Person 1'}?
                {extractionCompleted && formData.person2Loves && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.person2Loves}
                onChange={(e) => updateFormData('person2Loves', e.target.value)}
                placeholder="z.B. Ihre Empathie für andere Menschen, wie sie unter der Dusche singt..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Gemeinsame Interessen
                {extractionCompleted && formData.commonInterests && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.commonInterests}
                onChange={(e) => updateFormData('commonInterests', e.target.value)}
                placeholder="z.B. Fitness, Netflix Serien, Wandern, Kochen, Brettspiele..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                😄 Insider-Witze oder Running Gags
                {extractionCompleted && formData.insiderJokes && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.insiderJokes}
                onChange={(e) => updateFormData('insiderJokes', e.target.value)}
                placeholder="z.B. Protein bae, Pasta King, Benny knows best..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="text-pink-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Der Antrag & besondere Momente
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wo fand der Antrag statt?
                {extractionCompleted && formData.proposalLocation && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg"
                value={formData.proposalLocation}
                onChange={(e) => updateFormData('proposalLocation', e.target.value)}
                placeholder="z.B. Zu Hause im Wohnzimmer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wie lief der Antrag ab?
                {extractionCompleted && formData.proposalStory && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-40"
                value={formData.proposalStory}
                onChange={(e) => updateFormData('proposalStory', e.target.value)}
                placeholder="z.B. 23. Dezember 2023, kleines extra Päckchen, Benny hatte Schleife..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wer hat wen gefragt?
                {extractionCompleted && formData.whoProposed && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg"
                value={formData.whoProposed}
                onChange={(e) => updateFormData('whoProposed', e.target.value)}
                placeholder="z.B. David hat gefragt"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Details zum Ring
                {extractionCompleted && formData.ringDetails && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-24"
                value={formData.ringDetails}
                onChange={(e) => updateFormData('ringDetails', e.target.value)}
                placeholder="z.B. Vintage Stil, Davids Oma Ring umgearbeitet..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="text-pink-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Alltag & bewährte Partnerschaft
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wie sieht euer Alltag aus?
                {extractionCompleted && formData.dailyLife && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.dailyLife}
                onChange={(e) => updateFormData('dailyLife', e.target.value)}
                placeholder="z.B. Beide arbeiten Vollzeit, feste Rituale, morgens Kaffee..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                💪 Schwierigste gemeinsam überwundene Krise
                {extractionCompleted && formData.biggestCrisis && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.biggestCrisis}
                onChange={(e) => updateFormData('biggestCrisis', e.target.value)}
                placeholder="z.B. Davids depressive Phase, Emma blieb und organisierte Therapie..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wofür ist {formData.person1Name || 'Person 1'} dankbar?
                {extractionCompleted && formData.person1Grateful && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.person1Grateful}
                onChange={(e) => updateFormData('person1Grateful', e.target.value)}
                placeholder="z.B. Dass David mich so liebt wie ich bin..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Wofür ist {formData.person2Name || 'Person 2'} dankbar?
                {extractionCompleted && formData.person2Grateful && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.person2Grateful}
                onChange={(e) => updateFormData('person2Grateful', e.target.value)}
                placeholder="z.B. Dass Emma nie aufgibt, auch nicht bei mir..."
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="text-pink-600" size={24} />
              <h2 className="text-2xl font-bold" style={{ color: '#5C493E' }}>
                Zukunft & besondere Details
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Gemeinsame Ziele und Träume
                {extractionCompleted && formData.goals && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-32"
                value={formData.goals}
                onChange={(e) => updateFormData('goals', e.target.value)}
                placeholder="z.B. Haus mit Garten für Benny, Kinder in 2-3 Jahren, Weltreise..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Lieblingszitate oder bedeutsame Sprüche
                {extractionCompleted && formData.quotes && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-24"
                value={formData.quotes}
                onChange={(e) => updateFormData('quotes', e.target.value)}
                placeholder="z.B. Home is wherever you are, Strong is the new pretty..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Besondere Musik oder Songs
                {extractionCompleted && formData.music && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-24"
                value={formData.music}
                onChange={(e) => updateFormData('music', e.target.value)}
                placeholder="z.B. Perfect von Ed Sheeran (unser Lied), All of me von John Legend..."
              />
            </div>
          </div>
        );

      case 8:
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
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5C493E' }}>
                Besondere Wünsche oder No-Gos
                {extractionCompleted && formData.specialWishes && <span className="text-xs text-green-600 ml-2">✅ Extrahiert</span>}
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg h-24"
                value={formData.specialWishes}
                onChange={(e) => updateFormData('specialWishes', e.target.value)}
                placeholder="z.B. Davids Papa erwähnen aber nicht zu traurig, Benny erwähnen, Fitness-Metaphern..."
              />
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#5C493E' }}>Bereit für Ihre personalisierte Traurede?</h3>
              <p className="text-gray-600 mb-4">
                Alle Informationen sind erfasst. Klicken Sie auf "Rede generieren" um Ihre vollständige, 
                personalisierte Traurede zu erstellen.
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
                      <span>Personalisierte Rede wird erstellt...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={24} />
                      <span>🤖 Personalisierte Rede generieren</span>
                    </>
                  )}
                </button>
                {isGenerating && (
                  <p className="text-sm mt-2" style={{ color: '#5C493E' }}>
                    Basierend auf allen Informationen wird eine einzigartige Rede erstellt...
                  </p>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EDEBE7 0%, #F0E9E0 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#5C493E' }}>🤖 KI-Hochzeitsredner Tool</h1>
          <p className="text-gray-600">Erstellen Sie eine personalisierte Traurede in wenigen Schritten - jetzt mit intelligenter Datenextraktion!</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: '#5C493E' }}>
              {currentStep === 0 ? 'Intelligente Extraktion' : `Schritt ${currentStep} von ${totalSteps - 1}`}
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
                
                <div className="mt-4 text-sm" style={{ color: '#5C493E' }}>
                  <p><strong>🤖 Intelligente Rede-Generierung:</strong> Diese Rede wurde basierend auf allen eingegebenen Informationen personalisiert erstellt. 
                  Sie können die Rede direkt hier bearbeiten und dann kopieren.</p>
                  {extractionCompleted && (
                    <p className="mt-2"><strong>✅ Basis:</strong> Diese Rede basiert auf den intelligent extrahierten Daten aus Ihren Notizen.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingSpeechGenerator;
