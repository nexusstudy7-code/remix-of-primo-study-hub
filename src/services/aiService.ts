import { supabase } from "@/integrations/supabase/client";

// --- Types ---

export interface AIResponse<T> {
  data: T | null;
  error: string | null;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface EssayFeedback {
  score: number;
  competencias: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
  };
  feedback: string;
  melhorias: string[];
}

export interface StudyTask {
  subject: string;
  topic: string;
  date: string;
  duration_minutes: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Helper Functions ---

const parseJSON = (text: string): any => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

// --- Functions ---

export const generateFlashcards = async (topic: string, count: number = 5): Promise<AIResponse<Flashcard[]>> => {
  try {
    const prompt = `
      Crie ${count} flashcards sobre "${topic}".
      Responda APENAS um JSON Array válido: [{"front": "Pergunta", "back": "Resposta"}]
    `;

    const { data, error } = await supabase.functions.invoke('generate-question', {
      body: { type: 'flashcards', prompt }
    });

    if (error) throw new Error(error.message);

    const result = data?.result;
    if (!Array.isArray(result)) throw new Error("Formato inválido");

    return { data: result, error: null };
  } catch (e: any) {
    console.error("Erro ao gerar flashcards:", e);
    return { data: null, error: e.message || "Erro ao gerar flashcards" };
  }
};

export const sendMessageToChat = async (message: string, history: ChatMessage[] = []): Promise<string> => {
  try {
    const prompt = `Você é um tutor de estudos amigável. Responda a: ${message}`;

    const { data, error } = await supabase.functions.invoke('generate-question', {
      body: { type: 'chat', prompt }
    });

    if (error) throw new Error(error.message);

    return data?.result || "Desculpe, não consegui processar sua mensagem.";
  } catch (e) {
    console.error("Chat error", e);
    return "Desculpe, não consegui processar sua mensagem agora.";
  }
};

export const answerQuestion = async (
  question: string,
  context?: string,
  history?: ChatMessage[]
): Promise<AIResponse<string>> => {
  try {
    const response = await sendMessageToChat(question, history || []);
    return { data: response, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
};

export const correctEssay = async (text: string, theme: string = "Tema Livre"): Promise<AIResponse<EssayFeedback>> => {
  try {
    const CRITERIOS_ENEM = `
      Competência 1 (C1): Domínio da norma-padrão da língua portuguesa.
      Competência 2 (C2): Compreensão do tema e uso do repertório sociocultural.
      Competência 3 (C3): Seleção e organização de argumentos.
      Competência 4 (C4): Uso de mecanismos linguísticos de coesão.
      Competência 5 (C5): Proposta de intervenção detalhada e respeitosa aos direitos humanos.
    `;

    const prompt = `
      Atue como um CORRETOR OFICIAL DO ENEM (INEP).
      Sua tarefa é corrigir a redação abaixo com rigor técnico, mas com OLHAR PEDAGÓGICO.

      TEMA DA REDAÇÃO: "${theme}"
      TEXTO DO ALUNO: "${text}"

      DIRETRIZES DE CORREÇÃO:
      ${CRITERIOS_ENEM}

      ATENÇÃO AOS NÍVEIS DE EXCELÊNCIA:
      - Se a redação apresentar estrutura sólida, repertório produtivo e proposta completa, atribua nota 200 nas competências.
      - Seja flexível com o estilo de escrita. Foca na clareza e na defesa do ponto de vista.

      ANÁLISE OBRIGATÓRIA:
      1. Identifique se há Repertório Sociocultural (livros, filósofos) e se é produtivo.
      2. Verifique se a Proposta de Intervenção tem os 5 elementos.
      3. Analise o uso de conectivos (Coesão).

      RETORNE APENAS JSON NESTE FORMATO (SEM MARKDOWN/SEM BLOCOS DE CÓDIGO):
      {
        "score": number,
        "competencias": { "c1": number, "c2": number, "c3": number, "c4": number, "c5": number },
        "feedback": "Texto corrido explicando os erros e acertos.",
        "melhorias": ["Sugestão 1", "Sugestão 2", "Sugestão 3"]
      }
    `;

    const { data, error } = await supabase.functions.invoke('generate-question', {
      body: { type: 'essay', prompt }
    });

    if (error) throw new Error(error.message);

    const result = data?.result;
    if (!result || typeof result.score !== 'number') throw new Error("Resposta inválida da IA");

    return { data: result, error: null };
  } catch (e: any) {
    console.error("Erro na correção:", e);
    return { data: null, error: e.message };
  }
};

export const createStudyPlan = async (
  hoursPerDay: number,
  university: string,
  course: string,
  difficulties: string[],
  daysCount: number = 7
): Promise<AIResponse<StudyTask[]>> => {
  try {
    const todayStr = new Date().toLocaleDateString("pt-BR");

    const difficultyStr = Array.isArray(difficulties) 
      ? difficulties.map(d => `- ${d}`).join("\n")
      : Object.entries(difficulties).map(([area, level]) => `- ${area}: ${level}`).join("\n");

    const prompt = `
      Atue como um ESTRATEGISTA DO ENEM e SISU.
      Gere um cronograma de ${daysCount} dias começando em ${todayStr}.
      
      ALUNO:
      - Curso Desejado: ${course}
      - Faculdade: ${university}
      - Disponibilidade: ${hoursPerDay}h/dia
      
      DIFICULDADE POR ÁREA DO CONHECIMENTO:
      ${difficultyStr}

      REGRAS DE PESOS E PRIORIDADE (ALGORITMO SISU):
      1. Identifique os pesos do SISU para ${course} na ${university}.
      2. Áreas com maior dificuldade = Mais tempo (90-120min).
      3. Áreas fáceis = Revisão rápida (45-60min).

      CONTEÚDO:
      - Utilize APENAS os tópicos que MAIS CAÍRAM no ENEM nos últimos 5 anos.
      - Distribua as tarefas sequencialmente a partir de hoje.

      RESPOSTA ESPERADA (JSON PURO, SEM MARKDOWN):
      [
        {
          "subject": "Matéria (Ex: Física)",
          "topic": "[Natureza] Nome do Tópico", 
          "duration_minutes": 90,
          "date": "YYYY-MM-DD"
        }
      ]
    `;

    const { data, error } = await supabase.functions.invoke('generate-question', {
      body: { type: 'studyPlan', prompt }
    });

    if (error) throw new Error(error.message);

    const result = data?.result;
    if (!Array.isArray(result)) throw new Error("Formato inválido");

    return { data: result, error: null };
  } catch (e: any) {
    console.error("Erro ao criar plano:", e);
    return { data: null, error: e.message };
  }
};
