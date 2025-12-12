export interface Activity {
  id: string;
  type: 'textarea' | 'slider' | 'table' | 'checkbox' | 'text';
  title?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  columns?: string[];
  options?: string[];
  min?: number;
  max?: number;
}

export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  quote?: {
    text: string;
    author: string;
  };
  sections: {
    title: string;
    description?: string;
    activities: Activity[];
  }[];
}

export const workbookModules: ModuleData[] = [
  {
    id: 1,
    title: "O Ponto de Partida",
    subtitle: "Compreendendo onde você está agora",
    quote: {
      text: "A jornada de mil milhas começa com um único passo.",
      author: "Lao Tsé"
    },
    sections: [
      {
        title: "Declaração de Intenção",
        description: "Qual é o seu maior objetivo ao participar desta jornada? O que você deseja transformar em sua vida profissional?",
        activities: [
          {
            id: "intencao",
            type: "textarea",
            placeholder: "Escreva aqui sua declaração de intenção...",
            rows: 5
          }
        ]
      },
      {
        title: "Avaliação do Momento Atual",
        description: "Em uma escala de 1 a 10, como você avalia cada área da sua vida profissional?",
        activities: [
          { id: "satisfacao_carreira", type: "slider", title: "Satisfação com a carreira", min: 1, max: 10 },
          { id: "clareza_proposito", type: "slider", title: "Clareza de propósito", min: 1, max: 10 },
          { id: "networking", type: "slider", title: "Qualidade do networking", min: 1, max: 10 },
          { id: "posicionamento", type: "slider", title: "Posicionamento de marca pessoal", min: 1, max: 10 },
          { id: "confianca", type: "slider", title: "Confiança profissional", min: 1, max: 10 }
        ]
      },
      {
        title: "Principais Desafios",
        description: "Quais são os 3 maiores desafios que você enfrenta hoje em sua carreira ou negócio?",
        activities: [
          {
            id: "desafios",
            type: "textarea",
            placeholder: "1. \n2. \n3. ",
            rows: 6
          }
        ]
      },
      {
        title: "Seu Porquê",
        description: "Por que você faz o que faz? O que te move todos os dias?",
        activities: [
          {
            id: "porque",
            type: "textarea",
            placeholder: "Reflita sobre seu propósito...",
            rows: 5
          }
        ]
      },
      {
        title: "Visão de Futuro",
        description: "Daqui a 1 ano, como você imagina sua vida profissional?",
        activities: [
          {
            id: "visao_1ano",
            type: "textarea",
            placeholder: "Descreva sua visão para daqui a 1 ano...",
            rows: 4
          },
          {
            id: "visao_3anos",
            type: "textarea",
            title: "E daqui a 3 anos?",
            placeholder: "Descreva sua visão para daqui a 3 anos...",
            rows: 4
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Posicionamento",
    subtitle: "Descobrindo e comunicando seu valor único",
    quote: {
      text: "Não tenha medo de brilhar. Você não nasceu para ser pequena.",
      author: "Marianne Williamson"
    },
    sections: [
      {
        title: "Seus Talentos Naturais",
        description: "O que você faz com facilidade que os outros acham difícil? Quais elogios você recebe frequentemente?",
        activities: [
          {
            id: "talentos",
            type: "textarea",
            placeholder: "Liste seus talentos naturais...",
            rows: 5
          }
        ]
      },
      {
        title: "Habilidades-Chave",
        description: "Quais são as principais habilidades que você desenvolveu ao longo da sua carreira?",
        activities: [
          {
            id: "habilidades",
            type: "textarea",
            placeholder: "Liste suas habilidades desenvolvidas...",
            rows: 5
          }
        ]
      },
      {
        title: "Seu Talento Único",
        description: "Se você pudesse resumir em uma frase o que faz de você única no mercado, o que seria?",
        activities: [
          {
            id: "talento_unico",
            type: "textarea",
            placeholder: "Eu sou a pessoa que...",
            rows: 3
          }
        ]
      },
      {
        title: "Bloqueios e Crenças Limitantes",
        description: "Quais pensamentos ou crenças te impedem de se posicionar com confiança?",
        activities: [
          {
            id: "bloqueios",
            type: "table",
            columns: ["Crença Limitante", "Nova Afirmação Fortalecedora"]
          }
        ]
      },
      {
        title: "Declaração de Posicionamento",
        description: "Complete: 'Eu ajudo [público-alvo] a [transformação] através de [método/abordagem única].'",
        activities: [
          {
            id: "posicionamento",
            type: "textarea",
            placeholder: "Eu ajudo...",
            rows: 4
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Branding Pessoal",
    subtitle: "Construindo sua marca com autenticidade",
    quote: {
      text: "Sua marca pessoal é o que as pessoas dizem sobre você quando você não está na sala.",
      author: "Jeff Bezos"
    },
    sections: [
      {
        title: "Valores Inegociáveis",
        description: "Quais são os 5 valores que guiam suas decisões e comportamentos?",
        activities: [
          {
            id: "valores",
            type: "textarea",
            placeholder: "1. \n2. \n3. \n4. \n5. ",
            rows: 6
          }
        ]
      },
      {
        title: "3 Palavras-Chave",
        description: "Se sua marca pessoal pudesse ser resumida em 3 palavras, quais seriam?",
        activities: [
          {
            id: "palavras_chave",
            type: "textarea",
            placeholder: "1. \n2. \n3. ",
            rows: 4
          }
        ]
      },
      {
        title: "Cliente Ideal / Persona",
        description: "Descreva detalhadamente quem é a pessoa que você mais deseja servir.",
        activities: [
          {
            id: "persona_demografico",
            type: "textarea",
            title: "Dados demográficos (idade, gênero, localização, profissão)",
            placeholder: "Descreva os dados demográficos...",
            rows: 3
          },
          {
            id: "persona_dores",
            type: "textarea",
            title: "Principais dores e frustrações",
            placeholder: "Quais são as maiores dores dessa pessoa?",
            rows: 3
          },
          {
            id: "persona_desejos",
            type: "textarea",
            title: "Desejos e aspirações",
            placeholder: "O que essa pessoa mais deseja alcançar?",
            rows: 3
          },
          {
            id: "persona_objecoes",
            type: "textarea",
            title: "Objeções comuns",
            placeholder: "Quais objeções essa pessoa costuma ter?",
            rows: 3
          }
        ]
      },
      {
        title: "Proposta Única de Valor",
        description: "O que faz seu trabalho/negócio diferente e melhor que as alternativas?",
        activities: [
          {
            id: "proposta_valor",
            type: "textarea",
            placeholder: "Minha proposta única de valor é...",
            rows: 5
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Instagram & Conteúdo",
    subtitle: "Estratégias para uma presença digital autêntica",
    quote: {
      text: "Conteúdo é rei, mas comunidade é rainha, e ela manda na casa.",
      author: "Mari Smith"
    },
    sections: [
      {
        title: "Pilares de Conteúdo",
        description: "Defina 3-5 temas principais que você vai abordar no seu Instagram.",
        activities: [
          {
            id: "pilares",
            type: "textarea",
            placeholder: "1. \n2. \n3. \n4. \n5. ",
            rows: 6
          }
        ]
      },
      {
        title: "Estrutura de Legenda",
        description: "Crie um template de legenda que você possa adaptar para seus posts.",
        activities: [
          {
            id: "template_legenda",
            type: "textarea",
            placeholder: "GANCHO (primeira linha chamativa)\n\nDESENVOLVIMENTO (conteúdo principal)\n\nCTA (chamada para ação)",
            rows: 8
          }
        ]
      },
      {
        title: "5 CTAs para seu Negócio",
        description: "Crie 5 chamadas para ação que você pode usar repetidamente nos seus conteúdos.",
        activities: [
          {
            id: "ctas",
            type: "textarea",
            placeholder: "1. \n2. \n3. \n4. \n5. ",
            rows: 6
          }
        ]
      },
      {
        title: "Planejamento Semanal de Conteúdo",
        description: "Defina que tipo de conteúdo você vai postar em cada dia da semana.",
        activities: [
          {
            id: "planejamento",
            type: "table",
            columns: ["Dia", "Tipo de Conteúdo", "Tema/Tópico"]
          }
        ]
      },
      {
        title: "Compromisso de Consistência",
        description: "Marque os compromissos que você está disposta a assumir:",
        activities: [
          {
            id: "compromissos",
            type: "checkbox",
            options: [
              "Postar pelo menos 3x por semana",
              "Responder comentários em até 24h",
              "Fazer stories diariamente",
              "Fazer pelo menos 1 live por mês",
              "Engajar com 10 perfis por dia",
              "Revisar métricas semanalmente"
            ]
          }
        ]
      }
    ]
  }
];
