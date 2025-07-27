const handleGenerateSpeech = async () => {
  setIsGenerating(true);
  
  try {
    const styleInstruction = formData.speechTone === 'individuell' && styleAnalysis 
      ? `\n\nWICHTIGER STIL-HINWEIS: Verwende genau diesen analysierten Stil und Ton:\n${styleAnalysis}\n\nSchreibe die neue Rede exakt in diesem Stil, aber mit völlig neuem Inhalt!`
      : `\n\nVerwende einen ${formData.speechTone}en Ton.`;

    const wordTarget = formData.speechLength === 'kurz' ? '3000-4000' : 
                      formData.speechLength === 'mittel' ? '5000-6000' : '7000-8000';
  
    const maxTokens = formData.speechLength === 'kurz' ? 10000 : 
                     formData.speechLength === 'mittel' ? 15000 : 20000;
  
    const prompt = `Du bist ein professioneller Hochzeitsredner mit 20 Jahren Erfahrung. Schreibe eine völlig neue, einzigartige und emotionale Traurede von ${wordTarget} Wörtern basierend auf den folgenden Informationen:

GRUNDDATEN:
- Brautpaar: ${formData.person1Name} (${formData.person1Gender}) und ${formData.person2Name} (${formData.person2Gender})
- Datum: ${formData.weddingDate}
- Ort: ${formData.weddingLocation}
- Trauredner/in: ${formData.officiantName}

FAMILIE:
- Eltern: ${formData.father1Name} & ${formData.mother1Name} (${formData.person1Name}), ${formData.father2Name} & ${formData.mother2Name} (${formData.person2Name})
- Kinder: ${formData.children}
- Fehlende Personen: ${formData.missingPersons}
- Trauzeugen: ${formData.witnesses}

KENNENLERNGESCHICHTE:
- Wie sie sich kennenlernten: ${formData.howMet}
- Erstes Treffen: ${formData.firstMeeting}
- Erster Eindruck: ${formData.firstImpression}
- Lustige Geschichten: ${formData.funnyStories}
- Der Moment der Gewissheit: ${formData.realizationMoment}

CHARAKTERE & LIEBE:
- ${formData.person1Name} über ${formData.person2Name}: ${formData.person1AboutPerson2}
- ${formData.person2Name} über ${formData.person1Name}: ${formData.person2AboutPerson1}
- Was ${formData.person1Name} an ${formData.person2Name} liebt: ${formData.person1Loves}
- Was ${formData.person2Name} an ${formData.person1Name} liebt: ${formData.person2Loves}
- Gemeinsame Interessen: ${formData.commonInterests}
- Insider-Witze: ${formData.insiderJokes}

DER ANTRAG:
- Ort: ${formData.proposalLocation}
- Ablauf: ${formData.proposalStory}
- Wer fragte wen: ${formData.whoProposed}
- Ring-Details: ${formData.ringDetails}

ALLTAG & BEWÄHRUNG:
- Tägliches Leben: ${formData.dailyLife}
- Schwierigste Krise: ${formData.biggestCrisis}
- ${formData.person1Name} ist dankbar für: ${formData.person1Grateful}
- ${formData.person2Name} ist dankbar für: ${formData.person2Grateful}

ZUKUNFT:
- Gemeinsame Ziele: ${formData.goals}
- Lieblingszitate: ${formData.quotes}
- Besondere Musik: ${formData.music}

BESONDERE WÜNSCHE:
${formData.specialWishes}

STIL:
- Gewünschte Länge: ${formData.speechLength} (${wordTarget} Wörter)${styleInstruction}

ANFORDERUNGEN:
1. Schreibe eine völlig neue, einzigartige Rede (keine Vorlage!)
2. Ziel: ${wordTarget} deutsche Wörter - schreibe vollständig bis zum natürlichen Ende
3. Emotionale Tiefe und persönliche Details
4. Professionelle Struktur mit fließenden Übergängen
5. Nutze alle gegebenen Informationen kreativ
6. Baue Spannung auf und schaffe emotionale Höhepunkte
7. Schließe mit einem kraftvollen Eheversprechen ab
8. Integriere alle Familienmitglieder und besonderen Personen
9. Schreibe auf Deutsch in professionellem Hochzeitsrede-Stil
10. ${formData.speechTone === 'individuell' ? 'Verwende exakt den analysierten Stil!' : `Verwende ${formData.speechTone}en Ton`}

Erstelle jetzt eine komplett neue, bewegende Traurede:`;

    if (!ANTHROPIC_API_KEY) {
      throw new Error('API-Key nicht konfiguriert. Bitte Environment Variable NEXT_PUBLIC_ANTHROPIC_API_KEY in Vercel setzen.');
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiGeneratedSpeech = data.content[0].text;
    
    setGeneratedSpeech(aiGeneratedSpeech);
    setShowSpeech(true);
    
  } catch (error) {
    console.error('Fehler bei der echten KI-Rede-Generierung:', error);
    
    if (error.message.includes('API Error: 401')) {
      alert('❌ API-Key ungültig. Bitte überprüfen Sie Ihren Anthropic API-Key.');
    } else if (error.message.includes('API Error: 429')) {
      alert('❌ Rate Limit erreicht. Bitte warten Sie einen Moment.');
    } else if (error.message.includes('API-Key nicht konfiguriert')) {
      alert('❌ API-Key nicht gefunden. Bitte setzen Sie NEXT_PUBLIC_ANTHROPIC_API_KEY in Vercel Environment Variables.');
    } else {
      alert(`❌ Rede-Generierung fehlgeschlagen: ${error.message}`);
    }
    
    // Fallback zu Demo-Rede NUR bei echten Fehlern
    console.log('Fallback zu Demo-Rede...');
    const fallbackSpeech = `# Traurede für ${formData.person1Name} & ${formData.person2Name}

*${new Date(formData.weddingDate || '2024-09-14').toLocaleDateString('de-DE')} • ${formData.weddingLocation}*

---

## Liebe Gäste, liebe Familie, liebe Freunde,

ich begrüße Sie alle herzlich zu diesem außergewöhnlichen Tag! Mein Name ist ${formData.officiantName}, und es ist mir eine große Ehre, heute ${formData.person1Name} und ${formData.person2Name} zu trauen.

## Ihre besondere Geschichte

${formData.howMet || 'Die beiden haben sich auf eine ganz besondere Weise kennengelernt.'}

${formData.firstMeeting || 'Ihr erstes Treffen war der Beginn einer wunderbaren Liebesgeschichte.'}

${formData.funnyStories || 'Es gab viele lustige und unvergessliche Momente, die ihre Verbindung stärkten.'}

## Das Eheversprechen

${formData.person1Name}, versprechen Sie, ${formData.person2Name} zu lieben, zu ehren und zu respektieren, in guten wie in schweren Zeiten?
*"Ja, ich will!"*

${formData.person2Name}, versprechen Sie, ${formData.person1Name} zu lieben, zu ehren und zu respektieren, in guten wie in schweren Zeiten?
*"Ja, ich will!"*

Mit der Kraft, die mir übertragen wurde, erkläre ich Sie hiermit zu Mann und Frau!

Sie dürfen sich küssen!

---

*⚠️ FALLBACK-VERSION: Echte KI-Rede verfügbar mit korrektem API-Key.*`;

    setGeneratedSpeech(fallbackSpeech);
    setShowSpeech(true);
  }
  
  setIsGenerating(false);
};
