import { db } from './src/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const questions = [
  {
    pergunta: "O primeiro grande dilema que enfrentas é a crise energética global. O uso de fontes de energia limpa está em alta, mas o custo é muito mais alto do que as fontes tradicionais. O que fazes?",
    respostas: [
      { id: 1, texto: "Aprovamos o investimento em energia limpa, mesmo que seja mais caro.", pontuacao: 10 },
      { id: 2, texto: "Negamos o investimento por ser economicamente inviável.", pontuacao: -5 },
      { id: 3, texto: "Proponho uma redução noutras áreas, como a saúde, para financiar o projeto.", pontuacao: -3 },
      { id: 4, texto: "Adiaremos a decisão para o próximo ano, esperando mais dados.", pontuacao: -2 }
    ],
    ordem: 1
  },
  {
    pergunta: "A economia global está em colapso após a crise energética. O que decides fazer para salvar a economia?",
    respostas: [
      { id: 1, texto: "Cortamos drasticamente os subsídios para grandes corporações.", pontuacao: 10 },
      { id: 2, texto: "Aprovamos um plano de austeridade que afeta os mais pobres.", pontuacao: -3 },
      { id: 3, texto: "Investimos pesadamente em pequenas empresas para gerar empregos.", pontuacao: -2 },
      { id: 4, texto: "Fazemos mais pesquisas antes de tomar qualquer ação.", pontuacao: -5 }
    ],
    ordem: 2
  },
  {
    pergunta: "Uma indústria quer abrir uma fábrica numa área protegida, prometendo criar empregos, mas com impacto ambiental. O que fazes?",
    respostas: [
      { id: 1, texto: "Recusamos o projeto para proteger o meio ambiente.", pontuacao: 10 },
      { id: 2, texto: "Permitimos a fábrica com certas condições ambientais.", pontuacao: -2 },
      { id: 3, texto: "Aprovamos a fábrica, priorizando os empregos.", pontuacao: -5 },
      { id: 4, texto: "Adio a decisão até realizar mais estudos.", pontuacao: -3 }
    ],
    ordem: 3
  },
  {
    pergunta: "Após uma série de desastres naturais, tens de decidir como alocar os recursos para reconstrução. O que fazes?",
    respostas: [
      { id: 1, texto: "Focamos os recursos na reconstrução das áreas mais afetadas.", pontuacao: 10 },
      { id: 2, texto: "Distribuímos os recursos igualmente entre todas as áreas afetadas.", pontuacao: -3 },
      { id: 3, texto: "Destinamos mais recursos para as áreas com maior potencial económico.", pontuacao: -2 },
      { id: 4, texto: "Adio a alocação dos recursos até termos mais informações.", pontuacao: -5 }
    ],
    ordem: 4
  },
  {
    pergunta: "O emprego está em alta, mas há um aumento significativo na desigualdade social. Como lidas com isso?",
    respostas: [
      { id: 1, texto: "Implementamos um sistema de redistribuição de renda para reduzir a desigualdade.", pontuacao: 10 },
      { id: 2, texto: "Focamos apenas na criação de mais empregos, sem mexer na desigualdade.", pontuacao: -5 },
      { id: 3, texto: "Aumentamos o salário mínimo, mas não há outras medidas.", pontuacao: -2 },
      { id: 4, texto: "Postergamos as ações até termos mais tempo para estudar o impacto.", pontuacao: -3 }
    ],
    ordem: 5
  },
  {
    pergunta: "A escassez de água ameaça uma grande parte da população. Uma solução envolve grandes represas, mas isso pode prejudicar comunidades locais. O que fazes?",
    respostas: [
      { id: 1, texto: "Aprovamos a construção das represas, com compensações para as comunidades afetadas.", pontuacao: -2 },
      { id: 2, texto: "Focamos em soluções alternativas, como dessalinização e recuperação de águas pluviais.", pontuacao: 10 },
      { id: 3, texto: "Aprovamos as represas, ignorando as consequências sociais e ambientais.", pontuacao: -5 },
      { id: 4, texto: "Adio a decisão até ter mais dados sobre a viabilidade.", pontuacao: -3 }
    ],
    ordem: 6
  },
  {
    pergunta: "A indústria de tecnologia quer automatizar muitos empregos, mas isso pode gerar desemprego em massa. O que fazes?",
    respostas: [
      { id: 1, texto: "Aprovamos a automação, mas com programas de requalificação para os trabalhadores afetados.", pontuacao: 10 },
      { id: 2, texto: "Proíbes a automação em larga escala para proteger os empregos.", pontuacao: -5 },
      { id: 3, texto: "Aprovamos a automação, sem oferecer soluções para os afetados.", pontuacao: -2 },
      { id: 4, texto: "Focamos numa abordagem gradual para implementar a automação.", pontuacao: -3 }
    ],
    ordem: 7
  },
  {
    pergunta: "A saúde pública está em risco devido a uma nova doença, e a distribuição de vacinas é limitada. Como distribuis as vacinas?",
    respostas: [
      { id: 1, texto: "Distribuímos as vacinas com prioridade para os grupos de risco.", pontuacao: 10 },
      { id: 2, texto: "Distribuímos igualmente para todos, sem considerar o risco.", pontuacao: -2 },
      { id: 3, texto: "Focamos nas regiões mais afetadas pela doença.", pontuacao: -3 },
      { id: 4, texto: "Adio a distribuição até termos mais vacinas disponíveis.", pontuacao: -5 }
    ],
    ordem: 8
  },
  {
    pergunta: "A mudança climática continua a avançar rapidamente. Como lideras a redução das emissões de carbono?",
    respostas: [
      { id: 1, texto: "Impondo restrições severas para reduzir as emissões de carbono a curto prazo.", pontuacao: 10 },
      { id: 2, texto: "Investimos em tecnologias verdes sem impor restrições imediatas.", pontuacao: -3 },
      { id: 3, texto: "Ignoramos as emissões e focamos em acelerar o crescimento económico.", pontuacao: -5 },
      { id: 4, texto: "Criamos um programa gradual para reduzir as emissões ao longo do tempo.", pontuacao: -2 }
    ],
    ordem: 9
  },
  {
    pergunta: "O número de refugiados devido a conflitos e desastres aumentou. Como lidas com esta crise humanitária?",
    respostas: [
      { id: 1, texto: "Apoiamos um programa de acolhimento e integração de refugiados.", pontuacao: 10 },
      { id: 2, texto: "Restringimos a entrada de refugiados para proteger os nossos próprios cidadãos.", pontuacao: -5 },
      { id: 3, texto: "Focamos em fornecer ajuda humanitária sem aceitar refugiados.", pontuacao: -3 },
      { id: 4, texto: "Proponho uma abordagem internacional de redistribuição de refugiados entre países.", pontuacao: -2 }
    ],
    ordem: 10
  },
  {
    pergunta: "O mundo está a assistir ao aumento da polarização política. Como lideras uma sociedade cada vez mais dividida?",
    respostas: [
      { id: 1, texto: "Buscamos unir a sociedade em torno de um projeto comum de sustentabilidade.", pontuacao: 10 },
      { id: 2, texto: "Focamos em promover políticas que favoreçam um grupo específico para restaurar a ordem.", pontuacao: -5 },
      { id: 3, texto: "Tentamos mediar o conflito entre os diferentes grupos de forma equilibrada.", pontuacao: -2 },
      { id: 4, texto: "Focamos em reforçar o poder do nosso governo e manter o controlo.", pontuacao: -3 }
    ],
    ordem: 11
  },
  {
    pergunta: "A educação global está em declínio devido a cortes no orçamento. Como respondes a isso?",
    respostas: [
      { id: 1, texto: "Investimos pesadamente na educação para garantir um futuro melhor.", pontuacao: 10 },
      { id: 2, texto: "Cortamos ainda mais no orçamento, priorizando outras áreas.", pontuacao: -5 },
      { id: 3, texto: "Oferecemos soluções de ensino à distância e privada, mas limitadas.", pontuacao: -2 },
      { id: 4, texto: "Adio o aumento de orçamento até a economia se recuperar.", pontuacao: -3 }
    ],
    ordem: 12
  },
  {
    pergunta: "Recebes um relatório sobre as mudanças na biodiversidade. A perda de espécies pode afetar o ecossistema global. O que fazes?",
    respostas: [
      { id: 1, texto: "Apoiamos a preservação de habitats naturais para proteger a biodiversidade.", pontuacao: 10 },
      { id: 2, texto: "Aumentamos a exploração de recursos naturais para sustentar a economia.", pontuacao: -5 },
      { id: 3, texto: "Investimos em projetos de reintrodução de espécies ameaçadas.", pontuacao: -2 },
      { id: 4, texto: "Proponho uma análise mais aprofundada antes de agir.", pontuacao: -3 }
    ],
    ordem: 13
  },
  {
    pergunta: "O sistema de transporte global precisa de uma modernização urgente. Como financias essa mudança?",
    respostas: [
      { id: 1, texto: "Investimos em transporte público sustentável e de baixo carbono.", pontuacao: 10 },
      { id: 2, texto: "Aumentamos os impostos para financiar a modernização do transporte.", pontuacao: -2 },
      { id: 3, texto: "Privatizamos o transporte, esperando que as empresas tomem as decisões necessárias.", pontuacao: -3 },
      { id: 4, texto: "Apostamos em soluções de curto prazo, como melhoria de estradas existentes.", pontuacao: -5 }
    ],
    ordem: 14
  },
  {
    pergunta: "O acesso à internet foi ampliado globalmente, mas há preocupações com a privacidade e a censura. Como respondes a isso?",
    respostas: [
      { id: 1, texto: "Implementamos regras para combater a desinformação e promover a educação digital.", pontuacao: 10 },
      { id: 2, texto: "Ignoramos a desinformação, focando apenas no crescimento digital.", pontuacao: -5 },
      { id: 3, texto: "Apoiamos a criação de plataformas que regulamentam e controlam as informações.", pontuacao: -2 },
      { id: 4, texto: "Fazemos um esforço conjunto internacional para combater a desinformação.", pontuacao: -3 }
    ],
    ordem: 15
  }
];

const uploadQuestions = async () => {
  try {
    const questionsCollection = collection(db, 'questions');
    for (const pergunta of questions) {
      await addDoc(questionsCollection, pergunta);
      console.log(`Pergunta "${pergunta.pergunta}" adicionada com sucesso!`);
    }
    console.log('Todas as perguntas foram carregadas no Firestore.');
  } catch (error) {
    console.error('Erro ao carregar as perguntas:', error);
  }
};

uploadQuestions();