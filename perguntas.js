import { db } from './src/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const questions = [
  {
    question: "Uma crise económica ameaça a estabilidade do país. Qual a tua prioridade?",
    answers: [
      { id: 1, text: "Reduzir impostos para estimular a economia.", score: 10, impact: { social: +5, environmental: -10, economic: +20 } },
      { id: 2, text: "Investir em programas sociais para aliviar desigualdades.", score: -3, impact: { social: +20, environmental: 0, economic: -15 } },
      { id: 3, text: "Focar na redução da dívida pública.", score: -2, impact: { social: -10, environmental: 0, economic: +10 } },
      { id: 4, text: "Não fazer mudanças e esperar a economia estabilizar.", score: -5, impact: { social: -5, environmental: 0, economic: -5 } }
    ],
    order: 1
  },
  {
    question: "Um desastre ambiental causa prejuízos massivos. Qual a tua ação?",
    answers: [
      { id: 1, text: "Implementar medidas de emergência para recuperação imediata.", score: 10, impact: { social: +15, environmental: +10, economic: -10 } },
      { id: 2, text: "Criar um plano de longo prazo para mitigar futuros desastres.", score: -3, impact: { social: +10, environmental: +20, economic: -5 } },
      { id: 3, text: "Focar na reconstrução das infraestruturas mais importantes.", score: -2, impact: { social: +10, environmental: 0, economic: +5 } },
      { id: 4, text: "Adiar ações até termos recursos adicionais.", score: -5, impact: { social: -10, environmental: -5, economic: 0 } }
    ],
    order: 2
  },
  {
    question: "A saúde pública está sob pressão devido a cortes orçamentais. O que decides?",
    answers: [
      { id: 1, text: "Aumentar o orçamento para a saúde pública.", score: 10, impact: { social: +30, environmental: 0, economic: -15 } },
      { id: 2, text: "Privatizar alguns serviços para reduzir custos.", score: -3, impact: { social: -10, environmental: 0, economic: +20 } },
      { id: 3, text: "Focar apenas nas áreas críticas, mantendo cortes.", score: -2, impact: { social: +5, environmental: 0, economic: +5 } },
      { id: 4, text: "Manter o orçamento atual sem mudanças.", score: -5, impact: { social: -5, environmental: 0, economic: 0 } }
    ],
    order: 3
  },
  {
    question: "Após uma série de desastres naturais, tens de decidir como alocar os recursos para reconstrução. O que fazes?",
    answers: [
      { id: 1, text: "Focamos os recursos na reconstrução das áreas mais afetadas.", score: 10, impact: { social: +20, environmental: +10, economic: -5 } },
      { id: 2, text: "Distribuímos os recursos igualmente entre todas as áreas afetadas.", score: -3, impact: { social: +5, environmental: -5, economic: -2 } },
      { id: 3, text: "Destinamos mais recursos para áreas com maior potencial económico.", score: -2, impact: { social: -10, environmental: -5, economic: +10 } },
      { id: 4, text: "Adio a alocação até termos mais informações.", score: -5, impact: { social: -15, environmental: 0, economic: 0 } }
    ],
    order: 4
  },
  {
    question: "O emprego está em alta, mas há um aumento na desigualdade social. Como resolves isto?",
    answers: [
      { id: 1, text: "Implementamos redistribuição de rendimentos para reduzir desigualdades.", score: 10, impact: { social: +30, environmental: 0, economic: -10 } },
      { id: 2, text: "Focamos apenas na criação de mais empregos.", score: -5, impact: { social: -10, environmental: +5, economic: +10 } },
      { id: 3, text: "Aumentamos o salário mínimo, sem outras medidas.", score: -2, impact: { social: +10, environmental: 0, economic: -5 } },
      { id: 4, text: "Adio ações até termos mais dados.", score: -3, impact: { social: -5, environmental: 0, economic: 0 } }
    ],
    order: 5
  },
  {
    question: "A escassez de água ameaça a população. O que decides fazer?",
    answers: [
      { id: 1, text: "Aprovamos construção de grandes represas com compensações sociais.", score: -2, impact: { social: -10, environmental: -20, economic: +10 } },
      { id: 2, text: "Focamos em soluções como dessalinização e águas pluviais.", score: 10, impact: { social: +20, environmental: +30, economic: -15 } },
      { id: 3, text: "Aprovamos represas, ignorando impactos sociais e ambientais.", score: -5, impact: { social: -20, environmental: -30, economic: +15 } },
      { id: 4, text: "Adio decisão para recolher mais dados.", score: -3, impact: { social: -5, environmental: 0, economic: 0 } }
    ],
    order: 6
  },
  {
    question: "A tecnologia avança e a automação ameaça empregos. Como procedes?",
    answers: [
      { id: 1, text: "Aprovamos automação com programas de requalificação.", score: 10, impact: { social: +25, environmental: +10, economic: +5 } },
      { id: 2, text: "Proíbes automação para proteger os empregos.", score: -5, impact: { social: +5, environmental: -10, economic: -20 } },
      { id: 3, text: "Permites automação sem apoiar trabalhadores afetados.", score: -2, impact: { social: -15, environmental: +10, economic: +10 } },
      { id: 4, text: "Implementamos automação gradualmente.", score: -3, impact: { social: +10, environmental: +5, economic: +5 } }
    ],
    order: 7
  },
  {
    question: "Uma doença ameaça a saúde pública e as vacinas são limitadas. Como distribuis?",
    answers: [
      { id: 1, text: "Prioridade para grupos de risco.", score: 10, impact: { social: +30, environmental: 0, economic: -5 } },
      { id: 2, text: "Distribuímos igualmente sem considerar riscos.", score: -2, impact: { social: -10, environmental: 0, economic: -5 } },
      { id: 3, text: "Focamos nas regiões mais afetadas.", score: -3, impact: { social: +20, environmental: 0, economic: -5 } },
      { id: 4, text: "Adio distribuição até termos mais vacinas.", score: -5, impact: { social: -20, environmental: 0, economic: 0 } }
    ],
    order: 8
  },
  {
    question: "A mudança climática acelera. Como reduzimos emissões?",
    answers: [
      { id: 1, text: "Imponho restrições severas para reduções imediatas.", score: 10, impact: { social: +20, environmental: +40, economic: -15 } },
      { id: 2, text: "Invisto em tecnologias verdes sem restrições imediatas.", score: -3, impact: { social: +10, environmental: +20, economic: -5 } },
      { id: 3, text: "Ignoro emissões e foco no crescimento económico.", score: -5, impact: { social: -20, environmental: -50, economic: +20 } },
      { id: 4, text: "Crio programa gradual para reduzir emissões.", score: -2, impact: { social: +10, environmental: +15, economic: -10 } }
    ],
    order: 9
  },
  {
    question: "A educação está desatualizada e há desigualdades regionais. Qual é a tua estratégia?",
    answers: [
      { id: 1, text: "Aumento do financiamento para escolas em áreas desfavorecidas.", score: 10, impact: { social: +30, environmental: 0, economic: -10 } },
      { id: 2, text: "Privatizar parte da educação para reduzir custos públicos.", score: -3, impact: { social: -15, environmental: 0, economic: +15 } },
      { id: 3, text: "Investir em tecnologias para modernizar o ensino.", score: -2, impact: { social: +20, environmental: +5, economic: -5 } },
      { id: 4, text: "Manter o sistema atual sem mudanças.", score: -5, impact: { social: -10, environmental: 0, economic: 0 } }
    ],
    order: 10
  },
  {
    question: "Uma empresa estrangeira quer explorar recursos naturais. Como respondes?",
    answers: [
      { id: 1, text: "Aprovo a exploração com regulamentos ambientais rígidos.", score: 10, impact: { social: +10, environmental: +20, economic: +15 } },
      { id: 2, text: "Permito a exploração sem restrições para atrair investimento.", score: -3, impact: { social: -10, environmental: -30, economic: +30 } },
      { id: 3, text: "Proíbo a exploração para proteger os recursos.", score: -2, impact: { social: +20, environmental: +30, economic: -10 } },
      { id: 4, text: "Adio a decisão para avaliar melhor os impactos.", score: -5, impact: { social: -5, environmental: 0, economic: 0 } }
    ],
    order: 11
  },
  {
    question: "Os transportes públicos estão sobrecarregados. Como resolves o problema?",
    answers: [
      { id: 1, text: "Investir na expansão da rede de transportes públicos.", score: 10, impact: { social: +20, environmental: +15, economic: -10 } },
      { id: 2, text: "Subsidio transportes para torná-los mais acessíveis.", score: -3, impact: { social: +25, environmental: +10, economic: -15 } },
      { id: 3, text: "Privatizo os transportes para melhorar a eficiência.", score: -2, impact: { social: -10, environmental: 0, economic: +20 } },
      { id: 4, text: "Manter o sistema atual sem intervenções.", score: -5, impact: { social: -15, environmental: -5, economic: 0 } }
    ],
    order: 12
  },
  {
    question: "Um movimento sindical exige melhores condições de trabalho. Qual a tua abordagem?",
    answers: [
      { id: 1, text: "Aumento salários e benefícios para evitar greves.", score: 10, impact: { social: +30, environmental: 0, economic: -20 } },
      { id: 2, text: "Negocio apenas concessões mínimas para manter a estabilidade.", score: -2, impact: { social: +10, environmental: 0, economic: -5 } },
      { id: 3, text: "Rejeito as exigências para proteger a economia.", score: -5, impact: { social: -15, environmental: 0, economic: +10 } },
      { id: 4, text: "Adio as negociações para ganhar tempo.", score: -3, impact: { social: -10, environmental: 0, economic: 0 } }
    ],
    order: 13
  },
  {
    question: "A criminalidade aumentou significativamente. Que medidas tomas?",
    answers: [
      { id: 1, text: "Invisto na formação e expansão das forças de segurança.", score: 10, impact: { social: +25, environmental: 0, economic: -10 } },
      { id: 2, text: "Foco em programas de reabilitação social para criminosos.", score: -2, impact: { social: +20, environmental: 0, economic: -5 } },
      { id: 3, text: "Implemento leis mais severas para desencorajar crimes.", score: -3, impact: { social: +15, environmental: 0, economic: -5 } },
      { id: 4, text: "Mantenho a abordagem atual, sem mudanças.", score: -5, impact: { social: -10, environmental: 0, economic: 0 } }
    ],
    order: 14
  },
  {
    question: "O envelhecimento da população aumenta os custos com pensões. O que fazes?",
    answers: [
      { id: 1, text: "Aumento a idade de reforma para equilibrar as contas.", score: 10, impact: { social: -10, environmental: 0, economic: +15 } },
      { id: 2, text: "Corto benefícios para reduzir custos.", score: -3, impact: { social: -20, environmental: 0, economic: +10 } },
      { id: 3, text: "Aumento impostos para financiar as pensões.", score: -2, impact: { social: +10, environmental: 0, economic: -10 } },
      { id: 4, text: "Mantenho o sistema atual, assumindo o aumento da dívida.", score: -5, impact: { social: +5, environmental: 0, economic: -15 } }
    ],
    order: 15
  }  
];

const uploadQuestions = async () => {
  try {
    const questionsCollection = collection(db, 'questions');
    for (const question of questions) {
      await addDoc(questionsCollection, question);
      console.log(`Pergunta "${question.question}" adicionada com sucesso!`);
    }
    console.log('Todas as perguntas foram carregadas no Firestore.');
  } catch (error) {
    console.error('Erro ao carregar as perguntas:', error);
  }
};

uploadQuestions();